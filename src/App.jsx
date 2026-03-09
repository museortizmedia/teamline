import { useState } from "react";
import { useAuth } from "./auth/AuthContext";


import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";

import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import TimelinePage from "./pages/TimelinePage";
import ForumPage from "./pages/ForumPage";
import CreateMemory from "./pages/CreateMemory";
import ProfilePage from "./pages/ProfilePage";
import TeamAdminPage from "./pages/TeamAdminPage";

export default function App() {

  const { isAuthenticated } = useAuth();

  const [page, setPage] = useState("dashboard");

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