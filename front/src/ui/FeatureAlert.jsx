export default function FeatureAlert({ message = "준비 중인 기능입니다" }) {
  return (
    <div className="fixed inset-0 z-[9998] grid place-items-center pointer-events-none">
      <div className="relative pointer-events-auto rounded-xl border border-[#2F6D62]/30 bg-[#E8FFF3] px-4 py-3 text-sm text-[#2F6D62] shadow">
        {message}
        {/* tail */}
        <div className="absolute left-1/2 top-full -translate-x-1/2">
          <div className="h-3 w-3 rotate-45 border border-[#2F6D62]/30 bg-[#E8FFF3]" />
        </div>
      </div>
    </div>
  );
}
