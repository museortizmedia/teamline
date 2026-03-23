import { useAuth } from "./pages/Auth/AuthContext";

import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";

import AuthPage from "./pages/Auth/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import TimelinePage from "./pages/Timeline/TimelinePage";
import ForumPage from "./pages/ForumPage";
import ProfilePage from "./pages/ProfilePage";
import TeamAdminPage from "./pages/TeamAdmin/TeamAdminPage";

import { useRouterApp } from "./RouterApp";
import CreateMemoryPage from "./pages/Memory/CreateMemoryPage";
import { useEffect } from "react";
import PostPage from "./pages/PostPage";

export default function App() {
  const { loading, isAuthenticated } = useAuth();
  const { page, setPage, params } = useRouterApp();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [page]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar page={page} setPage={setPage} isAuth={isAuthenticated} />

      <main className="pt-20 px-4 flex-1 overflow-y-auto pb-24">
        {isAuthenticated
          ? renderPrivatePage(page, setPage, params)
          : renderPublicPage(page, setPage, params)}
      </main>

      {isAuthenticated && <BottomNav page={page} setPage={setPage} isAuth={isAuthenticated} />}
    </div>
  );
}

// ==========================================
// PUBLIC PAGES
// ==========================================
function renderPublicPage(page, setPage, params) {
  switch (page) {
    case "timeline":
      return (
        <TimelinePage
          teamId={params.teamId}
          openNewPost={() => setPage("newpost")}
        />
      );
    case "post":
      return <PostPage postId={params.postId} setPage={setPage} />;
    default:
      return <AuthPage defaultMode={params.defaultMode || "login"} setPage={setPage} />;
  }
}

// ==========================================
// PRIVATE PAGES
// ==========================================
function renderPrivatePage(page, setPage, params) {
  switch (page) {
    case "timeline":
      return <TimelinePage teamId={params.teamId} setPage={setPage} />;
    case "forum":
      return <ForumPage setPage={setPage} />;
    case "profile":
      return <ProfilePage setPage={setPage} />;
    case "teamAdmin":
      return <TeamAdminPage setPage={setPage} />;
    case "newpost":
      return <CreateMemoryPage isOpen={true} onClose={() => setPage("timeline")} setPage={setPage} />;
    default:
      return <DashboardPage setPage={setPage} />;
  }
}