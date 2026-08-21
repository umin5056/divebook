import { MdLogout } from "react-icons/md";
import { logout } from "../api/auth";

export default function SettingPage() {
  const handleLogout = () => {
    logout();
  };
  return (
    <>
      <MdLogout onClick={handleLogout} /> 로그아웃
    </>
  );
}
