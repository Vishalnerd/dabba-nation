// components/LegalLayout.tsx
export default function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9F7F0] pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto bg-white border-4 border-[#333333] rounded-[2.5rem] p-8 md:p-16 shadow-[12px_12px_0px_#FFD166]">
        <h1 className="text-4xl md:text-6xl font-black text-[#333333] uppercase italic tracking-tighter mb-12 border-b-8 border-[#FF8C42] inline-block">
          {title}
        </h1>
        <div className="prose prose-lg max-w-none font-bold text-gray-700 space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}
