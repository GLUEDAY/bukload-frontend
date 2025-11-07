import { Home, UserRound } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t bg-white backdrop-blur">
      <div className="mx-auto max-w-md flex items-center justify-around py-2">
        <a href="/" className="flex flex-col items-center text-gray-700">
          <Home className="h-8 w-8" />
          <span className="text-l mt-0.1">홈</span>
        </a>
        <a href="/mypage" className="flex flex-col items-center text-gray-700">
          <UserRound className="h-8 w-8" />
          <span className="text-l mt-0.1">마이페이지</span>
        </a>
      </div>
    </nav>
  );
}
