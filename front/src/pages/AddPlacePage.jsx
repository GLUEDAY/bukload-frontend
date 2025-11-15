// src/pages/AddPlacePage.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteImage from "../assets/delete.png";

// 🔗 공통 알럿 컨텍스트
import { useAlert } from "../context/AlertContext.jsx";

export default function AddPlacePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { showAlert } = useAlert();

  // 탭 상태: "keyword" | "map"
  const [activeTab, setActiveTab] = useState("keyword");

  // 코스 수정 페이지에서 넘겨준 데이터가 있다면 사용
  const region = location.state?.region || "의정부";

  // 키워드 검색 결과 (실제에선 API 결과를 넣어주면 됨)
  const samplePlaces = location.state?.places || [
    {
      id: 1,
      name: "카페 어나더",
      category: "지역 카페",
      address: "양주시 장흥면 어디어디...",
    },
    {
      id: 2,
      name: "기산리 147",
      category: "",
      address: "양주시 백석읍 어디어디...",
    },
    {
      id: 3,
      name: "송추유원지",
      category: "",
      address: "양주시 장흥면 송추로 어디어디...",
    },
  ];

  const [keyword, setKeyword] = useState("");

  // 지도를 넣을 DOM
  const mapRef = useRef(null);

  // 장소 선택 시 동작
  const handleAddPlace = useCallback(
    (place) => {
      console.log("선택한 장소:", place);
      showAlert(`'${place.name}'를 코스에 추가했어요!`);

      // 실제로 코스 수정 페이지에 반영하려면 navigate로 state 넘기기
      // 예시:
      // navigate(-1, { state: { addedPlace: place } });
    },
    [showAlert]
  );

  // 지도 탭이 켜졌을 때 카카오 지도 로드
  useEffect(() => {
    if (activeTab !== "map") return;

    const { kakao } = window;
    if (!kakao) {
      console.error("⚠️ kakao 객체가 없습니다. index.html 스크립트를 확인하세요.");
      return;
    }

    kakao.maps.load(() => {
      if (!mapRef.current) return;

      // 의정부 근처 중심 좌표
      const center = new kakao.maps.LatLng(37.7385, 127.045);
      const map = new kakao.maps.Map(mapRef.current, {
        center,
        level: 4,
      });

      // 예시 마커
      const marker = new kakao.maps.Marker({
        position: center,
      });
      marker.setMap(map);

      kakao.maps.event.addListener(marker, "click", function () {
        handleAddPlace({
          id: 999,
          name: "카페 어나더",
          lat: center.getLat(),
          lng: center.getLng(),
          address: `${region} 일대`,
        });
      });

      kakao.maps.event.addListener(map, "click", function (mouseEvent) {
        const latlng = mouseEvent.latLng;

        handleAddPlace({
          id: Date.now(),
          name: "선택한 위치",
          lat: latlng.getLat(),
          lng: latlng.getLng(),
          address: `${region} 일대`,
        });
      });
    });
  }, [activeTab, handleAddPlace, region]);

  return (
    <div className="min-h-screen w-full bg-[#F5F7FB]">
      <div className="min-h-screen w-full bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {/* 상단 헤더 */}
          <header className="relative px-6 pt-20 pb-4">
            <h1 className="text-center text-[24px] font-semibold text-[#414141]">
              장소 추가하기
            </h1>

            {/* 닫기 버튼 (X) */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute right-4 top-8 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"
              aria-label="닫기"
            >
              <img
                src={DeleteImage}
                alt="뒤로"
                className="w-10 h-10 object-contain"
              />
            </button>
          </header>

          {/* 검색 인풋 */}
          <div className="px-6">
            <div className="mt-5 flex items-center bg-[#F5F5F5] px-4 py-3">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="추가할 장소의 이름을 검색하세요"
                className="flex-1 bg-transparent text-[16px] placeholder:text-[#00000052] focus:outline-none"
              />
              <button type="button" className="ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.7}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 탭 영역 */}
          <div className="mt-10 px-6 border-b border-gray-200 flex">
            <button
              type="button"
              onClick={() => setActiveTab("keyword")}
              className={`flex-1 pb-2 text-center text-[16px] font-medium ${
                activeTab === "keyword"
                  ? "text-[#2DAEA1] border-b-2 border-[#00C18C]"
                  : "text-[#666666]"
              }`}
            >
              키워드 검색
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("map")}
              className={`flex-1 pb-2 text-center text-[16px] font-medium ${
                activeTab === "map"
                  ? "text-[#666666] border-b-2 border-[#00C18C]"
                  : "text-[#666666]"
              }`}
            >
              지도에서 찾기
            </button>
          </div>

          {/* 컨텐츠 영역 */}
          <main className="px-6 pb-8 pt-5">
            {activeTab === "keyword" ? (
              <div className="space-y-3">
                {samplePlaces.map((place) => (
                  <div
                    key={place.id}
                    className="flex items-center justify-between rounded-lg bg-[#EEFFF6] border border-[#D9D9D9] px-10 py-5 mt-5"
                  >
                    <div className="flex flex.col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[17px] font-bold text-[#5A5A5A]">
                          {place.name}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#969696]">
                        {place.address || `${region} 일대`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddPlace(place)}
                      className="ml-3 w-14 py-1.5 text-[15px] font-semibold rounded-lg bg-[#2DAEA1] text-white"
                    >
                      추가
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="flex items-center text-[11px] text-gray-500 mb-2">
                  <span className="mr-1">🛈</span>
                  <span>지도 위 마커를 선택하여 추가하세요</span>
                </div>

                <div className="h-[360px] rounded-xl overflow-hidden border border-gray-200">
                  <div ref={mapRef} className="w-full h-full" />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
