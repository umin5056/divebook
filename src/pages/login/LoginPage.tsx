import { API_BASE_URL } from "../../constants/env";

export default function LoginPage() {
  const handleKakaoLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/kakao`;
  };

  return (
    <div className="h-full flex justify-center-safe items-center bg-blue-100">
      <div className="w-80 flex flex-col gap-10 py-15 px-5 rounded-2xl bg-gray-100 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-blue-400 p-2 rounded-xl text-3xl">🤿</div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600">DIVE BOOK</span>
            <span className="text-xs text-gray-600 font-bold">
              프리다이빙 강습 관리 시스템
            </span>
          </div>
        </div>
        <div className="cursor-pointer" onClick={handleKakaoLogin}>
          <img src="/kakao_login.png" width="400" />
        </div>
      </div>
    </div>
  );
}
