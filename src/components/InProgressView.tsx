import { useEventStore } from '@/store/useEventStore';
import { icons } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

const InProgressView = () => {
  const events = useEventStore((s) => s.events);
  const current = events.find((e) => e.status === 'IN_PROGRESS');
  const currentIdx = events.findIndex((e) => e.status === 'IN_PROGRESS');
  const next = currentIdx >= 0 ? events.slice(currentIdx + 1).find((e) => e.status === 'UPCOMING') : null;

  if (!current) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="font-display text-3xl text-muted-foreground">현재 진행 중인 종목이 없습니다</p>
      </div>
    );
  }

  const IconComponent = icons[current.icon as keyof typeof icons];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
      {/* Main event icon & name */}
      <div className="flex flex-col items-center gap-4">
        {IconComponent && <IconComponent size={96} className="text-primary" />}
        <h1 className="font-display text-6xl text-foreground">{current.name}</h1>
      </div>

      {/* Scoreboard */}
      {current.teamA && current.teamB && (
        <div className="flex items-center gap-8 mt-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl font-semibold text-muted-foreground">{current.teamA}</span>
            <span className="font-display text-9xl text-foreground leading-none">{current.scoreA}</span>
          </div>
          <span className="font-display text-5xl text-muted-foreground">:</span>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl font-semibold text-muted-foreground">{current.teamB}</span>
            <span className="font-display text-9xl text-foreground leading-none">{current.scoreB}</span>
          </div>
        </div>
      )}

      {/* Next event */}
      {next && (
        <div className="mt-8 flex items-center gap-3 bg-secondary px-6 py-3 rounded-lg">
          <ArrowRight className="text-accent" size={20} />
          <span className="text-xl text-accent font-semibold">NEXT</span>
          <span className="text-xl text-foreground">{next.name}</span>
        </div>
      )}
    </div>
  );
};

export default InProgressView;
