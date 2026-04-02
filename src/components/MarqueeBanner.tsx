import { useEventStore } from '@/store/useEventStore';

const MarqueeBanner = () => {
  const announcement = useEventStore((s) => s.announcement);

  if (!announcement) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-secondary border-t border-border overflow-hidden">
      <div className="py-3">
        <p className="animate-marquee whitespace-nowrap text-lg font-semibold text-accent">
          {announcement}
        </p>
      </div>
    </div>
  );
};

export default MarqueeBanner;
