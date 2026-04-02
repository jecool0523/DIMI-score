import { useEventStore } from '@/store/useEventStore';

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
    <div className="w-full">
      {/* Scores section */}
      <div className="grid grid-cols-2 w-full">
        {/* Team A */}
        <div className="relative bg-muted p-8 pt-2">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold tracking-[0.15em] text-primary uppercase">
                HOME TEAM
              </span>
              <h2 className="font-display text-4xl text-foreground mt-1 leading-tight">청팀</h2>
            </div>
            <div className="w-12 h-12 bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-lg">⚡</span>
            </div>
          </div>
          <span className="font-display text-[10rem] leading-none text-foreground block mt-4">
            {totalA}
          </span>
        </div>

        {/* Team B */}
        <div className="relative bg-muted p-8 pt-2">
          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: 'hsl(0 0% 23%)' }} />
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: 'hsl(0 0% 23%)' }}>
              <span className="text-white text-lg">⚡</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                AWAY TEAM
              </span>
              <h2 className="font-display text-4xl text-foreground mt-1 leading-tight">백팀</h2>
            </div>
          </div>
          <span className="font-display text-[10rem] leading-none text-foreground block mt-4 text-right">
            {totalB}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TotalScoreBoard;
