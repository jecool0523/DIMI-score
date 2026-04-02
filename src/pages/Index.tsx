import { useCallback } from 'react';
import MarqueeBanner from '@/components/MarqueeBanner';
import TotalScoreBoard from '@/components/TotalScoreBoard';
import InProgressView from '@/components/InProgressView';
import PreparationView from '@/components/PreparationView';
import { useEventStore } from '@/store/useEventStore';

const DisplayPage = () => {
  const viewMode = useEventStore((s) => s.viewMode);
  const events = useEventStore((s) => s.events);

  const currentEvent = events.find((e) => e.status === 'IN_PROGRESS');
  const currentEventName = currentEvent?.name ?? '-';

  const handleClick = useCallback(() => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col bg-background pb-14 cursor-pointer"
      onClick={handleClick}
    >
      {/* Main scoreboard - takes up most of the screen */}
      <div className="flex-1 flex items-center justify-center">
        <TotalScoreBoard currentEventName={currentEventName} />
      </div>

      {/* Only show sub-views for IN_PROGRESS / PREPARATION */}
      {viewMode === 'IN_PROGRESS' && <InProgressView />}
      {viewMode === 'PREPARATION' && <PreparationView />}

      {/* Marquee */}
      <MarqueeBanner />
    </div>
  );
};

export default DisplayPage;
