import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Phone, Instagram, ChevronDown } from 'lucide-react';
import Header from '../ui/Header';
import { useLoading } from '../context/LoadingContext';
import { useAlert } from '../context/AlertContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// 백엔드 명세에는 주간 운영시간 구조가 없어서, 프론트 더미 데이터로만 사용
const DEFAULT_TIMETABLE = [
  { day: '월', time: '11:00 - 21:00', closed: false },
  { day: '화', time: '정기 휴무', closed: true },
  { day: '수', time: '11:00 - 21:00', closed: false },
  { day: '목', time: '11:00 - 21:00', closed: false },
  { day: '금', time: '11:00 - 21:00', closed: false },
  { day: '토', time: '11:00 - 21:00', closed: false },
  { day: '일', time: '10:30 - 21:00', closed: false },
];

export default function PlaceDetailPage() {
  const location = useLocation();
  const { startLoading, stopLoading } = useLoading();
  const { showAlert } = useAlert();

  const [place, setPlace] = useState(null);
  const [openSchedule, setOpenSchedule] = useState(false);

  // /places/detail?query=카페%20아니더 형태에서 query 추출
  const query = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('query') || '';
  }, [location.search]);

  useEffect(() => {
    if (!query) {
      showAlert('장소 검색어(query)가 없습니다.');
      return;
    }

    const fetchPlace = async () => {
      try {
        startLoading();

        const res = await fetch(
          `${API_BASE}/api/places/search?query=${encodeURIComponent(query)}`
        );

        if (!res.ok) {
          throw new Error(
            `장소 정보를 불러오지 못했습니다. (HTTP ${res.status})`
          );
        }

        const data = await res.json();
        // 명세상 search 결과가 배열일 수도 있으니 첫 번째만 사용
        const placeData = Array.isArray(data) ? data[0] : data;

        if (!placeData) {
          throw new Error('검색 결과가 없습니다.');
        }

        setPlace(placeData);
      } catch (err) {
        console.error(err);
        showAlert(err.message || '장소 정보를 불러오지 못했습니다.');
      } finally {
        stopLoading();
      }
    };

    fetchPlace();
  }, [query, startLoading, stopLoading, showAlert]);

  // 아직 데이터 안 온 상태
  if (!place) {
    return (
      <div className="w-full min-h-screen bg-white">
        <Header title="장소 상세" back />
        <div className="px-5 py-6 text-sm text-gray-500">
          장소 정보를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  // 새 명세에서 실제로 올 법한 필드들만 안전하게 사용
  const {
    name,
    category,
    address, // 지번
    roadAddress, // 도로명
    phone,
    homepageUrl,
    instagramUrl,
    imageUrl,
    openNow, // boolean
  } = place;

  const timetable = DEFAULT_TIMETABLE; // 백엔드 미지원 → 더미 고정

  // 운영시간 박스를 클릭했을 때: 더미라서 알럿 + 토글
  const handleToggleSchedule = () => {
    showAlert('주간 운영시간 상세는 아직 백엔드에서 지원되지 않는 기능입니다.');
    setOpenSchedule((prev) => !prev);
  };

  // 지역 화폐 카드는 지금은 완전 더미 → 클릭 시 알럿
  const handleClickLocalCurrency = () => {
    showAlert('지역 화폐 정보는 현재 더미 데이터입니다. 추후 연동 예정입니다.');
  };

  const handleCopyAddress = async () => {
    try {
      const text = roadAddress || address;
      if (!text) {
        showAlert('복사할 주소가 없습니다.');
        return;
      }
      await navigator.clipboard.writeText(text);
      showAlert('주소가 클립보드에 복사되었습니다.');
    } catch {
      showAlert('주소 복사에 실패했습니다. (브라우저 권한 확인 필요)');
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pb-20">
      {/* 헤더 */}
      <Header title={name || '장소 상세'} back />

      {/* 대표 이미지 */}
      <img
        src={imageUrl || '/placeholder-cafe.jpg'}
        alt={name || '장소 이미지'}
        className="w-full h-[250px] object-cover"
      />

      {/* 본문 */}
      <div className="px-5 py-4">
        {/* 태그 */}
        <div className="flex gap-2 mb-2">
          {category && (
            <span className="px-3 py-1 bg-[#F3F1EE] rounded-full text-sm text-[#6B6B6B]">
              {category}
            </span>
          )}
          {/* 시안용 서브 태그 하나 고정 */}
          <span className="px-3 py-1 bg-[#F3F1EE] rounded-full text-sm text-[#6B6B6B]">
            자연
          </span>
        </div>

        {/* 제목 */}
        <h1 className="text-[22px] font-bold mb-2">
          {name || '이름 없는 장소'}
        </h1>

        {/* 주소 */}
        <div className="flex items-start gap-2 text-[#444] mb-1">
          <MapPin size={18} className="mt-0.5" />
          <div className="flex-1 text-[15px] leading-snug">
            {roadAddress || address || '주소 정보가 없습니다.'}
          </div>
          <button
            type="button"
            onClick={handleCopyAddress}
            className="text-[13px] text-[#8A6B52] underline ml-2 shrink-0"
          >
            주소 복사
          </button>
        </div>

        {/* 전화 */}
        {phone && (
          <div className="flex items-center gap-2 text-[#444] mb-1">
            <Phone size={18} />
            <span className="text-[15px]">{phone}</span>
          </div>
        )}

        {/* 인스타 / 홈페이지 */}
        {(instagramUrl || homepageUrl) && (
          <div className="flex items-center gap-2 text-[#444] underline mb-4">
            <Instagram size={18} />
            <a
              href={instagramUrl || homepageUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[15px] truncate"
            >
              {instagramUrl || homepageUrl}
            </a>
          </div>
        )}

        {/* 운영 정보 */}
        <h2 className="text-[17px] font-semibold mt-3 mb-3">운영 정보</h2>

        {/* 지역 화폐: 아직 실제 데이터 없음 → 알럿용 카드 */}
        <button
          type="button"
          onClick={handleClickLocalCurrency}
          className="w-full text-left bg-[#E7F6EC] border border-[#B8E2C2] rounded-xl p-4 mb-4"
        >
          <p className="text-[15px] text-[#087443] font-semibold">
            지역 화폐 사용 가능
          </p>
          <p className="text-[14px] text-[#3A6D52] mt-1">양주사랑카드</p>
        </button>

        {/* 오늘 운영 시간 박스 (더미 + 알럿) */}
        <button
          type="button"
          onClick={handleToggleSchedule}
          className="w-full border border-[#E6D9CC] rounded-xl p-4 mb-2 text-left"
        >
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <span className="text-[15px] font-medium">오늘 (월)</span>
              {openNow !== undefined && (
                <span
                  className={`ml-2 text-[14px] font-semibold ${
                    openNow ? 'text-[#0E9A70]' : 'text-[#C3402C]'
                  }`}
                >
                  {openNow ? '영업중' : '영업 종료'}
                </span>
              )}
            </div>
            <span className="text-[15px]">
              {timetable[0]?.closed ? '정기 휴무' : timetable[0]?.time}
            </span>
            <ChevronDown
              className={`ml-1 transition-transform ${
                openSchedule ? 'rotate-180' : ''
              }`}
              size={18}
            />
          </div>

          {openSchedule && (
            <div className="mt-4 pt-3 border-t text-[15px]">
              <Timetable timetable={timetable} />
            </div>
          )}
        </button>

        {/* 휴무 / AI 추천 이유: 지금은 기획용 더미 텍스트 */}
        <div className="mt-4 text-[14px] text-[#C3402C]">
          🔥 휴무 <br />
          매주 화요일 정기 휴무
        </div>

        <div className="mt-4 text-[14px] text-[#444] leading-relaxed">
          <span className="font-bold">AI 현무 추천이유</span>
          <br />
          다양한 감성 디저트를 즐길 수 있는 대표 핫플 카페
        </div>
      </div>
    </div>
  );
}

function Timetable({ timetable }) {
  return (
    <div className="flex flex-col gap-2">
      {timetable.map((item) => (
        <div key={item.day} className="flex justify-between">
          <span className="text-[#444]">{item.day}</span>
          {item.closed ? (
            <span className="text-[#C3402C] font-semibold">정기 휴무</span>
          ) : (
            <span>{item.time}</span>
          )}
        </div>
      ))}
    </div>
  );
}
