import { useEventStore } from '@/store/useEventStore';

const MarqueeBanner = () => {
  const announcement = useEventStore((s) => s.announcement);

  if (!announcement) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-transparent overflow-hidden h-[120px] flex items-center">
      <p className="animate-marquee whitespace-nowrap text-[80px] font-bold tracking-tight text-black">
        {announcement}
      </p>
    </div>
  );
};

export default MarqueeBanner;
