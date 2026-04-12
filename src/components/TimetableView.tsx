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
          {events.map((event, index) => {
            const isPink = index % 2 === 0;
            const bgClass = isPink ? 'bg-[#ff40c3]' : 'bg-black';
            const textClass = isPink ? 'text-black' : 'text-[#ff40c2]'; // Pink text on black

            return (
              <div
                key={event.id}
                onClick={(e) => handleClick(e, event)}
                className={`relative overflow-hidden flex-[1_1_100%] cursor-pointer transition-transform active:scale-95 ${bgClass}`}
              >
                {/* Event Name */}
                <div className={`absolute top-[40px] left-1/2 -translate-x-1/2 flex flex-col items-center font-['Pretendard'] font-extrabold text-[80px] leading-[0.8] select-none whitespace-nowrap ${textClass}`}>
                  {event.name.split('').map((char, i) => (
                    <span key={i} className="mb-2">{char}</span>
                  ))}
                </div>

                {/* Status Icons */}
                {event.status === 'COMPLETED' && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[40px] w-[60px] h-[61px]">
                    <img src="/assets/loading-circle.svg" alt="completed" className="w-full h-full opacity-60" />
                  </div>
                )}

                {event.status === 'IN_PROGRESS' && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[40px] w-[56px] h-[56px] rotate-90">
                    <img src="/assets/arrow-up.svg" alt="in progress" className="w-full h-full" />
                  </div>
                )}
              </div>
            );
          })}
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
