import { useEventStore, type SportEvent } from '@/store/useEventStore';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

const statusConfig = {
  COMPLETED: {
    bg: 'bg-completed',
    text: 'text-completed-foreground line-through',
    icon: <CheckCircle2 className="text-completed-foreground" size={24} />,
  },
  IN_PROGRESS: {
    bg: 'bg-secondary animate-border-blink border-2 border-inprogress',
    text: 'text-inprogress font-bold',
    icon: <Clock className="text-inprogress" size={24} />,
  },
  UPCOMING: {
    bg: 'bg-card',
    text: 'text-foreground',
    icon: <Circle className="text-muted-foreground" size={24} />,
  },
};

const EventRow = ({ event }: { event: SportEvent }) => {
  const config = statusConfig[event.status];
  const setEventStatus = useEventStore((s) => s.setEventStatus);
  const setViewMode = useEventStore((s) => s.setViewMode);
  const events = useEventStore((s) => s.events);

  const handleClick = (e: any) => {
    e.stopPropagation();

    // 만약 다른 종목이 진행중이라면 완료 상태로 변경
    events.forEach(ev => {
      if (ev.status === 'IN_PROGRESS' && ev.id !== event.id) {
        setEventStatus(ev.id, 'COMPLETED');
      }
    });

    setEventStatus(event.id, 'IN_PROGRESS');
    setViewMode('IN_PROGRESS');
  };

  return (
    <div
      className={`flex items-center gap-4 px-6 py-4 rounded-lg mb-2 transition-all cursor-pointer hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-sm ${config.bg}`}
      onClick={handleClick}
    >
      <span className="text-2xl font-display text-muted-foreground w-20">{event.time}</span>
      {config.icon}
      <span className={`text-2xl font-display flex-1 ${config.text}`}>{event.name}</span>
      {event.status === 'IN_PROGRESS' && (
        <span className="text-xl font-bold text-inprogress">진행중</span>
      )}
      {event.status === 'COMPLETED' && (
        <span className="text-xl text-completed-foreground">완료</span>
      )}
    </div>
  );
};

const TimetableView = () => {
  const events = useEventStore((s) => s.events);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-6">
      <h1 className="font-display text-5xl text-foreground mb-8">📋 전체 일정표</h1>
      <div className="w-full max-w-3xl">
        {events.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default TimetableView;
