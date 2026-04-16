import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
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


  const effectiveViewMode = useMemo(() => {
    // 1. Check for any event currently IN_PROGRESS
    // We use findLast (finding from the end of chronological array) to prioritize the latest active event
    // if multiple events are temporarily marked IN_PROGRESS due to sync delays.
    const currentEvent = [...events].reverse().find((e) => e.status === 'IN_PROGRESS');

    let mode: ViewMode = 'TIMETABLE';

    if (currentEvent) {
      // If it's a sports event (has teamA/B), show InProgress scoreboard
      // Otherwise (Ceremony, Performance, etc.), show Timetable
      // Using .trim() to handle empty strings if they exist
      if (currentEvent.teamA && currentEvent.teamA.trim() !== '') {
        mode = 'IN_PROGRESS';
      } else {
        mode = 'TIMETABLE';
      }
    } else {
      // 2. If no event is IN_PROGRESS, find the next event to prepare
      const lastCompletedIndex = [...events].reverse().findIndex(e => e.status === 'COMPLETED');
      const actualLastCompletedIdx = lastCompletedIndex === -1 ? -1 : events.length - 1 - lastCompletedIndex;
      const nextIndex = actualLastCompletedIdx + 1;

      if (nextIndex < events.length) {
        mode = 'PREPARATION';
      } else {
        mode = 'TIMETABLE';
      }
    }

    console.log(`[ViewMode] Logical state updated: ${mode}${currentEvent ? ` (Current: ${currentEvent.name})` : ' (No active event)'}`);
    return mode;
  }, [events]);

  // Derived nextEvent for PreparationView
  const preparationEvent = useMemo(() => {
    const lastCompletedIndex = [...events].reverse().findIndex(e => e.status === 'COMPLETED');
    const actualLastCompletedIdx = lastCompletedIndex === -1 ? -1 : events.length - 1 - lastCompletedIndex;
    const nextIndex = actualLastCompletedIdx + 1;
    return events[nextIndex] || events[0];
  }, [events]);

  const lastSeenRef = useRef<number>(announcementTimestamp);
  const [isFirstSync, setIsFirstSync] = useState(true);

  useEffect(() => {
    // Initial sync: capture the current timestamp but don't show the overlay
    if (isFirstSync) {
      lastSeenRef.current = announcementTimestamp;
      if (announcementTimestamp > 0) {
        setIsFirstSync(false);
      }
      return;
    }

    // Subsequent updates: trigger only if timestamp HAS CHANGED and announcement is not empty
    if (announcementTimestamp !== lastSeenRef.current) {
      lastSeenRef.current = announcementTimestamp;

      if (announcement.trim() !== '') {
        console.log(`📣 Triggering big announcement: "${announcement}" (Timestamp: ${announcementTimestamp})`);
        setShowBigAnnouncement(true);
        const timer = setTimeout(() => setShowBigAnnouncement(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [announcementTimestamp, announcement, isFirstSync]);

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

