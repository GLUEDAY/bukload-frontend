import { Home, UserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-md flex items-center justify-around py-2">
        <Link
          to="/"
          className={`flex flex-col items-center ${
            location.pathname === "/" ? "text-[#F07818]" : "text-gray-700"
          }`}
        >
          <Home className="h-8 w-6" />
          <span className="text-xl mt-0.1">홈</span>
        </Link>

        <Link
          to="/mypage"
          className={`flex flex-col items-center ${
            location.pathname === "/mypage" ? "text-[#F07818]" : "text-gray-700"
          }`}
        >
          <UserRound className="h-8 w-6" />
          <span className="text-xl mt-0.1">마이페이지</span>
        </Link>
      </div>
    </nav>
  );
}
