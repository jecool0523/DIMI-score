import { useEffect, useRef } from 'react';
import { useEventStore } from '@/store/useEventStore';
import confetti from 'canvas-confetti';
import { icons, ArrowRight, Clock } from 'lucide-react';

const InProgressView = () => {
  const events = useEventStore((s) => s.events);
  const current = events.find((e) => e.status === 'IN_PROGRESS');
  const currentIdx = events.findIndex((e) => e.status === 'IN_PROGRESS');
  const next = currentIdx >= 0 ? events.slice(currentIdx + 1).find((e) => e.status === 'UPCOMING') : null;

  const prevScoreARef = useRef(current?.scoreA);
  const prevScoreBRef = useRef(current?.scoreB);

  useEffect(() => {
    if (current?.scoreA !== undefined && prevScoreARef.current !== undefined) {
      if (current.scoreA > prevScoreARef.current) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { x: 0, y: 0.5 },
          angle: 45,
          colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#ffffff']
        });
      }
    }
    prevScoreARef.current = current?.scoreA;
  }, [current?.scoreA]);

  useEffect(() => {
    if (current?.scoreB !== undefined && prevScoreBRef.current !== undefined) {
      if (current.scoreB > prevScoreBRef.current) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { x: 1, y: 0.5 },
          angle: 135,
          colors: ['#ffffff', '#f8fafc', '#e2e8f0', '#94a3b8']
        });
      }
    }
    prevScoreBRef.current = current?.scoreB;
  }, [current?.scoreB]);

  if (!current) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="font-display text-3xl text-muted-foreground">현재 진행 중인 종목이 없습니다</p>
      </div>
    );
  }

  const IconComponent = icons[current.icon as keyof typeof icons];

  const totalScore = (current.scoreA || 0) + (current.scoreB || 0);
  const percentA = totalScore === 0 ? 50 : (current.scoreA / totalScore) * 100;
  const percentB = totalScore === 0 ? 50 : (current.scoreB / totalScore) * 100;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8 w-full max-w-5xl">
      {/* Main event icon & name */}
      <div className="flex flex-col items-center gap-4">
        {IconComponent && <IconComponent size={96} className="text-primary" />}
        <h1 className="font-display text-6xl text-foreground">{current.name}</h1>
      </div>

      {/* Scoreboard */}
      {current.teamA && current.teamB && (
        <div className="flex flex-col items-center w-full mt-4">
          <div className="flex items-center justify-center gap-20 w-full">
            <div className="flex flex-col items-center gap-2 flex-1 items-end">
              <span className="text-3xl font-semibold tracking-widest text-primary uppercase">{current.teamA}</span>
              <span className="font-display text-[12rem] text-foreground leading-none drop-shadow-md">{current.scoreA}</span>
            </div>
            <span className="font-display text-7xl text-muted-foreground/30 mb-8">:</span>
            <div className="flex flex-col items-center gap-2 flex-1 items-start">
              <span className="text-3xl font-semibold tracking-widest text-muted-foreground uppercase">{current.teamB}</span>
              <span className="font-display text-[12rem] text-foreground leading-none drop-shadow-md">{current.scoreB}</span>
            </div>
          </div>

          {/* Visual Score Bar */}
          <div className="w-full max-w-4xl h-8 flex rounded-full overflow-hidden bg-secondary mt-12 relative shadow-inner">
            <div
              className="h-full bg-primary transition-all duration-700 ease-out flex items-center justify-start px-4"
              style={{ width: `${percentA}%` }}
            >
              {percentA >= 15 && <span className="text-primary-foreground font-bold text-sm">{Math.round(percentA)}%</span>}
            </div>
            <div
              className="h-full transition-all duration-700 ease-out flex items-center justify-end px-4"
              style={{ width: `${percentB}%`, backgroundColor: 'hsl(0 0% 23%)' }}
            >
              {percentB >= 15 && <span className="text-white font-bold text-sm">{Math.round(percentB)}%</span>}
            </div>
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
