import { useEventStore } from '@/store/useEventStore';
import DigitalClock from './DigitalClock';

interface Props {
  currentEventName: string;
}

const TotalScoreBoard = ({ currentEventName }: Props) => {
  const events = useEventStore((s) => s.events);

  let totalA = 0;
  let totalB = 0;
  events.forEach((e) => {
    if (e.teamA && e.teamB) {
      totalA += e.scoreA;
      totalB += e.scoreB;
    }
  });

  return (
    <div className="flex items-center justify-between px-12 py-10">
      {/* Team A - Blue */}
      <div className="flex flex-col items-center gap-3 min-w-[200px]">
        <div className="w-20 h-10 rounded" style={{ backgroundColor: 'hsl(210, 100%, 50%)' }} />
        <span className="font-display text-3xl text-foreground">청팀</span>
        <span className="font-display text-7xl text-foreground">{totalA}</span>
      </div>

      {/* Center - Clock + Event */}
      <div className="flex flex-col items-center gap-2">
        <DigitalClock />
        <span className="font-display text-2xl text-muted-foreground">
          종목 - {currentEventName}
        </span>
      </div>

      {/* Team B - Black/Dark */}
      <div className="flex flex-col items-center gap-3 min-w-[200px]">
        <div className="w-20 h-10 rounded bg-foreground" />
        <span className="font-display text-3xl text-foreground">백팀</span>
        <span className="font-display text-7xl text-foreground">{totalB}</span>
      </div>
    </div>
  );
};

export default TotalScoreBoard;
