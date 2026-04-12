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
    <div className="fixed inset-0 z-40 bg-[#111] overflow-hidden flex items-center justify-center animate-in fade-in duration-500">
      <div
        className="relative w-[1920px] h-[1080px] shrink-0"
        style={{ transform: `scale(${scale})` }}
      >
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
              const bgClass = isPink ? 'bg-[#ff40c3]' : 'bg-black';
              const textClass = isPink ? 'text-black' : 'text-[#ff40c2]';
              const iconTop = !isPink; // Top if black, bottom if pink
              const isCompleted = event.effectiveStatus === 'COMPLETED';
              const isNextEvent = event.effectiveStatus === 'UPCOMING' && event.id === firstUpcomingEvent?.id;

              return (
                <div
                  key={event.id}
                  onClick={(e) => handleClick(e, event)}
                  className={`relative overflow-hidden flex-[1_1_100%] cursor-pointer transition-transform active:scale-95 ${bgClass}`}
                >
                  {/* Event Name */}
                  <div className={`absolute top-[40px] left-1/2 -translate-x-1/2 flex flex-col items-center font-['Pretendard'] font-extrabold text-[80px] leading-[0.8] select-none whitespace-nowrap z-0 ${textClass}`}>
                    {event.name.split('').map((char, i) => (
                      <span key={i} className="mb-2">{char}</span>
                    ))}
                  </div>

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

        {/* Divider Line */}
        <div className="absolute top-[650px] left-0 w-[1920px] h-[1px]">
          <img alt="" className="w-full h-full object-cover" src="/assets/vector13.svg" />
        </div>

        {/* Big Clock */}
        <p className="absolute left-1/2 -translate-x-1/2 top-[685px] font-display text-[432px] text-white leading-none tracking-[0.05em] m-0 whitespace-nowrap tabular-nums">
          {hours}:{minutes}:{seconds}
        </p>

        {/* Footer from Figma */}
        <div className="absolute bg-[#111] flex flex-col h-[99px] items-center left-0 overflow-clip top-[981px] w-[1920px]">
          <div className="h-0 relative shrink-0 w-[1920px]">
            <div className="absolute inset-[-1.25px_0]">
              <img alt="" className="block max-w-none size-full" src="/assets/notice-footer-line.svg" />
            </div>
          </div>
          <div className="flex flex-[1_0_0] items-center justify-between px-[30px] w-full">
            <div className="h-[24.712px] relative shrink-0 w-[170.43px]">
              <img alt="Logo 1" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src="/assets/notice-footer-1.png" />
            </div>
            <div className="h-[34.177px] relative shrink-0 w-[60.413px]">
              <img alt="Center Footer Icon" className="absolute block inset-0 max-w-none size-full" src="/assets/notice-footer-2.svg" />
            </div>
            <div className="flex gap-[6.843px] items-center justify-center relative shrink-0">
              <div className="h-[32.424px] relative shrink-0 w-[23.53px]">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img alt="Logo 2" className="absolute h-[606%] left-[-670.26%] max-w-none top-[-252.7%] w-[2361.16%]" src="/assets/notice-footer-3.png" />
                </div>
              </div>
              <div className="h-[32.424px] relative shrink-0 w-[215.326px]">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img alt="Logo 3" className="absolute h-[606%] left-[-86.73%] max-w-none top-[-252.7%] w-[258.02%]" src="/assets/notice-footer-4.png" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TimetableView;
