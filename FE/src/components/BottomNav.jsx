import { Toolbar, ToolbarPane, Link } from "konsta/react";
import { MdDashboard } from "react-icons/md";
import { FaCalendarAlt, FaCog } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/dashboard", icon: MdDashboard, label: "대시보드" },
  { path: "/lesson", icon: FaCalendarAlt, label: "강습" },
  { path: "/student", icon: BsFillPeopleFill, label: "수강생" },
  { path: "/setting", icon: FaCog, label: "설정" },
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
            onClick={() => navigate(path, { replace: true })}
          >
            <Icon size={20} />
          </Link>
        ))}
      </ToolbarPane>
    </Toolbar>
  );
};

export default BottomNav;
