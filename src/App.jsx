import { useState } from "react";
import { useAuth } from "./auth/AuthContext";


import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";

import AuthPage from "./pages/Auth/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import TimelinePage from "./pages/TimelinePage";
import ForumPage from "./pages/ForumPage";
import ProfilePage from "./pages/ProfilePage";
import TeamAdminPage from "./pages/TeamAdminPage";
import Test from "./services/supabase/test";

export default function App() {

  const { loading, isAuthenticated } = useAuth();

  const [page, setPage] = useState("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderPage = () => {

    switch (page) {

      case "timeline":
        return <TimelinePage openNewPost={() => setPage("newpost")} />;

      case "forum":
        return <ForumPage />;

      case "profile":
        return <ProfilePage />;

      case "teamAdmin":
        return <TeamAdminPage />;

      default:
        return <DashboardPage />;

    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light bg-background-dark text-white">

      <TopBar setPage={setPage} />

      <main className="pt-20 px-4 flex-1 overflow-y-auto pb-24">
        {renderPage()}
      </main>

      <BottomNav current={page} setPage={setPage} />

    </div>
  );
}