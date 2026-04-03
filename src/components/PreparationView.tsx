import { useEventStore } from '@/store/useEventStore';
import { icons, AlertTriangle, Clock } from 'lucide-react';

const PreparationView = () => {
  const events = useEventStore((s) => s.events);
  const nextEvent = events.find((e) => e.status === 'UPCOMING') || events.find((e) => e.status === 'IN_PROGRESS');

  if (!nextEvent) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="font-display text-4xl text-muted-foreground animate-in fade-in zoom-in duration-500">모든 일정이 종료되었습니다 🎉</p>
      </div>
    );
  }

  const IconComponent = icons[nextEvent.icon as keyof typeof icons];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 gap-12 w-full animate-in fade-in fill-mode-both duration-700">
      <div className="flex flex-col items-center gap-6">
        <div className="bg-warning/10 p-8 rounded-full mb-4">
          {IconComponent && <IconComponent size={120} className="text-warning animate-pulse" />}
        </div>
        <div className="flex flex-col items-center gap-4">
          <span className="text-2xl font-bold tracking-[0.2em] text-warning/80 uppercase">
            다음 진행 종목
          </span>
          <h1 className="font-display text-[7rem] text-foreground leading-none drop-shadow-lg">
            {nextEvent.name}
          </h1>
          <div className="flex items-center gap-3 mt-4 bg-secondary/80 px-8 py-3 rounded-full border border-border/50 shadow-sm text-3xl font-medium tracking-wide">
            <Clock size={32} className="text-warning" />
            <span className="text-muted-foreground">시작 예정 시간: <span className="text-foreground font-bold">{nextEvent.time}</span></span>
          </div>
        </div>
      </div>

      <div className="animate-pulse-glow flex items-center gap-5 bg-secondary/90 border-4 border-warning px-12 py-8 rounded-2xl mt-8 shadow-2xl">
        <AlertTriangle className="text-warning" size={48} />
        <p className="text-4xl font-bold text-warning tracking-wide">
          참가자들은 지금 바로 본부석으로 모여주시기 바랍니다!
        </p>
      </div>
    </div>
  );
};

export default PreparationView;
