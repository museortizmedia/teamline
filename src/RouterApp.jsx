import { useEffect, useState } from "react";
import { useAuth } from "./pages/Auth/AuthContext";

const routes = {
    "/": "auth",
    "/dashboard": "dashboard",
    "/forum": "forum",
    "/profile": "profile",
    "/team-admin": "teamAdmin",
    "/newpost": "newpost",
};

export function useRouterApp() {
    const { isAuthenticated } = useAuth();

    // ===============================
    // 🔍 PATH → PAGE
    // ===============================
    const getPageFromPath = (path) => {
        if (path.startsWith("/t/")) return "timeline";
        if (path.startsWith("/p/")) return "post";
        return routes[path] || "auth";
    };

    // ===============================
    // 🔁 PAGE → PATH
    // ===============================
    const getPathFromPage = (page, params = {}) => {
        switch (page) {
            case "timeline":
                return params.teamId ? `/t/${params.teamId}` : "/";
            case "post":
                return params.postId ? `/p/${params.postId}` : "/";
            case "dashboard":
                return "/dashboard";
            case "forum":
                return "/forum";
            case "profile":
                return "/profile";
            case "teamAdmin":
                return "/team-admin";
            case "newpost":
                return "/newpost";
            default:
                return "/";
        }
    };

    // ===============================
    // 📦 STATE
    // ===============================
    const [page, setPageState] = useState(() =>
        getPageFromPath(window.location.pathname)
    );

    const [params, setParams] = useState(() =>
        getParamsFromPath(window.location.pathname)
    );

    // ===============================
    // 🚀 NAVEGACIÓN SEGURA
    // ===============================
    const setPage = (nextPage, nextParams = {}) => {
        const path = getPathFromPage(nextPage, nextParams);

        // 🔥 evitar navegación redundante
        if (
            nextPage === page &&
            JSON.stringify(nextParams) === JSON.stringify(params)
        ) {
            return;
        }

        window.history.pushState({}, "", path);
        setPageState(nextPage);
        setParams(nextParams);
    };

    // ===============================
    // 🔄 BACK / FORWARD
    // ===============================
    useEffect(() => {
        const handlePopState = () => {
            const newPage = getPageFromPath(window.location.pathname);
            const newParams = getParamsFromPath(window.location.pathname);

            setPageState(newPage);
            setParams(newParams);
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    // ===============================
    // 🔐 GUARD (CORREGIDO)
    // ===============================
    useEffect(() => {
        const publicPages = ["auth", "timeline", "post"];

        // 🔴 SOLO bloquear páginas privadas
        if (!isAuthenticated && !publicPages.includes(page)) {
            if (page !== "auth") {
                setPage("auth");
            }
            return;
        }

        // 🟢 usuario logueado no debe ver auth
        if (isAuthenticated && page === "auth") {
            setPage("dashboard");
        }

    }, [page, isAuthenticated]);

    // ❌ ELIMINADO: ya no forzamos auth global
    // (esto era lo que rompía /post)

    // ===============================
    // 🔎 PARAMS PARSING
    // ===============================
    function getParamsFromPath(path) {
        if (path.startsWith("/t/")) {
            const [, , teamId] = path.split("/");
            return { teamId };
        }

        if (path.startsWith("/p/")) {
            const [, , postId] = path.split("/");
            return { postId };
        }

        return {};
    }

    return { page, setPage, params };
}