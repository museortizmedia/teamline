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
        if (path.startsWith("/t/")) return "timeline"; // team timeline
        if (path.startsWith("/p/")) return "post";     // post individual
        return routes[path] || "auth";
    };

    // ===============================
    // 🔁 PAGE → PATH
    // ===============================
    const getPathFromPage = (page, params = {}) => {
        switch (page) {
            case "timeline":
                if (!params.teamId) {
                    console.warn("Timeline requiere teamId");
                    return "/";
                }
                return `/t/${params.teamId}`;
            case "post":
                if (!params.postId) {
                    console.warn("Post requiere postId");
                    return "/";
                }
                return `/p/${params.postId}`;
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
    const [page, setPageState] = useState(() => getPageFromPath(window.location.pathname));
    const [params, setParams] = useState(() => getParamsFromPath(window.location.pathname));

    // ===============================
    // 🚀 NAVEGACIÓN
    // ===============================
    const setPage = (nextPage, nextParams = {}) => {
        const path = getPathFromPage(nextPage, nextParams);
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
    // 🔐 GUARD
    // ===============================
    useEffect(() => {
        const publicPages = ["auth", "timeline", "post"]; // post es público
        if (!isAuthenticated && !publicPages.includes(page)) setPage("auth");
        if (isAuthenticated && page === "auth") setPage("dashboard");
    }, [page, isAuthenticated]);

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