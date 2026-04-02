import DigitalClock from '@/components/DigitalClock';
import MarqueeBanner from '@/components/MarqueeBanner';
import TimetableView from '@/components/TimetableView';
import InProgressView from '@/components/InProgressView';
import PreparationView from '@/components/PreparationView';
import { useEventStore } from '@/store/useEventStore';

const DisplayPage = () => {
  const viewMode = useEventStore((s) => s.viewMode);

  return (
    <div className="min-h-screen flex flex-col bg-background pb-14">
      {/* Top bar with clock */}
      <header className="flex justify-center py-6">
        <DigitalClock />
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
