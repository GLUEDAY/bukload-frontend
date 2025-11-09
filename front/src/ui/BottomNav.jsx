import { Home, UserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const { pathname } = useLocation();

  // 로그인/회원가입 같은 곳만 숨기고 싶을 때 (원하면 제거 가능)
  const HIDE_ROUTES = ["/login", "/signup"];
  if (HIDE_ROUTES.includes(pathname)) return null;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[#E6D9CC] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-md flex items-center justify-around py-2">
        {/* 홈 */}
        <Link
          to="/"
          className={`flex flex-col items-center transition-colors ${
            pathname === "/" ? "text-[#F07818]" : "text-gray-600"
          }`}
        >
          <Home
            className={`h-6 w-6 ${
              pathname === "/" ? "text-[#F07818]" : "text-gray-500"
            }`}
          />
          <span
            className={`mt-0.5 text-xs font-medium ${
              pathname === "/" ? "text-[#F07818]" : "text-gray-600"
            }`}
          >
            홈
          </span>
        </Link>

        {/* 마이페이지 */}
        <Link
          to="/mypage"
          className={`flex flex-col items-center transition-colors ${
            pathname === "/mypage" ? "text-[#F07818]" : "text-gray-600"
          }`}
        >
          <UserRound
            className={`h-6 w-6 ${
              pathname === "/mypage" ? "text-[#F07818]" : "text-gray-500"
            }`}
          />
          <span
            className={`mt-0.5 text-xs font-medium ${
              pathname === "/mypage" ? "text-[#F07818]" : "text-gray-600"
            }`}
          >
            마이페이지
          </span>
        </Link>
      </div>

      {/* iOS 안전영역 여백 */}
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </nav>
  );
}