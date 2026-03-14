import { authService } from "./authService";
import { dbService } from "./dbService";
import { storageService } from "./storageService";

export const supabaseService = {
    auth: authService,
    db: dbService,
    storage: storageService
};
/*
supabaseService.auth.login(email, password)

supabaseService.db.getAll("products")

supabaseService.storage.upload(
    "productos",
    "1/image.webp",
    file
)
*/