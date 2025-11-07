export default function StepCard({ title, className = "", children }) {
  return (
    <section
      className={`rounded-2xl border border-[#E6D9CC] bg-[#FFE9D6]/80 backdrop-blur-[1px]
                  shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-4 ${className}`}
    >
      <h2 className="text-[22px] font-extrabold text-[#FF8400] mb-3">{title}</h2>
      {children}
    </section>
  );
}
