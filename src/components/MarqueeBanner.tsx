import { useEventStore } from '@/store/useEventStore';

const MarqueeBanner = () => {
  const announcement = useEventStore((s) => s.announcement);

  if (!announcement) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-foreground overflow-hidden">
      <div className="py-3">
        <p className="animate-marquee whitespace-nowrap text-base font-semibold tracking-wide text-background">
          {announcement}
        </p>
      </div>
    </div>
  );
};

export default MarqueeBanner;
