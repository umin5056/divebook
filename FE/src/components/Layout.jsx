import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar, Page } from "konsta/react";
import BottomNav from "./BottomNav";
import { logout } from "../api/auth";
import { DoorOpen } from "lucide-react";

export function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <Navbar
        title="DiveBook"
        subtitle=""
        className="top-0 sticky py-1"
        right={<DoorOpen onClick={handleLogout} />}
      />
      <Page className="py-15 flex-1 overflow-y-auto">
        <Outlet />
      </Page>
      <BottomNav />
    </div>
  );
}
