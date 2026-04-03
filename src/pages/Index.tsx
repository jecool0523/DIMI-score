import { useCallback, useEffect, useState } from 'react';
import DigitalClock from '@/components/DigitalClock';
import MarqueeBanner from '@/components/MarqueeBanner';
import InProgressView from '@/components/InProgressView';
import PreparationView from '@/components/PreparationView';
import TimetableView from '@/components/TimetableView';
import { useEventStore } from '@/store/useEventStore';
import { Clock } from 'lucide-react';

const DisplayPage = () => {
  const viewMode = useEventStore((s) => s.viewMode);
  const announcement = useEventStore((s) => s.announcement);
  const announcementTimestamp = useEventStore((s) => s.announcementTimestamp);
  const events = useEventStore((s) => s.events);
  const [showBigAnnouncement, setShowBigAnnouncement] = useState(false);

  const currentIdx = events.findIndex((e) => e.status === 'IN_PROGRESS');
  const currentEvent = currentIdx >= 0 ? events[currentIdx] : null;
  const nextEvent = currentIdx >= 0 && currentIdx + 1 < events.length ? events[currentIdx + 1] : null;

  useEffect(() => {
    if (announcementTimestamp > 0) {
      setShowBigAnnouncement(true);
      const timer = setTimeout(() => setShowBigAnnouncement(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [announcementTimestamp]);

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
      <div className="flex flex-col items-center justify-center py-6">
        <DigitalClock />
        {viewMode === 'IN_PROGRESS' && currentEvent && (
          <div className="flex items-center gap-2 mt-3 bg-secondary/60 px-5 py-1.5 rounded-full border border-border/50 shadow-sm text-muted-foreground text-lg font-medium tracking-wide">
            <Clock size={16} className="text-primary" />
            <span>진행 시간: {currentEvent.time} ~ {nextEvent ? nextEvent.time : '종료 시까지'}</span>
          </div>
        )}
      </div>

      {/* Main views */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {viewMode === 'TIMETABLE' && <TimetableView />}
        {viewMode === 'IN_PROGRESS' && <InProgressView />}
        {viewMode === 'PREPARATION' && <PreparationView />}
      </div>

      {/* Marquee Banner */}
      <MarqueeBanner />

      {/* Big Announcement Overlay */}
      {showBigAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
          <div className="text-center p-8 max-w-[90vw]">
            <h2 className="text-4xl text-warning font-bold mb-8 uppercase tracking-widest animate-pulse">
              📢 공지사항
            </h2>
            <p className="text-[5rem] leading-tight font-display text-white break-keep drop-shadow-lg">
              {announcement}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayPage;

