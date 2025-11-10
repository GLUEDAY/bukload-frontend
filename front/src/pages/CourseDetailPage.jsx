// src/pages/CourseDetailPage.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "../ui/BottomNav";
import BackImage from "../assets/back.png";
import TrashImage from "../assets/trash.png";

export default function CourseDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const region = location.state?.region || "의정부";

  const mapRef = useRef(null);

  // 코스 수정 모드 여부
  const [isEditing, setIsEditing] = useState(false);

  // 코스 리스트 (수정 화면에서 사용하는 데이터)
  const [places, setPlaces] = useState([
    { id: 1, name: "의정부역", hasLocalCurrency: false },
    { id: 2, name: "독립 서점 '오래된 미래'", hasLocalCurrency: true },
    { id: 3, name: "의정부 부대찌개 거리", hasLocalCurrency: true },
    { id: 4, name: "새로운 카페", hasLocalCurrency: false },
  ]);

  // 드래그로 순서 변경용
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
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

      // 1~4 포인트 좌표 (코스)
      const points = [
        { lat: 37.7383, lng: 127.044 }, // 1
        { lat: 37.7396, lng: 127.046 }, // 2
        { lat: 37.7412, lng: 127.0445 }, // 3
        { lat: 37.739, lng: 127.043 }, // 4
      ];

      const path = points.map((p) => new kakao.maps.LatLng(p.lat, p.lng));

      // 파란 라인
      const polyline = new kakao.maps.Polyline({
        path,
        strokeWeight: 5,
        strokeColor: "#6D6DCBD6",
        strokeOpacity: 0.9,
        strokeStyle: "solid",
      });
      polyline.setMap(map);

      // 마커 + 번호 동그라미
      points.forEach((p, index) => {
        const position = new kakao.maps.LatLng(p.lat, p.lng);

        const marker = new kakao.maps.Marker({ position });
        marker.setMap(map);

        const content = `
          <div style="
            background:#1F3C88;
            color:#fff;
            border-radius:999px;
            width:26px;
            height:26px;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:13px;
            font-weight:700;
            box-shadow:0 2px 4px rgba(0,0,0,0.25);
          ">
            ${index + 1}
          </div>
        `;

        const overlay = new kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1,
        });
        overlay.setMap(map);
      });
    });
    // 수정 모드로 화면 구조가 바뀌면 다시 지도 세팅
  }, [isEditing]);

  // 장소 삭제
  const handleDeletePlace = (id) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  // 장소 추가
  const handleAddPlace = () => {
    const name = prompt("추가할 장소 이름을 입력해주세요.");
    if (!name) return;
    setPlaces((prev) => [
      ...prev,
      { id: Date.now(), name, hasLocalCurrency: false },
    ]);
  };

  // 드래그 시작 / 드랍으로 순서 변경
  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDrop = (index) => {
    if (dragIndex === null || dragIndex === index) return;

    setPlaces((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 상단 헤더 */}
      <header className="bg-white">
        <div className="px-4 pt-6 pb-3 flex justify-between items-center ">
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

          {/* 오른쪽 저장 버튼 (수정 모드일 때만) */}
          {isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-[16px] font-semibold text-[#5131C3] "
            >
              저장
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </header>

      {/* 본문 */}
      <main className="flex-1 overflow-y-auto px-4 pb-24">

        {/* 가운데 정렬된 제목 */}
          <div className="flex-1 flex justify-start px-4">
            <h1 className="text-[20px] font-bold text-[#974E00]">
              {isEditing ? "코스 수정하기" : "로컬 맛집 완전 정복 코스"}
            </h1>
          </div>

        <section className="max-w-[360px] mx-auto">
          {/* 지도 카드 */}
          <div className="mt-5 bg-white overflow-hidden border border-[#D9D9D9]">
            <div ref={mapRef} className="w-full h-[300px]" />
          </div>

          {isEditing ? (
            <>
              {/* 안내 문구 */}
              <p className="mt-5 text-[13px] text-[#969696]">
                줄을 길게 눌러 순서를 바꾸거나,{" "}
                <span role="img" aria-label="trash">
                  🗑️
                </span>{" "}
                를 눌러 삭제하세요
              </p>

              {/* 리스트 영역 */}
              <div className="mt-3 space-y-3">
                {places.map((place, index) => (
                  <div
                    key={place.id}
                    className="flex items-center gap-3 bg-[#F6F6FF] rounded-[10px] px-3 py-3 border border-[#E0E0E0]"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(index)}
                  >
                    {/* 드래그 핸들 */}
                    <button
                      type="button"
                      className="w-6 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
                    >
                      <span className="block w-3 h-[2px] mb-[3px] rounded-full bg-[#C4C4C4]" />
                      <span className="block w-3 h-[2px] rounded-full bg-[#C4C4C4]" />
                    </button>

                    {/* 이름 + 뱃지 */}
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-[14px] text-[#404040]">
                        {place.name}
                      </span>
                      {place.hasLocalCurrency && (
                        <span className="px-2 py-[3px] rounded-[8px] text-[11px] font-bold text-[#008562] bg-[#9BE3BB]">
                          지역 화폐
                        </span>
                      )}
                    </div>

                    {/* 삭제 버튼 */}
                    <button
                      type="button"
                      onClick={() => handleDeletePlace(place.id)}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                        <img
                                                  src={TrashImage}
                                                  alt="쓰레기"
                                                  className="w-10 h-10 object-contain"
                                                />
                    </button>
                  </div>
                ))}
              </div>

              {/* 장소 추가하기 버튼 */}
              <button
                type="button"
                onClick={handleAddPlace}
                className="mt-5 mb-6 w-full border border-dashed border-[#2DAEA1] bg-[#EEFFF6] text-[15px] text-[#2AAB9E] py-3 rounded-[8px] font-semibold"
              >
                + 장소 추가하기
              </button>
            </>
          ) : (
            // ===== 상세 보기(기존 타임라인) =====
            <div className="mt-5 bg-white">
              <div className="relative pl-5 py-2">
                {/* 세로 라인 */}
                <div className="absolute left-[11px] top-3 bottom-3 border-l-[1px] border-[#B2B2B2]" />

                {/* 1. 출발지 */}
                <div className="relative mb-4">
                  <div className="absolute -left-[11px] top-1 w-1 h-1 rounded-full bg-[#6D6DCB]" />
                  <div className="flex items-center justify-between bg-[#F6F6FF] rounded-[8px] px-4 py-[12px] text-[13px] border-[1px] border-[#D9D9D9]">
                    <span className="font-semibold text-[#404040]">
                      의정부역
                    </span>
                    <span className="text-[11px] text-[#B2B2B2]">출발</span>
                  </div>
                </div>

                {/* 도보 구간 */}
                <div className="relative mb-4 pl-1">
                  <p className="text-[12px] text-[#3A128B] font-semibold flex items-center gap-1">
                    <span>🚶</span>
                    <span>도보 6분</span>
                  </p>
                </div>

                {/* 첫 번째 장소 카드 */}
                <div className="relative mb-6">
                  <div className="absolute -left-[11px] top-1 w-1 h-1 rounded-full bg-[#4CC482]" />

                  <div className="bg-[#E1FFEE] rounded-[10px] px-4 py-5 border border-[#2DAEA1]">
                    <p className="text-[16px] font-semibold text-[#505050] mb-2">
                      독립서점 &apos;오래된 미래&apos;
                    </p>

                    <div className="flex flex-wrap gap-2 text-[13px]">
                      <button
                        type="button"
                        onClick={() =>
                          navigate("/review", {
                            state: { placeName: "독립 서점 '오래된 미래'" },
                         })
                       }
                       className="px-3 py-[5px] rounded-full bg-[#FFA641] text-white font-semibold"
                        >
                        후기
                      </button>
                      <span className="px-3 py-[5px] rounded-full bg-[#9BE3BB] text-white font-semibold">
                        지역 화폐
                      </span>
                      <span className="px-3 py-[5px] rounded-full bg-[#2DB96CD4] text-white font-semibold">
                        적립 완료
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 font-semibold text-[12px] text-[#3A128B]">
                    <span>🚌</span>
                    <span className="font-semibold">210</span>
                    <span>3정류장 약 5분</span>
                  </div>
                </div>

                {/* 두 번째 장소 카드 */}
                <div className="relative mb-6">
                  <div className="absolute -left-[11px] top-1 w-1 h-1 rounded-full bg-[#4CC482]" />

                  <div className="bg-[#E1FFEE] rounded-[10px] px-4 py-5 border border-[#2DAEA1]">
                    <p className="text-[16px] font-semibold text-[#505050] mb-2">
                      &apos;의정부 부대찌개 거리&apos;
                    </p>

                    <div className="flex flex-wrap gap-2 text-[13px]">
                     <button
                        type="button"
                        onClick={() =>
                          navigate("/review", {
                            state: { placeName: "의정부 부대찌개 거리" },
                         })
                       }
                       className="px-3 py-[5px] rounded-full bg-[#FFA641] text-white font-semibold"
                        >
                        후기
                      </button>
                      <span className="px-3 py-[5px] rounded-full bg-[#9BE3BB] text-white font-semibold">
                        지역 화폐
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          navigate("/receipt-proof", {
                            state: { placeName: "의정부 부대찌개 거리" },
                          })
                        }
                        className="px-3 py-[5px] rounded-full bg-[#3A60DD] text-white font-semibold"
                      >
                        영수증 인증
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* 하단 코스 수정하기 버튼 (상세 화면에서만) */}
      {!isEditing && (
        <div className="bg-white px-4 py-3">
          <div className="max-w-[360px] mx-auto flex-1 overflow-y-auto px-4 pb-[100px]">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full py-[10px] text-[#545454] text-[16px] font-semibold flex items-center justify-center"
            >
              코스 수정하기
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
