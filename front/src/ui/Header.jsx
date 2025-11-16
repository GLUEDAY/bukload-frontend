// src/ui/Header.jsx
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import BackImage from "../assets/back.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function Header({
  title,
  subtitle,
  centered = true,
  showUser = true, // 필요하면 페이지별로 숨길 수 있게 옵션 추가
}) {
  const [loginId, setLoginId] = useState("");

  useEffect(() => {
    if (!showUser) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchMe = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return; // 실패해도 그냥 조용히 패스

        const data = await res.json();
        if (data?.loginId) {
          setLoginId(data.loginId);
        }
      } catch (e) {
        // 헤더라서 경고창까지는 안 띄우고 조용히 무시
        console.error("failed to load user info", e);
      }
    };

    fetchMe();
  }, [showUser]);

  return (
    <header className="relative z-10 px-3 pt-1">
      <div className="relative mx-auto max-w-md flex items-center justify-center">
        {/* 뒤로가기 */}
<button
  type="button"
  onClick={() => history.back()}
  className="absolute left-0  rounded-full hover:bg-black/5"
  aria-label="뒤로가기"
>
  <img
    src={BackImage}
    alt="뒤로가기"
    className="w-8 h-8 object-contain"
  />
</button>


        {/* 타이틀/서브타이틀 */}
        <div className={centered ? "text-center" : ""}>

          <h1 className="text-[35px] leading-7 font-extrabold text-[#F07818]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-[16px] text-[#8A6B52]">{subtitle}</p>
          )}

        </div>

        {/* 우측 상단 로그인 아이디 + 님 */}
        {showUser && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[13px] text-gray-400">
            {loginId && <span>{loginId} 님</span>}
          </div>
        )}
      </div>
    </header>
  );
}
