// src/pages/AiCourseListPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "../ui/BottomNav";
import AiHyeonmuImage from "../assets/ai-hyeonmu.png";
import BackImage from "../assets/back.png";

// 샘플 코스 데이터
const COURSES = [
  {
    id: 1,
    title: "로컬 맛집 완전 정복 코스",
    region: "의정부",
    type: "당일치기",
  },
  {
    id: 2,
    title: "감성 카페 & 독립 서점 코스",
    region: "파주",
    type: "반나절",
  },
  {
    id: 3,
    title: "자연 속 힐링 코스",
    region: "의정부",
    type: "당일치기",
  },
  {
    id: 4,
    title: "로컬 맛집 완전 정복 코스",
    region: "의정부",
    type: "당일치기",
  },
  {
    id: 5,
    title: "로컬 맛집 완전 정복 코스",
    region: "의정부",
    type: "당일치기",
  },
];

export default function AiCourseListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const regionFromResult = location.state?.region || "의정부";

  // 필요하면 지역별 필터링
  const filteredCourses = COURSES.filter(
    (c) => c.region === regionFromResult || regionFromResult === "의정부"
  );

  const handleCourseClick = (course) => {
    navigate("/course", {
      state: {
        region: course.region,
        title: course.title,
        courseId: course.id,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 헤더 */}
      <header className="pt-4 px-4 flex items-center">
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
      </header>

      {/* 제목 + 현무 이미지 */}
      <section className="flex justify-center mt-6 mb-4">
         <div className="flex items-center gap-3"></div>
        <p className="text-[20px] leading-snug font-semibold text-[#974E00]  text-center">
          AI 현무가 제안하는
          <br />
          n가지 여행 코스
        </p>

        {/* 이미지 위치 */}
        <img
          src={AiHyeonmuImage}
          alt="AI 현무 캐릭터"
          className="w-[66px] h-[66px] object-contain"
        />
      </section>

      {/* 스크롤 가능한 코스 리스트 */}
      <main className="mt-6 flex-1 overflow-y-auto px-4 pb-24">
        <div className="flex flex-col gap-4">
          {filteredCourses.map((course) => (
            <button
              key={course.id}
              type="button"
              onClick={() => handleCourseClick(course)}
              className="w-full bg-[#FFF4E8] rounded-[16px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] flex items-center px-5 py-3 mt-5 active:scale-[0.99] transition-transform"
            >
              {/* 왼쪽 썸네일 (첫 번째 사진처럼) */}
              <div className="w-16 h-16 rounded-[12px] overflow-hidden mr-3 flex-shrink-0">
                <img
                  src="/images/sample-course-thumbnail.jpg" // 실제 이미지 경로로 바꿔
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 가운데 텍스트 */}
              <div className="flex-1 text-left">
                <p className="text-[16px] font-semibold text-[#974E00]">
                  {course.title}
                </p>
                <p className="mt-1 text-[14px] text-[#B2B2B2]">
                  {course.region} | {course.type}
                </p>
              </div>

              {/* 오른쪽 작은 아이콘 자리 (선택) */}
              <div className="ml-2 flex items-center justify-center">
                {/* 필요하면 여기에 작은 이미지/아이콘 추가 */}
                <span className="text-[25px] text-[#C8802A]">☕</span>
              </div>
            </button>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
