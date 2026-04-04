import { imageService } from "../../services/imageService";
import { supabaseService } from "../../services/supabase/services/supabaseService";

export const teamService = {
    // TEAMS
    /**
   * Obtiene todos los equipos donde el usuario es miembro
   * y agrega su rol dentro del equipo.
   * @param {string} userId - ID del usuario logueado
   * @returns {Array} Lista de equipos con rol incluido
   */
    async getTeamsByUser(userId) {
        try {
            // Traer solo las membresías del usuario, expandiendo info del equipo
            const data = await supabaseService.db.getAll("team_memberships", `
        role,
        profiles(*),
        teams(*),
        active_from,
        active_to
      `);

            //console.log("data:", data);

            // Filtrar solo las filas donde user_id coincida
            const userTeams = data.filter(m => m.profiles.user_id === userId);

            // Mapear la estructura para frontend
            return userTeams.map(m => ({
                ...m.teams,
                role: m.role,
                active_from: m.active_from,
                active_to: m.active_to
            }));
        } catch (error) {
            console.error("Error fetching user teams:", error);
            return [];
        }
    },
    async getAllTeams() {
        return supabaseService.db.getAll("teams");
    },
    async getTeamById(teamId) {
        return supabaseService.db.getById("teams", teamId, "team_id");
    },
    async getTeamsByName(name) {
        return supabaseService.db.getAll("teams", `*`).then(data =>
            data.filter(t => t.name.toLowerCase().includes(name.toLowerCase()))
        );
    },
    async createTeam({
        name,
        creatorId,
        foundation_date,
        logoFile
    }) {
        let team = null;

        try {
            // 1️⃣ Crear team
            team = await supabaseService.db.create("teams", {
                name,
                creator_id: creatorId,
                foundation_date
            });

            // 2️⃣ Crear membership (IMPORTANTE: coherente con foundation_date)
            await supabaseService.db.create("team_memberships", {
                team_id: team.team_id,
                user_id: creatorId,
                role: "creator",
                active_from: foundation_date
            });

            // 3️⃣ Crear post fundacional (usar tu propio service)
            await this.postMemory({
                teamId: team.team_id,
                userId: creatorId,
                title: "Fundación del equipo",
                content: `Este equipo fue fundado el ${new Date(foundation_date).toLocaleDateString("es-ES", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase()}`,
                date: foundation_date
            });

            // 4️⃣ Subir logo (opcional)
            let logoUrl = null;

            if (logoFile) {

                const filePath = `${team.team_id}/logo.webp`;

                const { error: uploadError } = await supabaseService.storage.upload(
                    "team-pics",
                    filePath,
                    logoFile
                );

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabaseService.supabase
                    .storage
                    .from("team-pics")
                    .getPublicUrl(filePath);

                logoUrl = publicUrlData.publicUrl;

                // actualizar team
                await supabaseService.db.update(
                    "teams",
                    team.team_id,
                    {
                        team_pic: logoUrl,
                        updated_at: new Date()
                    },
                    "team_id"
                );
            }

            return {
                ...team,
                team_pic: logoUrl
            };

        } catch (error) {

            console.error("Error creating team:", error);

            // 🔥 rollback básico
            if (team?.team_id) {
                await supabaseService.db.remove("teams", team.team_id, "team_id");
            }

            throw error;
        }
    },
    async deleteTeam({ teamId }) {
        await supabaseService.db.remove("teams", teamId, "team_id");
    },

    // TEAM MEMBERSHIPS
    async joinTeam({ teamId, userId }) {
        // Evitar que un usuario se una dos veces
        const exists = await supabaseService.db.getAll(
            "team_memberships",
            "*",
            { team_id: teamId, user_id: userId }
        );

        if (exists.length > 0) return exists[0];

        return supabaseService.db.create("team_memberships", {
            team_id: teamId,
            user_id: userId,
            role: "member",
            active_from: new Date().toISOString().split("T")[0]
        });
    },
    async leaveTeam({ teamId, userId }) {
        const { error } = await supabaseService.supabase
            .from("team_memberships")
            .delete()
            .eq("team_id", teamId)
            .eq("user_id", userId);

        if (error) throw error;

        return true;
    },

    // TEAM POST MEMORYES
    async postMemory({ teamId, userId, title, content, date, files = [] }) {
        try {
            // 1️⃣ Crear el post
            const post = await supabaseService.db.create("posts", {
                team_id: teamId,
                creator_id: userId,
                title,
                content,
                post_date: date
            });

            // 2️⃣ Si no hay archivos, terminar
            if (!files || files.length === 0) {
                return post;
            }

            // 3️⃣ Subir archivos y registrar media
            const mediaPromises = files.map(async ({ file }) => {

                let processedFile = file;

                if (file.type.startsWith("image")) {
                    try {
                        processedFile = await imageService.compressToWebP(file, {
                            maxDimension: 1080,
                            initialQuality: 0.8
                        });

                        console.log("ORIGINAL:", file.size / 1024, "KB");
                        console.log("PROCESADO:", processedFile.size / 1024, "KB");

                    } catch (e) {
                        console.warn("Compression failed, using original", e);
                    }
                }

                const filePath = `${post.post_id}/${Date.now()}_${processedFile.name}`;

                // subir a storage
                const { error: uploadError } = await supabaseService.storage.upload(
                    "post-media",
                    filePath,
                    processedFile,
                    {
                        contentType: processedFile.type
                    }
                );

                if (uploadError) throw uploadError;

                // obtener URL pública
                const { data: publicUrlData } = supabaseService.supabase
                    .storage
                    .from("post-media")
                    .getPublicUrl(filePath);

                const mediaUrl = publicUrlData.publicUrl;

                // determinar tipo
                const mediaType = file.type.startsWith("video")
                    ? "video"
                    : "image";

                // guardar en DB
                return supabaseService.db.create("post_media", {
                    post_id: post.post_id,
                    media_url: mediaUrl,
                    media_type: mediaType
                });
            });

            await Promise.all(mediaPromises);

            return post;

        } catch (error) {
            console.error("Error creating post with media:", error);
            throw error;
        }
    },

    async deleteTimelinePost(postId) {
        try {
            // 1️⃣ Obtener media asociada
            const { data: media, error: mediaError } = await supabaseService.supabase
                .from("post_media")
                .select("media_url")
                .eq("post_id", postId);

            if (mediaError) throw mediaError;

            // 2️⃣ Eliminar archivos del storage
            if (media && media.length > 0) {
                const paths = media.map(m => {
                    // convertir URL → path
                    const url = new URL(m.media_url);
                    return url.pathname.split("/post-media/")[1];
                });

                const { error: storageError } = await supabaseService.supabase
                    .storage
                    .from("post-media")
                    .remove(paths);

                if (storageError) throw storageError;
            }

            // 3️⃣ Eliminar post (esto debería borrar post_media si tienes CASCADE)
            const { error: deleteError } = await supabaseService.supabase
                .from("posts")
                .delete()
                .eq("post_id", postId);

            if (deleteError) throw deleteError;

            return true;

        } catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    },
    /**
     * Obtiene un post específico por su ID, incluyendo el perfil del creador,
     * el rol que tenía en ese equipo y la media asociada.
     * @param {string} postId - ID del post a buscar
     */
    async getPostById(postId) {
        try {
            const { data, error } = await supabaseService.supabase
                .from("posts_with_role") // Usamos la misma vista que el timeline para consistencia
                .select(`
                    post_id,
                    title,
                    content,
                    post_date,
                    created_at,
                    creator_id,
                    role,
                    profiles!posts_creator_id_fkey (
                        username,
                        display_name,
                        profile_pic
                    ),
                    post_media (
                        media_url,
                        media_type
                    )
                `)
                .eq("post_id", postId)
                .single(); // Solo esperamos un resultado

            if (error) throw error;
            if (!data) return null;

            // Mapeamos al formato que espera tu componente PostPage
            return {
                id: data.post_id,
                title: data.title,
                text: data.content,
                date: data.post_date,
                role: data.role,
                creator: {
                    id: data.creator_id,
                    name: data.profiles?.display_name || data.profiles?.username,
                    avatar: data.profiles?.profile_pic,
                    role: data.role || "member"
                },
                media: (data.post_media || []).map(m => ({
                    url: m.media_url,
                    type: m.media_type
                }))
            };
        } catch (error) {
            console.error("Error fetching post by ID:", error);
            throw error;
        }
    },

    async postForum({ teamId, userId, title, content, date, files = [] }) {
        try {
            // Cambiar "post_forum" por "forum_posts"
            const post = await supabaseService.db.create("forum_posts", {
                team_id: teamId,
                creator_id: userId,
                title,
                content,
                post_date: date
            });

            // Manejo de archivos sigue igual (si lo implementas)
            return post;

        } catch (error) {
            console.error("Error creating forum post:", error);
            throw error;
        }
    },
    async getForumPosts(teamId) {
        const { data, error } = await supabaseService.supabase
            .from("forum_posts")
            .select(`
      forum_post_id,
      team_id,
      creator_id,
      title,
      content,
      post_date,
      created_at,
      creator:profiles(display_name)
    `)
            .eq("team_id", teamId)
            .order("post_date", { ascending: false });

        if (error) throw error;
        return data;
    },

    // TIMELINE
    async getTimeline(teamId, {
        limit = 10,
        offset = 0,
        year = null,
        month = null
    } = {}) {
        let query = supabaseService.supabase
            .from("posts_with_role")
            .select(`
            post_id,
            title,
            content,
            post_date,
            created_at,
            creator_id,
            role,
            profiles!posts_creator_id_fkey (
                username,
                display_name,
                profile_pic
            ),
            post_media (
                media_url,
                media_type
            )
        `)
            .eq("team_id", teamId);

        // ===============================
        // FILTRO POR AÑO
        // ===============================
        if (year) {
            query = query.gte("post_date", `${year}-01-01`)
                .lte("post_date", `${year}-12-31`);
        }

        // ===============================
        // FILTRO POR MES
        // ===============================
        if (year && month) {
            const start = `${year}-${String(month).padStart(2, "0")}-01`;

            const endDate = new Date(year, month, 0); // último día del mes
            const end = `${year}-${String(month).padStart(2, "0")}-${endDate.getDate()}`;

            query = query.gte("post_date", start)
                .lte("post_date", end);
        }

        // ===============================
        // ORDEN + PAGINACIÓN
        // ===============================
        const { data, error } = await query
            .order("post_date", { ascending: false })
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return data.map(p => ({
            id: p.post_id,
            title: p.title,
            text: p.content,
            date: p.post_date,
            created: p.created_at,
            role: p.role,
            creator: {
                id: p.creator_id,
                name: p.profiles?.display_name || p.profiles?.username,
                avatar: p.profiles?.profile_pic
            },
            media: (p.post_media || []).map(m => ({
                url: m.media_url,
                type: m.media_type
            }))
        }));
    },

    // ADMIN MEMBERSHIP ROLES
    async getTeamMembers(teamId) {
        const data = await supabaseService.db.getAll(
            "team_memberships",
            "user_id, role, active_from, active_to, profiles(username, display_name, profile_pic)",
            { team_id: teamId }
        );

        return data.map(m => ({
            user_id: m.user_id,
            username: m.profiles.username,
            role: m.role,
            active_from: m.active_from,
            active_to: m.active_to,
            display_name: m.profiles.display_name,
            profile_pic: m.profiles.profile_pic
        }));
    },
    async changeMemberRole({ teamId, userId, role }) {
        const { data, error } = await supabaseService.supabase
            .from("team_memberships")
            .update({ role })
            .eq("team_id", teamId)
            .eq("user_id", userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },
    async updateMemberDates({ teamId, userId, active_from, active_to }) {
        const payload = {
            updated_at: new Date()
        };

        if (active_from !== undefined) payload.active_from = active_from;
        if (active_to !== undefined) payload.active_to = active_to;

        const { data, error } = await supabaseService.supabase
            .from("team_memberships")
            .update(payload)
            .eq("team_id", teamId)
            .eq("user_id", userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },
    async getJoinRequests(teamId) {
        // Implementa tu lógica para solicitudes pendientes
        return []; // placeholder
    },

    // REDES
    async toggleLike({ postId, userId }) {
        try {
            // verificar si ya existe
            const { data: existing, error: checkError } = await supabaseService.supabase
                .from("post_likes")
                .select("*")
                .eq("post_id", postId)
                .eq("user_id", userId)
                .maybeSingle();

            if (checkError) throw checkError;

            // si existe → unlike
            if (existing) {
                const { error } = await supabaseService.supabase
                    .from("post_likes")
                    .delete()
                    .eq("post_id", postId)
                    .eq("user_id", userId);

                if (error) throw error;

                return { liked: false };
            }

            // si no existe → like
            const { error } = await supabaseService.supabase
                .from("post_likes")
                .insert({
                    post_id: postId,
                    user_id: userId
                });

            if (error) throw error;

            return { liked: true };

        } catch (error) {
            console.error("Error toggling like:", error);
            throw error;
        }
    },
    async getPostLikes(postId) {
        const { data, error } = await supabaseService.supabase
            .from("post_likes")
            .select("user_id")
            .eq("post_id", postId);

        if (error) throw error;

        return {
            count: data.length,
            users: data.map(l => l.user_id)
        };
    },
    async getPostComments(postId) {
        const { data, error } = await supabaseService.supabase
            .from("post_comments")
            .select(`
            comment_id,
            content,
            created_at,
            creator_id,
            profiles (
                username,
                display_name,
                profile_pic
            )
        `)
            .eq("post_id", postId)
            .order("created_at", { ascending: true });

        if (error) throw error;

        return data.map(c => ({
            id: c.comment_id,
            text: c.content,
            date: c.created_at,
            creator: {
                id: c.creator_id,
                name: c.profiles?.display_name || c.profiles?.username,
                avatar: c.profiles?.profile_pic
            }
        }));
    },
    async addComment({ postId, userId, content }) {
        const { data, error } = await supabaseService.supabase
            .from("post_comments")
            .insert({
                post_id: postId,
                creator_id: userId,
                content
            })
            .select()
            .single();

        if (error) throw error;

        return data;
    },
    async deleteComment({ commentId }) {
        const { error } = await supabaseService.supabase
            .from("post_comments")
            .delete()
            .eq("comment_id", commentId);

        if (error) throw error;

        return true;
    }

    /*async searchUsersNotInTeam(teamId, query) {
        // Filtra usuarios que no estén en el equipo y coincidan con query
        return supabaseService.db.getAll("profiles", `*`).then(users =>
            users.filter(u => u.username.includes(query))
        );
    },

    async removeMember({ teamId, userId }) {
        return supabaseService.db.remove("team_memberships", userId, "user_id");
    },

    async inviteUser({ teamId, username }) {
        // Aquí podrías crear un registro en "invitations" o enviar notificación
        console.log(`Invited ${username} to team ${teamId}`);
    },*/


};