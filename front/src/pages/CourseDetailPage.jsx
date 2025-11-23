// src/pages/CourseDetailPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "../ui/BottomNav";
import BackImage from "../assets/back.png";
import TrashImage from "../assets/trash.png";

import {
  useCourseDetail,
  useAddSegment,
  useDeleteSegment,
  useSaveCourseSegments,
} from "../hook/useCourses.js";

import { ACCESS_TOKEN_KEY } from "../api/http.js";
import { useLoading } from "../context/LoadingContext.jsx";
import { useAlert } from "../context/AlertContext.jsx";

export default function CourseDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // /course/:id
  const courseId = Number(id);

  const { withLoading } = useLoading();
  const { showAlert } = useAlert();

  if (!id || Number.isNaN(courseId)) {
    return <div className="p-4">잘못된 접근입니다. (코스 ID가 없습니다)</div>;
  }

  // 서버에서 코스 상세 가져오기
  const { data, isLoading, error } = useCourseDetail(courseId);
  const addSeg = useAddSegment(courseId);
  const delSeg = useDeleteSegment(courseId);
  const saveSeg = useSaveCourseSegments(courseId);

  const mapRef = useRef(null);

  // 코스 수정 모드 여부
  const [isEditing, setIsEditing] = useState(false);

  // 서버 데이터 → 편집 리스트용으로 복사
  const editablePlaces = useMemo(() => {
    const segs = data?.segments || [];
    return segs
      .slice()
      .sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0))
      .map((s, idx) => ({
        id: s.id, // segment id
        placeId: s.placeId ?? s.place?.id ?? String(s.id),
        name: s.placeName ?? s.place?.name ?? `장소 ${idx + 1}`,
        lat: s.lat ?? s.place?.lat ?? 37.7385,
        lng: s.lng ?? s.place?.lng ?? 127.045,
        hasLocalCurrency: Boolean(
          s.hasLocalCurrency ?? s.place?.hasLocalCurrency
        ),
        orderNo: s.orderNo ?? idx + 1,
      }));
  }, [data]);

  // 드래그/수정용 로컬 상태
  const [places, setPlaces] = useState(editablePlaces);
  useEffect(() => {
    setPlaces(editablePlaces);
  }, [editablePlaces]);

  // 드래그 인덱스
  const [dragIndex, setDragIndex] = useState(null);


  useEffect(() => {
    const init = () => {
      const { kakao } = window;
      if (!kakao || !kakao.maps || !mapRef.current) return;

      kakao.maps.load(() => {
        if (!mapRef.current) return;

        const hasPlaces = places && places.length > 0;
        const first = hasPlaces
          ? new kakao.maps.LatLng(places[0].lat, places[0].lng)
          : new kakao.maps.LatLng(37.7385, 127.045);

        const map = new kakao.maps.Map(mapRef.current, {
          center: first,
          level: 4,
        });

        if (!hasPlaces) return;

        const path = places.map(
          (p) => new kakao.maps.LatLng(p.lat, p.lng)
        );

        // polyline
        const polyline = new kakao.maps.Polyline({
          path,
          strokeWeight: 5,
          strokeColor: "#6D6DCBD6",
          strokeOpacity: 0.9,
          strokeStyle: "solid",
        });
        polyline.setMap(map);

        // 마커 + 번호 원
        path.forEach((position, index) => {
          new kakao.maps.Marker({ position }).setMap(map);

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

          new kakao.maps.CustomOverlay({
            position,
            content,
            yAnchor: 1,
          }).setMap(map);
        });

        // 모든 좌표가 보이도록 bounds 조정
        const bounds = new kakao.maps.LatLngBounds();
        path.forEach((pos) => bounds.extend(pos));
        map.setBounds(bounds);
      });
    };

    if (window.kakao && window.kakao.maps) {
      init();
      return;
    }

    const script = document.querySelector(
      'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
    );
    const onLoad = () => init();
    if (script) script.addEventListener("load", onLoad);

    return () => {
      if (script) script.removeEventListener("load", onLoad);
    };
  }, [places]);


  // 세그먼트 삭제(서버 반영)
  const handleDeletePlace = (segmentId) => {
    delSeg.mutate(segmentId, {
      onSuccess: () => {
        // invalidate는 훅에서 처리
      },
    });
  };

  const handleAddPlace = async () => {
    const name = prompt(
      "추가할 장소의 placeId(검색으로 얻은 ID)를 입력해주세요."
    );
    if (!name) return;

    const orderNo = (data?.segments?.length || 0) + 1;
    addSeg.mutate(
      { placeId: name, orderNo },
      {
        onSuccess: () => {

        },
      }
    );
  };

  // 드래그 시작 / 드랍으로 순서 변경 (로컬만)
  const handleDragStart = (index) => setDragIndex(index);
  const handleDrop = (index) => {
    if (dragIndex === null || dragIndex === index) return;
    setPlaces((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next.map((p, i) => ({ ...p, orderNo: i + 1 }));
    });
    setDragIndex(null);
    
  };


  const handleSave = async () => {
    if (!places || places.length === 0) {
      showAlert("저장할 장소가 없습니다.");
      return;
    }

    try {
      await withLoading(async () => {
        const ids = places.map((p) => p.id);
        await saveSeg.mutateAsync(ids);
      });
      showAlert("코스를 저장했어요!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "코스 저장 중 오류가 발생했어요.";
      showAlert(msg);
    }
  };

  // ===== 후기 / 영수증 버튼용 로그인 체크 =====
  const handleClickReview = (place) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      showAlert("후기 등록은 로그인 후 이용할 수 있어요.");
      navigate("/login", {
        state: { from: `/review/${courseId}/${place.placeId}` },
      });
      return;
    }

    navigate(`/review/${courseId}/${place.placeId}`, {
      state: { placeName: place.name, courseId, placeId: place.placeId },
    });
  };

  const handleClickReceipt = (place) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      showAlert("영수증 인증은 로그인 후 이용할 수 있어요.");
      navigate("/login", {
        state: { from: "/receipt-proof" },
      });
      return;
    }

    navigate("/receipt-proof", {
      state: {
        courseId,
        placeId: place.placeId,
        placeName: place.name,
      },
    });
  };

  // ===== 로딩/에러 가드 =====
  //if (isLoading) return <div className="p-4">코스를 불러오는 중…</div>;
  //if (error) return <div className="p-4">코스를 불러오지 못했어요.</div>;
  //if (!data) return <div className="p-4">데이터가 비어 있습니다.</div>;

   if (isLoading && !data) return <div className="p-4">코스를 불러오는 중…</div>;

  const title =
  data?.title || (data?.region ? `${data.region} 코스` : "코스 상세");
const region = data?.region || "의정부";


  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col">
      {/* 상단 헤더 (디자인 유지) */}
      <header className="bg-white shadow-sm">
        <div className="px-4 md:px-6 lg:px-8 pt-6 pb-3 flex justify-center">
          <div className="w-full max-w-[480px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[960px] flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"
            >
              <img
                src={BackImage}
                alt="뒤로가기"
                className="w-25 h-25 object-contain"
              />
            </button>

            <h1 className="text-[20px] sm:text-[20px] md:text-[22px] font-bold text-[#414141] text-center flex-1">
              {isEditing ? "코스 수정하기" : title}
            </h1>

            {isEditing ? (
              <button
                type="button"
                onClick={handleSave}
                disabled={saveSeg.isPending}
                className="text-[14px] sm:text-[16px] font-semibold text-[#5131C3]"
              >
                {saveSeg.isPending ? "저장 중…" : "저장"}
              </button>
            ) : (
              <div className="w-8" />
            )}
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 pb-24 bg-white">
        <div className="w-full max-w-[480px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[960px] mx-auto">
          <section className="w-full mt-4">
            {/* 지도 카드 */}
            <div className="mt-2 bg-white overflow-hidden border border-[#D9D9D9]">
              <div
                ref={mapRef}
                className="w-full h-[350px] sm:h-[300px] md:h-[360px] lg:h-[420px]"
              />
            </div>

            {isEditing ? (
              <>
                <p className="mt-5 text-[12px] sm:text-[13px] text-[#969696]">
                  줄을 길게 눌러 순서를 바꾸거나,{" "}
                  <span role="img" aria-label="trash">
                    🗑️
                  </span>{" "}
                  를 눌러 삭제하세요
                </p>

                {/* 편집 리스트 */}
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
                      <div className="flex-1 flex items-center justify-between gap-2">
                        <span className="text-[13px] sm:text-[14px] text-[#404040]">
                          {place.name}
                        </span>
                        {place.hasLocalCurrency && (
                          <span className="px-2 py-[3px] rounded-[8px] text-[10px] sm:text-[11px] font-bold text-[#008562] bg-[#9BE3BB] whitespace-nowrap">
                            지역 화폐
                          </span>
                        )}
                      </div>

                      {/* 삭제 */}
                      <button
                        type="button"
                        onClick={() => handleDeletePlace(place.id)}
                        className="w-8 h-8 flex items-center justify-center"
                        title="삭제"
                      >
                        <img
                          src={TrashImage}
                          alt="삭제"
                          className="w-5 h-5 object-contain"
                        />
                      </button>
                    </div>
                  ))}
                </div>

                {/* 장소 추가하기 버튼 (디자인 그대로) */}
                <button
                  type="button"
                  onClick={() =>
                    navigate("/course/add-place", {
                      state: {
                        region,
                        places,
                      },
                    })
                  }
                  className="mt-5 mb-8 w-full border border-dashed border-[#2DAEA1] bg-[#EEFFF6] text-[15px] sm:text-[15px] text-[#2AAB9E] py-3 rounded-[8px] font-semibold"
                >
                  + 장소 추가하기
                </button>
              </>
            ) : (
              // ===== 상세 보기(타임라인) =====
              <div className="mt-5 bg-white">
                <div className="relative pl-5 pr-4 py-4 md:py-6">
                  {/* 세로 라인 */}
                  <div className="absolute left-[11px] top-4 bottom-4 border-l-[1px] border-[#B2B2B2]" />

                  {/* 출발지 */}
                  {editablePlaces[0] && (
                    <div className="relative mb-4">
                      <div className="absolute -left-[11px] top-1 w-2 h-2 rounded-full bg-[#6D6DCB]" />
                      <div className="flex items-center justify-between bg-[#F6F6FF] rounded-[8px] px-4 py-[15px] md:py-[12px] text-[12px] sm:text-[13px] border-[1px] border-[#D9D9D9]">
                        <span className="font-semibold text-[#404040]">
                          {editablePlaces[0].name}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-[#B2B2B2]">
                          출발
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 나머지 장소들 */}
                  {(editablePlaces.slice(1) || []).map((p, idx) => (
                    <div key={p.id} className="relative mb-6">
                      <div className="absolute -left-[11px] top-1 w-2 h-2 rounded-full bg-[#4CC482]" />

                      <div className="bg-[#E1FFEE] rounded-[10px] px-4 py-4 md:py-5 border border-[#2DAEA1]">
                        <p className="text-[14px] sm:text-[16px] font-semibold text-[#505050] mb-2">
                          {p.name}
                        </p>

                        <div className="flex flex-wrap gap-2 text-[11px] sm:text-[13px]">
                          <button
                            type="button"
                            onClick={() => handleClickReview(p)}
                            className="px-3 py-[5px] rounded-full bg-[#FFA641] text-white font-semibold"
                          >
                            후기
                          </button>

                          {p.hasLocalCurrency && (
                            <span className="px-3 py-[5px] rounded-full bg-[#9BE3BB] text-white font-semibold">
                              지역 화폐
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleClickReceipt(p)}
                            className="px-3 py-[5px] rounded-full bg-[#3A60DD] text-white font-semibold"
                          >
                            영수증 인증
                          </button>
                        </div>
                      </div>

                      {/* 이동 구간 텍스트 */}
                      {idx < editablePlaces.length - 2 && (
                        <div className="mt-4 flex items-center gap-2 font-semibold text-[12px] sm:text-[12px] text-[#3A128B]">
                          <span>🚌</span>
                          <span className="font-semibold">이동</span>
                          <span>약 5분</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 하단 고정 영역 */}
      <div className="bg-white px-4 py-3">
        <div className="max-w-[360px] mx-auto flex-1 overflow-y-auto px-4 pb-[100px]">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full py-[10px] text-[#545454] text-[16px] font-semibold flex items-center justify-center"
            >
              코스 수정하기
            </button>
          ) : null}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}