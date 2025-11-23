// src/pages/ResultPage.jsx
import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "../ui/BottomNav";
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

  const regionFromList = location.state?.region || "의정부";
  const metaFromList = location.state?.meta || null;
  const landmarkFromList = location.state?.landmark || null;

  const [showRegionSelector, setShowRegionSelector] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(regionFromList);

  const regionTitle = useMemo(
    () => REGION_TITLE[selectedRegion] || selectedRegion,
    [selectedRegion]
  );

  const commentText =
    metaFromList?.regionComment ||
    `“#휴식 #힐링 과 #문화 #전시 키워드를 고려했을 때, ${selectedRegion}가(이) 적합해요”`;
  const landmarkText = landmarkFromList || `${selectedRegion} 미술도서관`;
  const goToCourseDetail = () => {
    console.log("✅ [ResultPage] 버튼 클릭됨, /course/1 로 이동 시도");
    navigate("/course/1");
  };

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
            <div className="relative h-50 sm:h-48 bg-[url('/uijeongbu-placeholder.jpg')] bg-cover bg-center">
              <div className="absolute inset-0 bg-[#C7C5FF99]" />
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <h2 className="text-5xl sm:text-4xl font-bold tracking-wide">
                  {regionTitle}
                </h2>
              </div>
            </div>

            <div className="px-5 py-4 space-y-2">
              <p className="mt-2 text-sm sm:text-base font-bold text-[#969696] flex items-center justify-center text-center">
                대표 랜드마크 : {landmarkText}
              </p>
              <p className="text-3xl sm:text-3xl font-semibold text-[#3151C3] flex items-center justify-center">
                {selectedRegion}
              </p>
              <div className="mt-3 rounded-2xl bg-[#DCDCFF] px-4 py-3">
                <p className="text-[13px] font-bold text-[#4F46E5]">
                  AI 현무&apos;s Comment :
                </p>
                <p className="mt-1 text-[11px] sm:text-xs text-[#1B3696] leading-relaxed">
                  {commentText}
                </p>
              </div>
            </div>
          </div>

          {/* 🔥 여기 버튼: 그냥 /course/1 로만 보냄 */}
          <button
            type="button"
            onClick={goToCourseDetail}
            className="mt-5 w-full py-5 rounded-xl bg-[#2DAEA1] text-white text-base font-bold shadow-md"
          >
            네, 좋아요! {selectedRegion} 추천 코스 보기
          </button>

          {/* 다른 지역 선택 */}
          <button
            type="button"
            onClick={() => setShowRegionSelector((v) => !v)}
            className="w-full py-5 mt-2 rounded-xl bg-[#E7E7E7] text-base font-bold text-[#707070]"
          >
            다른 지역을 선택할래요
          </button>

          {showRegionSelector && (
            <div className="mt-2 rounded-2xl bg-[#F4F4F4] shadow-sm px-4 py-3 space-y-3">
              <p className="text-base font-bold text-[#666666] text-center">
                어떤 지역의 코스를 추천해드릴까요?
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {REGION_OPTIONS.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setSelectedRegion(region)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      selectedRegion === region
                        ? "bg-[#2DAEA1] text-white"
                        : "bg-[#F3F4F6] text-[#666666]"
                    }`}
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
