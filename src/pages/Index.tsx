import { useCallback } from 'react';
import DigitalClock from '@/components/DigitalClock';
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
      className="min-h-screen flex flex-col bg-background cursor-pointer"
      onClick={handleClick}
    >
      {/* Event title */}
      <div className="text-center pt-6 pb-2">
        <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          현재 진행 중
        </span>
        <h1 className="font-display text-2xl text-foreground mt-1">
          {currentEventName === '-' ? '대기 중' : currentEventName}
        </h1>
      </div>

      {/* Clock */}
      <div className="flex justify-center py-4">
        <DigitalClock />
      </div>

      {/* Scoreboard */}
      <TotalScoreBoard currentEventName={currentEventName} />

      {/* Sub-views */}
      {viewMode === 'IN_PROGRESS' && <InProgressView />}
      {viewMode === 'PREPARATION' && <PreparationView />}

      {/* Marquee */}
      <MarqueeBanner />
    </div>
  );
};

export default DisplayPage;
