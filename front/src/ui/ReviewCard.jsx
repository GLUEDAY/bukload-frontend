export default function ReviewCard({ review, onPressMore, onDelete, onEdit }) {
  const {
    id, // 리뷰 id
    title, // 장소/코스 이름
    areaLabel, // 예: 의정부 | 양주 등
    categoryLabel, // 예: 감성 카페 | 걷길 …
    thumbnail, // 이미지 URL
    content, // 본문
    createdAt, // ISO
  } = review;

  return (
    <div className="rounded-2xl border border-[#E6D9CC] bg-white p-3 shadow-sm">
      <div className="flex gap-3">
        <img
          src={thumbnail || "/map-placeholder.png"}
          alt={title}
          className="h-14 w-14 shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-[#8A6B52]">{title}</p>
          <p className="text-[11px] text-[#8A6B52]/70">{areaLabel} · {categoryLabel}</p>
          <p className="mt-1 line-clamp-3 text-[13px] text-[#58483A]">{content}</p>
          <button
            className="mt-1 text-[12px] font-medium text-[#F07818] underline"
            onClick={() => onPressMore?.(review)}
          >
            …더보기
          </button>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#8A6B52]/70">
            <span>{new Date(createdAt).toLocaleDateString()}</span>
            <div className="space-x-3">
              <button onClick={() => onEdit?.(review)} className="hover:underline">수정</button>
              <button onClick={() => onDelete?.(id)} className="hover:underline">삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
