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
    (async () => {
      try {
        const r = await fetch(`${API}/points/summary`, { headers: authHeader() });
        const j = await r.json();
        setPoints({ total: j.totalPoint ?? 0, loading: false });
      } catch {
        setPoints({ total: 1500, loading: false });
      }
    })();

    (async () => {
      try {
        const r = await fetch(`${API}/me/saved-courses`, { headers: authHeader() });
        const j = await r.json();
        setSaved({ list: Array.isArray(j) ? j : [], loading: false });
      } catch {
        setSaved({
          list: [
            {
              id: 101,
              title: "로컬 맛집 완전 정복 코스",
              region: "의정부",
              dayTag: "당일치기",
              thumb: "/map-placeholder.png",
            },
            {
              id: 102,
              title: "감성 카페 & 독립 서점 코스",
              region: "파주",
              dayTag: "반나절",
              thumb: "/map-placeholder.png",
            },
          ],
          loading: false,
        });
      }
    })();
  }, []);

  const goBack = () => nav(-1);
  const logout = () => {
    localStorage.removeItem("accessToken");
    nav("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF6ED] to-[#FDF7F1]">
      <Header
        left={
          <button onClick={goBack} className="p-2 rounded-full hover:bg-black/5" aria-label="뒤로가기">
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

            {/* ✅ 문자열만 넘기면 AlertContext가 처리 */}
            <button
              onClick={() =>
                showAlert("포인트 스토어는 준비 중이에요! 다음 업데이트에서 만나요 :)")
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
            <Link to="/saved-courses" className="flex items-center text-xs text-[#8A6B52] hover:underline">
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
                  <p className="text-[13px] font-semibold text-[#2A2A2A] line-clamp-1">{c.title}</p>
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
