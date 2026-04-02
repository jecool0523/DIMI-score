import DigitalClock from '@/components/DigitalClock';
import MarqueeBanner from '@/components/MarqueeBanner';
import TotalScoreBoard from '@/components/TotalScoreBoard';
import TimetableView from '@/components/TimetableView';
import InProgressView from '@/components/InProgressView';
import PreparationView from '@/components/PreparationView';
import { useEventStore } from '@/store/useEventStore';

const DisplayPage = () => {
  const viewMode = useEventStore((s) => s.viewMode);
  const events = useEventStore((s) => s.events);

  // Find current in-progress event name for display
  const currentEvent = events.find((e) => e.status === 'IN_PROGRESS');
  const currentEventName = currentEvent?.name ?? '-';

  return (
    <div className="min-h-screen flex flex-col bg-background pb-14">
      {/* Main scoreboard header */}
      <TotalScoreBoard currentEventName={currentEventName} />

      {/* Main content */}
      <div className="flex-1">
        {viewMode === 'TIMETABLE' && <TimetableView />}
        {viewMode === 'IN_PROGRESS' && <InProgressView />}
        {viewMode === 'PREPARATION' && <PreparationView />}
      </div>

      {/* Marquee */}
      <MarqueeBanner />
    </div>
  );
};

export default DisplayPage;
