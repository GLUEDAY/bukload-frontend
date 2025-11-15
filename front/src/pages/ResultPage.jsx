// src/pages/ResultPage.jsx
import { useState, useMemo } from "react";
import BottomNav from "../ui/BottomNav";
import { useLocation, useNavigate } from "react-router-dom";
import LogoImage from "../assets/logo.png";
import { useAlert } from "../context/AlertContext.jsx";

const REGION_OPTIONS = ["의정부", "구리", "양주", "동두천"];

const REGION_TITLE = {
  의정부: "Uijeongbu",
  구리: "Guri",
  양주: "Yangju",
  동두천: "Dongducheon",
};

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();

  // Planner(or 이전 단계)에서 넘어온 AI 응답 기반 데이터들
  const regionFromPlanner = location.state?.region || null;         // AI 추천 지역명 (한글)
  const coursesFromPlanner = location.state?.courses || null;       // 추천 코스 배열
  const metaFromPlanner = location.state?.meta || null;             // { requestId, anchorId }

  const commentFromPlanner = location.state?.comment || null;       // RegionRecommendation.comment
  const tagsFromPlanner = location.state?.tags || null;             // RegionRecommendation.tags(string[])
  const landmarkFromPlanner = location.state?.landmark || null;     // 선택: 대표 랜드마크

  const [showRegionSelector, setShowRegionSelector] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(regionFromPlanner || "의정부");

  // 카드 타이틀/설명에 쓸 표시명 (영문 타이틀)
  const regionTitle = useMemo(
    () => REGION_TITLE[selectedRegion] || selectedRegion,
    [selectedRegion]
  );

  // CTA 클릭 → /ai-courses 로 이동 (state 전달)
  const goToAiCourses = () => {
    // 혹시 AI 추천 코스/메타 정보 없이 들어온 경우, 안내만 살짝 띄워줌
    if (!coursesFromPlanner && !metaFromPlanner) {
      showAlert("AI 추천 코스 정보가 없어 기본 코스를 보여드릴게요.");
    }

    navigate("/ai-courses", {
      state: {
        region: selectedRegion,
        courses: coursesFromPlanner || undefined, // 있으면 그대로 전달
        meta: metaFromPlanner || undefined,
      },
    });
  };

  // 대표 랜드마크 텍스트 (AI/상위 단계에서 landmark 넘겨주면 그거 사용)
  const landmarkText =
    landmarkFromPlanner ||
    `${selectedRegion} 미술도서관`; // 아직 서버에서 안 주면 기존 더미로 fallback

  // Comment 텍스트 (AI comment 우선, 없으면 tags 또는 기존 더미)
  const commentText = (() => {
    if (commentFromPlanner) return commentFromPlanner;

    // tags로 간단한 문구 구성 (선택)
    if (Array.isArray(tagsFromPlanner) && tagsFromPlanner.length > 0) {
      const hashTags = tagsFromPlanner.map((t) => `#${t}`).join(" ");
      return `“${hashTags} 키워드를 고려했을 때, ${selectedRegion}가(이) 이번 여행에 특히 잘 어울려요.”`;
    }

    // 완전 아무 것도 없으면 기존 더미 문구 사용
    return `“#휴식 #힐링 과 #문화 #전시 키워드를 고려했을 때, 예술과 자연이 어우러진 ${selectedRegion}가(이) 적합해요”`;
  })();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 상단 헤더 */}
      <header className="pt-10 pb-4 flex flex-col items-center gap-4">
        <img
          src={LogoImage}
          alt="로고"
          className="w-25 h-25 sm:w-20 sm:h-20 object-contain"
        />
        <p className="text-sm sm:text-base text-[#974E00]">
          AI가 찾아낸 최적의 여행지는..
        </p>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-32">
        <section className="max-w-sm sm:max-w-md md:max-w-lg mx-auto space-y-4">
          {/* 추천 카드 */}
          <div className="w-full bg-[#F3F3FF] rounded-xl shadow-lg overflow-hidden">
            {/* 카드 상단 이미지 영역 */}
            <div className="relative h-50 sm:h-48 bg-[url('/uijeongbu-placeholder.jpg')] bg-cover bg-center">
              <div className="absolute inset-0 bg-[#C7C5FF99]" />
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <h2 className="text-5xl sm:text-4xl font-bold tracking-wide">
                  {regionTitle}
                </h2>
              </div>
            </div>

            {/* 카드 내용 */}
            <div className="px-5 py-4 space-y-2">
              <p className="mt-2 text-sm sm:text-base font-bold text-[#969696] flex items-center justify-center text-center">
                대표 랜드마크 : {landmarkText}
              </p>
              <p className="text-3xl sm:text-3xl font-semibold font-Inter text-[#3151C3] flex items-center justify-center">
                {selectedRegion}
              </p>

              <div className="mt-3 rounded-2xl bg-[#DCDCFF] px-4 py-3">
                <p className="text-[13px] font-bold text-[#4F46E5]">
                  AI 현무&apos;s Comment :
                </p>
                <p className="mt-1 text-[11px] sm:text-xs text-[#1B3696] leading-relaxed">
                  {commentText}
                </p>
                {Array.isArray(coursesFromPlanner) && (
                  <p className="mt-2 text-[11px] sm:text-xs text-[#1B3696]">
                    추천 코스 {coursesFromPlanner.length}개가 준비됐어요!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 메인 CTA 버튼 */}
          <button
            type="button"
            onClick={goToAiCourses}
            className="mt-5 w-full py-5 sm:py-5 rounded-xl bg-[#2DAEA1] text-white text-base sm:text-[17px] font-Inter font-bold shadow-md"
          >
            네, 좋아요! {selectedRegion} 추천 코스 보기
          </button>

          {/* 다른 지역 선택 버튼 */}
          <button
            type="button"
            onClick={() => setShowRegionSelector((v) => !v)}
            className="w-full py-5 sm:py-5 mt-2 rounded-xl bg-[#E7E7E7] text-base sm:text-[17px] font-Inter font-bold text-[#707070]"
          >
            다른 지역을 선택할래요
          </button>

          {/* 다른 지역 선택 토글 영역 */}
          {showRegionSelector && (
            <div className="mt-2 rounded-2xl bg-[#F4F4F4] shadow-sm px-4 py-3 space-y-3">
              <p className="text-base sm:text-[17px] font-bold text-[#666666] flex items-center justify-center text-center">
                어떤 지역의 코스를 추천해드릴까요?
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {REGION_OPTIONS.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setSelectedRegion(region)}
                    className={
                      "px-4 py-2 rounded-full text-sm sm:text-[15px] " +
                      (selectedRegion === region
                        ? "bg-[#2DAEA1] text-white"
                        : "bg-[#F3F4F6] text-[#666666]")
                    }
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
