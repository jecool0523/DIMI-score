import { useCallback, useEffect, useState } from 'react';
import DigitalClock from '@/components/DigitalClock';
import MarqueeBanner from '@/components/MarqueeBanner';
import InProgressView from '@/components/InProgressView';
import PreparationView from '@/components/PreparationView';
import TimetableView from '@/components/TimetableView';
import AnnouncementOverlay from '@/components/AnnouncementOverlay';
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
      {/* Clock only when no specific view is active */}
      {!viewMode && (
        <div className="flex flex-col items-center justify-center py-6">
          <DigitalClock />
        </div>
      )}

      {/* Main views */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {viewMode === 'TIMETABLE' && <TimetableView />}
        {viewMode === 'IN_PROGRESS' && <InProgressView />}
        {viewMode === 'PREPARATION' && <PreparationView />}
      </div>

      {/* Marquee Banner */}
      {viewMode !== 'TIMETABLE' && <MarqueeBanner />}

      {/* Big Announcement Overlay */}
      <AnnouncementOverlay show={showBigAnnouncement} announcement={announcement} />
    </div>
  );
};

export default DisplayPage;

