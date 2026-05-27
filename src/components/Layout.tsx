import { Outlet } from "react-router-dom";
import { Page } from "konsta/react";
import Header from "./Header.tsx";
import BottomNav from "./BottomNav";

export function Layout() {
  return (
    <div className="h-full flex flex-col justify-between">
      <Header />
      <Page className="py-20 flex-1 overflow-y-auto">
        <Outlet />
      </Page>
      <BottomNav />
    </div>
  );
}
