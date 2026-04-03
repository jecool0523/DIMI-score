import { useCallback, useEffect, useState } from 'react';
import DigitalClock from '@/components/DigitalClock';
import MarqueeBanner from '@/components/MarqueeBanner';
import InProgressView from '@/components/InProgressView';
import PreparationView from '@/components/PreparationView';
import TimetableView from '@/components/TimetableView';
import { useEventStore } from '@/store/useEventStore';

const DisplayPage = () => {
  const viewMode = useEventStore((s) => s.viewMode);
  const announcement = useEventStore((s) => s.announcement);
  const announcementTimestamp = useEventStore((s) => s.announcementTimestamp);
  const [showBigAnnouncement, setShowBigAnnouncement] = useState(false);

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

