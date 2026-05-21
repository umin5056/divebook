import { Link } from "react-router-dom";
import { useState } from "react";
import { bottomNavItems as navItems } from "../constants/navItems";

const BottomNav = () => {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div className="w-full bg-white border-t border-gray-200">
      <nav className="flex justify-around">
        {navItems.map(({ id, icon: Icon, href }) => (
          <Link
            key={id}
            to={href}
            onClick={() => setActiveNav(id)}
            className={`pt-5 mb-6 pb-2 px-2 ${activeNav === id ? "text-blue-700 border-b-2" : "text-gray-500"}`}
          >
            <Icon size={25} />
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
