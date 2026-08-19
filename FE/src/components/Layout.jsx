import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar, Page } from "konsta/react";
import BottomNav from "./BottomNav";

export function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="h-full flex flex-col justify-between">
      <Navbar title="DiveBook" subtitle="" className="top-0 sticky py-1" />
      <Page className="py-15 flex-1 overflow-y-auto">
        <Outlet />
      </Page>
      <BottomNav />
    </div>
  );
}
