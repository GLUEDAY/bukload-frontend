import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../ui/Header";
import BottomNav from "../ui/BottomNav";
import ReviewCard from "../ui/ReviewCard";
import { useLoading } from "../context/LoadingContext";
import { useAlert } from "../context/AlertContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

/**
 * API (필요 시 path만 프로젝트 명세에 맞게 바꿔줘)
 * - GET    /reviews/me?page=1&pageSize=10
 *          -> { items: Review[], nextCursor?: string } 또는 { items, hasMore }
 * - DELETE /reviews/:id
 */
export default function MyReviewsPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const { withLoading } = useLoading();
  const { showAlert } = useAlert();

  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);   // 페이지네이션 커서/페이지
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const pageRef = useRef(1);

  // 다른 페이지에서 돌아올 때 새로고침 요청이 있으면 리로드
  useEffect(() => {
    if (loc.state?.refresh) reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.state]);

  useEffect(() => { reload(); }, []);

  const reload = async () => {
    pageRef.current = 1;
    await withLoading(async () => {
      const res = await fetch(`${API_BASE}/reviews/me?page=${pageRef.current}&pageSize=10`, { headers: authHeaders() });
      if (!res.ok) return showAlert("후기를 불러오지 못했어요");
      const data = await res.json();
      setItems(data.items || []);
      setCursor(data.nextCursor ?? (data.hasMore ? pageRef.current + 1 : null));
      setHasMore(Boolean(data.nextCursor ?? data.hasMore));
    });
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    await withLoading(async () => {
      // nextCursor가 있으면 커서로, 없으면 page 증가
      const url = (cursor && isNaN(cursor))
        ? `${API_BASE}/reviews/me?cursor=${encodeURIComponent(cursor)}&pageSize=10`
        : `${API_BASE}/reviews/me?page=${pageRef.current + 1}&pageSize=10`;

      const res = await fetch(url, { headers: authHeaders() });
      if (!res.ok) { setLoadingMore(false); return; }
      const data = await res.json();
      setItems((prev) => [...prev, ...(data.items || [])]);
      if (data.nextCursor) {
        setCursor(data.nextCursor); setHasMore(true);
      } else if (data.hasMore) {
        pageRef.current += 1; setCursor(pageRef.current + 1); setHasMore(true);
      } else {
        setHasMore(false);
      }
      setLoadingMore(false);
    });
  };

  const onPressMore = (review) => {
    // 코스/장소 상세로 넘기고 싶으면 해당 라우트로 이동, 없으면 알럿
    if (review.courseId) {
      nav(`/course/${review.courseId}`, { state: { from: "myreviews" } });
    } else if (review.placeId) {
      nav(`/place/${review.placeId}`, { state: { from: "myreviews" } });
    } else {
      showAlert("상세 페이지가 준비 중입니다");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("이 후기를 삭제할까요?")) return;
    await withLoading(async () => {
      const res = await fetch(`${API_BASE}/reviews/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) return showAlert("삭제에 실패했어요");
      setItems((prev) => prev.filter((r) => r.id !== id));
      showAlert("삭제되었습니다");
    });
  };

  const onEdit = (review) => {
    // 편집 페이지가 있으면 이동, 아니면 알럿
    nav(`/reviews/${review.id}/edit`, { state: { review } });
    // 편집 페이지가 아직 없으면 아래 한 줄로 대체
    // showAlert("후기 수정은 준비 중입니다");
  };

  return (
    <div className="min-h-screen bg-[#F6E2CC]/40">
      <Header title="내가 쓴 후기" back />

      <main className="mx-auto max-w-[420px] px-4 pb-24">
        <section className="mt-4 space-y-3">
          {items.length === 0 ? (
            <Empty />
          ) : (
            items.map((r) => (
              <ReviewCard
                key={r.id}
                review={r}
                onPressMore={onPressMore}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))
          )}

          {hasMore && (
            <button
              onClick={loadMore}
              className="mx-auto block w-full rounded-2xl border border-[#E6D9CC] bg-white py-2 text-sm text-[#8A6B52] hover:bg-[#F6F1EA]"
            >
              {loadingMore ? "불러오는 중..." : "더보기"}
            </button>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

function Empty() {
  return (
    <div className="grid place-items-center rounded-2xl border border-[#E6D9CC] bg-white py-16 text-[#8A6B52]">
      아직 작성한 후기가 없어요.
    </div>
  );
}

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
