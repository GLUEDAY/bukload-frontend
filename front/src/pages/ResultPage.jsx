import { useState } from "react";
import BottomNav from "../ui/BottomNav";
import { useNavigate } from "react-router-dom";

const REGION_OPTIONS = ["의정부", "구리", "양주", "동두천"];

const REGION_TITLE = {
  의정부: "Uijeongbu",
  구리: "Guri",
  양주: "Yangju",
  동두천: "Dongducheon",
};

export default function ResultPage() {
  const [showRegionSelector, setShowRegionSelector] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("의정부");

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* 상단 로고 / 텍스트 */}
      <header className="pt-10 pb-2 flex flex-col items-center gap-10">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-3xl font-extrabold text-[#F6A623]">
          ㅋ
        </div>
        <p className="text-[15px] text-[#974E00]">AI가 찾아낸 최적의 여행지는..</p>
      </header>

      <main className="flex-1 px-4 pb-32">
        <section className="max-w-md mx-auto space-y-4">
          {/* 추천 카드 */}
          <div className="w-298px h-346px bg-[#F3F3FF] rounded-xl shadow-lg overflow-hidden">
            {/* 카드 상단 이미지 영역 */}
            <div className="relative h-50 bg-[url('/uijeongbu-placeholder.jpg')] bg-cover bg-center">
              <div className="absolute inset-0 bg-[#C7C5FF99]/60" />
              <div className="absolute bottom-4 left-5 text-white ">
                <h2 className="text-4xl font-Patua One tracking-wide">
                  {REGION_TITLE[selectedRegion]}
                </h2>
              </div>
            </div>

            {/* 카드 내용 */}
            <div className="px-5 py-4 space-y-2">
              <p className="mt-2 text-[17px] font-medium text-[#969696] flex items-center justify-center">
                대표 랜드마크 : 의정부 미술도서관
              </p>
              <p className="text-[30px] font-semibold font-Inter text-[#3151C3] flex items-center justify-center">
                {selectedRegion}
              </p>

              <div className="mt-3 rounded-2xl bg-[#DCDCFF] px-4 py-3">
                <p className="text-13px font-bold text-[#4F46E5]">
                  AI 현무&apos;s Comment :
                </p>
                <p className="mt-1 text-11px text-gray-700 leading-relaxed">
                 “#휴식 #힐링 과 #문화 #전시 키워드를 고려했을 때,
                 예술과 자연이 어우러진 {selectedRegion}가(이) 적합해요"
                </p>
              </div>
            </div>
          </div>

          {/* 메인 CTA 버튼 */}
          <button
            type="button"
            onClick={() =>
            navigate("/course", {
            state: { region: selectedRegion },
                })
            }
            className="mt-5 w-full py-5 rounded-xl bg-[#2DAEA1] text-white text-[17px] font-Inter font-bold shadow-md"
          >
            네, 좋아요! {selectedRegion} 추천 코스 보기
          </button>

          {/* 다른 지역 선택 버튼 */}
          <button
            type="button"
            onClick={() => setShowRegionSelector((v) => !v)}
            className="w-full py-5 mt-2 rounded-xl bg-[#E7E7E7] text-[17px] font-Inter font-bold text-gray-800"
          >
            다른 지역을 선택할래요
          </button>

          {/* 👉 오른쪽 디자인처럼, 아래에 토글로 뜨는 영역 */}
          {showRegionSelector && (
            <div className="mt-2 rounded-2xl bg-[#F4F4F4] shadow-sm px-4 py-3 space-y-3">
              <p className="text-[17px] font-bold text-[#666666] flex items-center justify-center">
                어떤 지역의 코스를 추천해드릴까요?
              </p>
              <div className="flex flex-wrap gap-2">
                {REGION_OPTIONS.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setSelectedRegion(region)}
                    className={
                      "px-4 py-2 rounded-full text-[17px]" +
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
