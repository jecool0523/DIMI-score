import { useEventStore } from '@/store/useEventStore';
import { useIsMobile } from '@/hooks/use-mobile';

const MarqueeBanner = () => {
  const announcement = useEventStore((s) => s.announcement);
  const isMobile = useIsMobile();

  if (!announcement) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-transparent overflow-hidden ${isMobile ? 'h-[60px]' : 'h-[120px]'} flex items-center`}>
      <p className={`animate-marquee whitespace-nowrap ${isMobile ? 'text-[40px]' : 'text-[80px]'} font-bold tracking-tight text-black`}>
        {announcement}
      </p>
    </div>
  );
};

export default MarqueeBanner;
