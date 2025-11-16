export default function LoadingOverlay({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-white/80">
      <div className="flex flex-col items-center gap-3">
        {/* spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E6D9CC] border-t-[#F07818]" />
        <p className="text-sm font-medium text-[#F07818]">{message}</p>
        <p className="text-xs text-[#8A6B52]">잠시만 기다려주세요</p>
      </div>
    </div>
  );
}
