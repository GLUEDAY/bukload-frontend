import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../ui/Header";
import BottomNav from "../ui/BottomNav";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAlert } from "../context/AlertContext";

const API = import.meta.env.VITE_API_BASE_URL || "/api";

const authHeader = () => {
  const t = localStorage.getItem("accessToken");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export default function MyPage() {
  const nav = useNavigate();
  const { showAlert } = useAlert();

  const [points, setPoints] = useState({ total: 0, loading: true });
  const [saved, setSaved] = useState({ list: [], loading: true });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    // 아예 토큰이 없으면 마이페이지 접근 불가 → 로그인으로 보냄
    if (!token) {
      showAlert("로그인이 필요한 서비스입니다.");
      nav("/login", { replace: true });
      return;
    }

    // 새 명세: GET /points/summary → { totalPoint }
    (async () => {
      try {
        const r = await fetch(`${API}/points/summary`, {
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });

        if (r.status === 401 || r.status === 403) {
          // 토큰 만료 or 무효 → 로그인 화면으로
          showAlert("로그인 세션이 만료되었어요. 다시 로그인 해주세요.");
          nav("/login", { replace: true });
          return;
        }

        if (!r.ok) {
          throw new Error("포인트 요약 조회 실패");
        }

        const j = await r.json();
        setPoints({ total: j.totalPoint ?? 0, loading: false });
      } catch (e) {
        console.error(e);
        setPoints({ total: 0, loading: false });
      }
    })();

    // 🔹 새 명세: GET /me/saved-courses → 저장된 코스 목록
    (async () => {
      try {
        const r = await fetch(`${API}/me/saved-courses`, {
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });

        if (r.status === 401 || r.status === 403) {
          showAlert("로그인 세션이 만료되었어요. 다시 로그인 해주세요.");
          nav("/login", { replace: true });
          return;
        }

        if (!r.ok) {
          throw new Error("저장된 코스 목록 조회 실패");
        }

        const j = await r.json();
        const list = Array.isArray(j) ? j : [];

        setSaved({ list, loading: false });
      } catch (e) {
        console.error(e);
        setSaved({ list: [], loading: false });
      }
    })();
  }, [nav, showAlert]);

  const goBack = () => nav(-1);

  const logout = () => {
    localStorage.removeItem("accessToken");
    nav("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF6ED] to-[#FDF7F1]">
      <Header
        left={
          <button
            onClick={goBack}
            className="p-2 rounded-full hover:bg-black/5"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-5 h-5 text-[#8A6B52]" />
          </button>
        }
        title="마이페이지"
      />

      <main className="px-4 pb-28 max-w-xl mx-auto">
        {/* 포인트 카드 */}
        <section className="mt-4">
          <div className="rounded-2xl border border-[#E6D9CC] bg-white/70 p-5 text-center shadow-sm">
            <p className="text-[#8A6B52] text-sm">나의 북로드 포인트</p>
            <div className="mt-1 text-3xl font-extrabold text-[#2A2A2A]">
              {points.loading ? "···" : points.total.toLocaleString()}{" "}
              <span className="text-[#F07818]">P</span>
            </div>

            <button
              onClick={() =>
                showAlert(
                  "포인트 스토어는 준비 중이에요! 다음 업데이트에서 만나요 :)"
                )
              }
              className="mt-3 text-xs px-3 py-2 rounded-full border border-[#E6D9CC] hover:bg-[#FFF5EC]"
            >
              포인트 스토어 가기
            </button>
          </div>
        </section>

        {/* 저장된 코스 */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[#8A6B52] text-sm font-semibold">저장된 코스</h3>
            <Link
              to="/saved-courses"
              className="flex items-center text-xs text-[#8A6B52] hover:underline"
            >
              전체보기 <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3">
            {saved.loading && (
              <div className="h-[74px] rounded-xl border border-[#E6D9CC] bg-white/60 animate-pulse" />
            )}

            {!saved.loading && saved.list.length === 0 && (
              <div className="text-sm text-[#8A6B52] border border-dashed border-[#E6D9CC] rounded-xl p-4 text-center">
                저장된 코스가 없어요. 플래너에서 코스를 저장해보세요!
              </div>
            )}

            {saved.list.slice(0, 3).map((c) => (
              <button
                key={c.id}
                onClick={() => nav(`/course/${c.id}`)}
                className="w-full text-left rounded-xl border border-[#E6D9CC] bg-white/70 hover:bg-white shadow-sm p-3 flex items-center gap-3"
              >
                <img
                  src={c.thumb || "/map-placeholder.png"}
                  alt={c.title}
                  className="w-12 h-12 rounded-lg object-cover border border-[#E6D9CC]"
                />
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[#2A2A2A] line-clamp-1">
                    {c.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#8A6B52]">
                    {c.region} · {c.dayTag}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#C9B7A1]" />
              </button>
            ))}
          </div>
        </section>

        {/* 기타 */}
        <section className="mt-8">
          <div className="space-y-2">
            <Link
              to="/account"
              className="block text-center rounded-xl border border-[#E6D9CC] bg-white/70 hover:bg-white py-3 text-sm"
            >
              계정 설정
            </Link>
            <Link
              to="/my-reviews"
              className="block text-center rounded-xl border border-[#E6D9CC] bg-white/70 hover:bg-white py-3 text-sm"
            >
              내가 쓴 후기
            </Link>
            <button
              onClick={logout}
              className="w-full text-center rounded-xl border border-[#E6D9CC] bg-[#F6F2ED] py-3 text-sm text-[#8A6B52] hover:bg-[#EFE7DD]"
            >
              로그아웃
            </button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
