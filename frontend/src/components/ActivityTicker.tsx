interface Item {
  id: number | string;
  text: string;
}

export default function ActivityTicker({ items }: { items: Item[] }) {
  if (!items.length) return null;
  const loop = [...items, ...items];

  return (
    <div className="fixed bottom-0 left-4 right-4 h-9 overflow-hidden border-t border-white/5">
      <div className="flex items-center gap-10 whitespace-nowrap animate-[ticker_30s_linear_infinite] text-xs text-slate-400/80">
        {loop.map((item, i) => (
          <span key={`${item.id}-${i}`} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan/70" />
            {item.text}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
