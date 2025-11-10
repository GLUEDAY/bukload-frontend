// src/pages/SavedCoursePage.jsx
import { useNavigate } from "react-router-dom";
import BottomNav from "../ui/BottomNav";
import BackImage from "../assets/back.png";

const dummyCourses = [
  {
    id: 1,
    title: "로컬 맛집 완전 정복 코스",
    region: "의정부",
    type: "당일치기",
    icon: "🍜",
  },
  {
    id: 2,
    title: "감성 카페 & 독립 서점 코스",
    region: "파주",
    type: "반나절",
    icon: "☕",
  },
  {
    id: 3,
    title: "로컬 맛집 완전 정복 코스",
    region: "의정부",
    type: "당일치기",
    icon: "🍜",
  },
  {
    id: 4,
    title: "감성 카페 & 독립 서점 코스",
    region: "파주",
    type: "반나절",
    icon: "☕",
  },
  {
    id: 5,
    title: "로컬 맛집 완전 정복 코스",
    region: "의정부",
    type: "당일치기",
    icon: "🍜",
  },
  {
    id: 6,
    title: "감성 카페 & 독립 서점 코스",
    region: "파주",
    type: "반나절",
    icon: "☕",
  },
];

export function SavedCoursePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* 상단 헤더 */}
      <header className="relative flex items-center px-4 pt-6 pb-10">
        {/* 뒤로가기 버튼 */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"
        >
          <img
                         src={BackImage}
                         alt="화살표"
                         className="w-25 h-25 object-contain"
                       />
        </button>

        {/* 제목 */}
        <div className="flex-1 flex items-center justify-end gap-1">
          <span className="text-[24px]">📁</span>
          <span className="text-[24px] font-bold text-[#974E00]">
            저장된 코스
          </span>
        </div>

        {/* 오른쪽 여백 (좌우 균형 맞추기용) */}
        <div className="w-3" />
      </header>

      {/* 코스 리스트 영역 */}
      <main className="flex-1 px-10 pt-2 pb-24 overflow-y-auto">
        <div className="flex flex-col gap-8 pb-2">
          {dummyCourses.map((course) => (
            <button
              key={course.id}
              type="button"
              className="w-full flex items-center gap-8 rounded-xl bg-[#FFF4E8] shadow-[0_4px_10px_rgba(1,4,4,0.3)] px-5 py-5 active:scale-[0.99] transition"
            >
              {/* 썸네일 (이미지 없어서 박스로 표현, 나중에 img로 교체 가능) */}
              <div className="w-[60px] h-[60px] rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-tr from-[#D94E27] via-[#FF9056] to-[#F8D192] flex items-center justify-center">
                <span className="text-3xl text-white">🏙️</span>
              </div>

              {/* 텍스트 영역 */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[16px] font-bold text-[#974E00] leading-snug">
                    {course.title}
                  </p>
                  <span className="text-[20px] leading-none">{course.icon}</span>
                </div>
                <p className="mt-1 text-[14px] text-[#B2B2B2] text-left">
                  {course.region} | {course.type}
                </p>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNav active="mypage" />
    </div>
  );
}
