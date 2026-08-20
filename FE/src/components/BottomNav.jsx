import { Toolbar, ToolbarPane, Link } from "konsta/react";
import { LayoutDashboard, CalendarDays, UserSearch, Cog } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/dashboard", icon: LayoutDashboard, label: "대시보드" },
  { path: "/lesson", icon: CalendarDays, label: "강습" },
  { path: "/student", icon: UserSearch, label: "수강생" },
  { path: "/setting", icon: Cog, label: "설정" },
];

const BottomNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeIndex = tabs.findIndex((tab) => pathname.includes(tab.path));

  return (
    <Toolbar top className="py-3 backdrop-blur-[2px]">
      <ToolbarPane className="w-full">
        <div
          className="absolute top-1 bottom-1 rounded-[inherit] bg-[#008080] shadow-ios-light-glass backdrop-blur-lg transition-transform duration-300"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
        {tabs.map(({ path, icon: Icon }) => (
          <Link
            key={path}
            className={`relative z-10 flex-1 font-bold transition-colors duration-300 ${pathname.includes(path) ? "text-[#fff]" : "text-gray-400"}`}
            onClick={() => navigate(path)}
          >
            <Icon />
          </Link>
        ))}
      </ToolbarPane>
    </Toolbar>
  );
};

export default BottomNav;
