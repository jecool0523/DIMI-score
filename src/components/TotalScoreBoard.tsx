import { useEventStore } from '@/store/useEventStore';

const TotalScoreBoard = () => {
  const events = useEventStore((s) => s.events);

  // Sum scores across all events that have teams
  let totalA = 0;
  let totalB = 0;
  events.forEach((e) => {
    if (e.teamA && e.teamB) {
      totalA += e.scoreA;
      totalB += e.scoreB;
    }
  });

  return (
    <div className="flex items-center gap-0 rounded-lg overflow-hidden border-2 border-border shadow-lg">
      <div className="bg-[hsl(210,100%,50%)] px-6 py-2 min-w-[80px] flex items-center justify-center">
        <span className="font-display text-4xl text-[hsl(0,0%,100%)]">{totalA}</span>
      </div>
      <div className="bg-background px-3 py-2 flex items-center justify-center">
        <span className="font-display text-2xl text-muted-foreground">×</span>
      </div>
      <div className="bg-[hsl(0,70%,50%)] px-6 py-2 min-w-[80px] flex items-center justify-center">
        <span className="font-display text-4xl text-[hsl(0,0%,100%)]">{totalB}</span>
      </div>
    </div>
  );
};

export default TotalScoreBoard;
