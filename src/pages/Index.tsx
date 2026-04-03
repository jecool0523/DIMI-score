import { useCallback } from 'react';
import DigitalClock from '@/components/DigitalClock';
import MarqueeBanner from '@/components/MarqueeBanner';
import InProgressView from '@/components/InProgressView';
import PreparationView from '@/components/PreparationView';
import TimetableView from '@/components/TimetableView';
import { useEventStore } from '@/store/useEventStore';

const DisplayPage = () => {
  const viewMode = useEventStore((s) => s.viewMode);

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
      className="min-h-screen flex flex-col bg-background"
      onDoubleClick={handleClick}
    >
      {/* Clock always on top */}
      <div className="flex justify-center py-6">
        <DigitalClock />
      </div>

      {/* Main views */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {viewMode === 'TIMETABLE' && <TimetableView />}
        {viewMode === 'IN_PROGRESS' && <InProgressView />}
        {viewMode === 'PREPARATION' && <PreparationView />}
      </div>

      {/* Marquee Banner */}
      <MarqueeBanner />
    </div>
  );
};

export default DisplayPage;

