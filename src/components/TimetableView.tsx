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
  return (
    <div className={`flex items-center gap-4 px-6 py-4 rounded-lg mb-2 transition-all ${config.bg}`}>
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
