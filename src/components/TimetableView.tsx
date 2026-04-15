import { useEffect, useState } from 'react';
import { useEventStore, type SportEvent } from '@/store/useEventStore';
import TotalScoreBoard from './TotalScoreBoard';

const TimetableView = () => {
  const events = useEventStore((s) => s.events);
  const setEventStatus = useEventStore((s) => s.setEventStatus);
  const setViewMode = useEventStore((s) => s.setViewMode);

  const [scale, setScale] = useState(1);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleResize = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = (e: React.MouseEvent, event: SportEvent) => {
    e.stopPropagation();
    events.forEach(ev => {
      if (ev.status === 'IN_PROGRESS' && ev.id !== event.id) {
        setEventStatus(ev.id, 'COMPLETED');
      }
    });
    setEventStatus(event.id, 'IN_PROGRESS');
    setViewMode('IN_PROGRESS');
  };

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="fixed inset-0 z-40 bg-white overflow-hidden flex items-center justify-center animate-in fade-in duration-500">
      <div
        className="relative w-[1920px] h-[1080px] shrink-0"
        style={{ transform: `scale(${scale})` }}
      >
        <img src="/assets/background/기본 화면(개막식).svg" className="absolute inset-0 w-full h-full object-cover -z-10" alt="" />

        <TotalScoreBoard />

        {/* Vertical stripes for events */}
        <div className="absolute top-[120px] left-0 flex w-[1920px] h-[530px]">
          {(() => {
            const currentTotalMinutes = time.getHours() * 60 + time.getMinutes();
            const getMinutes = (t: string) => {
              const [h, m] = t.split(':').map(Number);
              return h * 60 + m;
            };

            const effectiveEvents = events.map((ev, idx) => {
              const nextEv = events[idx + 1];
              // Event is assumed ended if current time has passed the next event's start time
              const isTimeCompleted = nextEv
                ? currentTotalMinutes >= getMinutes(nextEv.time)
                : currentTotalMinutes >= getMinutes(ev.time) + 60;

              let effStatus = ev.status;
              // If untouched/UPCOMING but time has naturally progressed past it, visually mark as COMPLETED
              if (effStatus === 'UPCOMING' && isTimeCompleted) {
                effStatus = 'COMPLETED';
              }
              return { ...ev, effectiveStatus: effStatus };
            });

            const firstUpcomingEvent = effectiveEvents.find((e) => e.effectiveStatus === 'UPCOMING');

            return effectiveEvents.map((event, index) => {
              const isPink = index % 2 === 0;
              const textClass = isPink ? 'text-black' : 'text-[#ff40c2]';
              const iconTop = !isPink; // Top if black, bottom if pink
              const isCompleted = event.effectiveStatus === 'COMPLETED';
              const isNextEvent = event.effectiveStatus === 'UPCOMING' && event.id === firstUpcomingEvent?.id;

              return (
                <div
                  key={event.id}
                  onClick={(e) => handleClick(e, event)}
                  className={`relative flex-[1_1_100%] cursor-pointer transition-transform active:scale-95 bg-transparent`}
                >
                  {/* Dim Overlay */}
                  {isCompleted && (
                    <div className="absolute inset-0 bg-black/60 pointer-events-none z-10" />
                  )}

                  {/* Status Icons */}
                  <div className={`absolute left-1/2 -translate-x-1/2 w-[42px] h-[42px] z-20 ${iconTop ? 'top-[40px]' : 'bottom-[40px]'}`}>
                    {isCompleted && (
                      <img src="/assets/completed-box.svg" alt="completed" className="w-[42px] h-[42px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                    {event.effectiveStatus === 'IN_PROGRESS' && (
                      <img src="/assets/loading-circle.svg" alt="in progress" className="w-[60px] h-[61px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.3]" />
                    )}
                    {isNextEvent && (
                      <img src="/assets/arrow-up.svg" alt="upcoming" className="w-[56px] h-[56px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 scale-125" />
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>

        {/* Big Clock */}
        <p className="absolute left-1/2 -translate-x-1/2 top-[685px] font-sans text-[432px] text-black leading-none tracking-[0.05em] m-0 whitespace-nowrap tabular-nums z-10 pointer-events-none shadow-none">
          {hours}:{minutes}:{seconds}
        </p>

      </div>
    </div>
  );
};

export default TimetableView;
