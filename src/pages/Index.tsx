import { useCallback, useEffect, useState, useMemo } from 'react';
import DigitalClock from '@/components/DigitalClock';
import MarqueeBanner from '@/components/MarqueeBanner';
import InProgressView from '@/components/InProgressView';
import PreparationView from '@/components/PreparationView';
import TimetableView from '@/components/TimetableView';
import AnnouncementOverlay from '@/components/AnnouncementOverlay';
import { useEventStore, type ViewMode } from '@/store/useEventStore';
import { Clock } from 'lucide-react';

const DisplayPage = () => {
  const viewMode = useEventStore((s) => s.viewMode);
  const announcement = useEventStore((s) => s.announcement);
  const announcementTimestamp = useEventStore((s) => s.announcementTimestamp);
  const events = useEventStore((s) => s.events);
  const [showBigAnnouncement, setShowBigAnnouncement] = useState(false);
  const [loadTime] = useState(Date.now());


  const effectiveViewMode = useMemo(() => {
    // 1. Check for any event currently IN_PROGRESS
    const currentEvent = events.find((e) => e.status === 'IN_PROGRESS');

    if (currentEvent) {
      // If it's a sports event (has teamA/B), show InProgress scoreboard
      // Otherwise (Ceremony, Performance, etc.), show Timetable
      if (currentEvent.teamA) {
        return 'IN_PROGRESS';
      } else {
        return 'TIMETABLE';
      }
    }

    // 2. If no event is IN_PROGRESS, find the next event to prepare
    // Find the last index of a COMPLETED event
    const lastCompletedIndex = [...events].reverse().findIndex(e => e.status === 'COMPLETED');
    const actualLastCompletedIdx = lastCompletedIndex === -1 ? -1 : events.length - 1 - lastCompletedIndex;

    const nextIndex = actualLastCompletedIdx + 1;

    if (nextIndex < events.length) {
      return 'PREPARATION';
    }

    // Default to TIMETABLE if everything is done or no state found
    return 'TIMETABLE';
  }, [events]);

  // Derived nextEvent for PreparationView
  const preparationEvent = useMemo(() => {
    const lastCompletedIndex = [...events].reverse().findIndex(e => e.status === 'COMPLETED');
    const actualLastCompletedIdx = lastCompletedIndex === -1 ? -1 : events.length - 1 - lastCompletedIndex;
    const nextIndex = actualLastCompletedIdx + 1;
    return events[nextIndex] || events[0];
  }, [events]);

  useEffect(() => {
    // Only show if the announcement was triggered AFTER the page loaded
    if (announcementTimestamp > loadTime) {
      setShowBigAnnouncement(true);
      const timer = setTimeout(() => setShowBigAnnouncement(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [announcementTimestamp, loadTime]);

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
      className="min-h-screen flex flex-col bg-[#F4F4F4]"
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
        {effectiveViewMode === 'TIMETABLE' && <TimetableView />}
        {effectiveViewMode === 'IN_PROGRESS' && <InProgressView />}
        {effectiveViewMode === 'PREPARATION' && <PreparationView />}
      </div>

      {/* Marquee Banner */}
      <MarqueeBanner />

      {/* Big Announcement Overlay */}
      <AnnouncementOverlay show={showBigAnnouncement} announcement={announcement} />
    </div>
  );
};

export default DisplayPage;

