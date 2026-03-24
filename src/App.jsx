import { lazy, Suspense, useEffect } from "react";

import { useAuth } from "./pages/Auth/AuthContext";

import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";

const AuthPage = lazy(() => import("./pages/Auth/AuthPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const TimelinePage = lazy(() => import("./pages/Timeline/TimelinePage"));
const ForumPage = lazy(() => import("./pages/ForumPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const TeamAdminPage = lazy(() => import("./pages/TeamAdmin/TeamAdminPage"));
const PostPage = lazy(() => import("./pages/PostPage"));
const CreateMemoryPage = lazy(() => import("./pages/Memory/CreateMemoryPage"));

import { useRouterApp } from "./RouterApp";

export default function App() {
  const { loading, isAuthenticated } = useAuth();
  const { page, setPage, params } = useRouterApp();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [page]);

  function PageLoader() {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (loading)
    return (
      <PageLoader />
    );

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar page={page} setPage={setPage} isAuth={isAuthenticated} />

      <main className="pt-20 px-4 flex-1 overflow-y-auto pb-24">
        <Suspense fallback={<PageLoader />}>
          {isAuthenticated
            ? renderPrivatePage(page, setPage, params)
            : renderPublicPage(page, setPage, params)}
        </Suspense>
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