import { useEventStore } from '@/store/useEventStore';
import { icons, AlertTriangle } from 'lucide-react';

const PreparationView = () => {
  const events = useEventStore((s) => s.events);
  const nextEvent = events.find((e) => e.status === 'UPCOMING') || events.find((e) => e.status === 'IN_PROGRESS');

  if (!nextEvent) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="font-display text-3xl text-muted-foreground">모든 일정이 종료되었습니다 🎉</p>
      </div>
    );
  }

  const IconComponent = icons[nextEvent.icon as keyof typeof icons];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
      <div className="flex flex-col items-center gap-4">
        {IconComponent && <IconComponent size={96} className="text-warning" />}
        <h1 className="font-display text-5xl text-foreground">
          다음 진행 종목: <span className="text-warning">{nextEvent.name}</span>
        </h1>
      </div>

      <div className="animate-pulse-glow flex items-center gap-3 bg-secondary border-2 border-warning px-8 py-5 rounded-xl mt-4">
        <AlertTriangle className="text-warning" size={32} />
        <p className="text-2xl font-bold text-warning">
          참가자들은 지금 바로 본부석으로 모여주시기 바랍니다!
        </p>
      </div>
    </div>
  );
};

export default PreparationView;
