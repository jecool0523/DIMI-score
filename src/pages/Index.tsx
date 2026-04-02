import DigitalClock from '@/components/DigitalClock';
import MarqueeBanner from '@/components/MarqueeBanner';
import TotalScoreBoard from '@/components/TotalScoreBoard';
import TimetableView from '@/components/TimetableView';
import InProgressView from '@/components/InProgressView';
import PreparationView from '@/components/PreparationView';
import { useEventStore } from '@/store/useEventStore';

const DisplayPage = () => {
  const viewMode = useEventStore((s) => s.viewMode);

  return (
    <div className="min-h-screen flex flex-col bg-background pb-14">
      {/* Top bar with clock + score */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="w-[200px]" />
        <DigitalClock />
        <TotalScoreBoard />
      </header>

      {/* Main content */}
      {viewMode === 'TIMETABLE' && <TimetableView />}
      {viewMode === 'IN_PROGRESS' && <InProgressView />}
      {viewMode === 'PREPARATION' && <PreparationView />}

      {/* Marquee */}
      <MarqueeBanner />
    </div>
  );
};

export default DisplayPage;
