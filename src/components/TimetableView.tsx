import { useEffect, useState } from 'react';
import { useEventStore, type SportEvent } from '@/store/useEventStore';
import TotalScoreBoard from './TotalScoreBoard';
import { motion } from 'framer-motion';

const TimetableView = () => {
  const events = useEventStore((s) => s.events);
  const setEventStatus = useEventStore((s) => s.setEventStatus);
  const setViewMode = useEventStore((s) => s.setViewMode);

  const [scale, setScale] = useState(1);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleResize = () => {
      const baseWidth = 1920;
      const baseHeight = 1080;
      const scaleW = window.innerWidth / baseWidth;
      const scaleH = window.innerHeight / baseHeight;
      setScale(Math.min(scaleW, scaleH));
    };
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
    <div className="fixed inset-0 z-40 bg-[#F4F4F4] overflow-hidden flex items-start justify-center animate-in fade-in duration-500">
      <div
        className="relative shrink-0"
        style={{
          width: '1920px',
          height: '1080px',
          transform: `scale(${scale})`,
          transformOrigin: 'top'
        }}
      >
        <img
          src="/assets/background/기본 화면(개막식).svg"
          className="absolute inset-0 w-full h-full object-cover -z-10"
          alt=""
        />

        <TotalScoreBoard />

        <div className="absolute top-[120px] left-0 w-full flex h-[493px]">
          {(() => {
            const currentTotalMinutes = time.getHours() * 60 + time.getMinutes();
            const getMinutes = (t: string) => {
              const [h, m] = t.split(':').map(Number);
              return h * 60 + m;
            };

            const effectiveEvents = events.map((ev, idx) => {
              const nextEv = events[idx + 1];
              const isTimeCompleted = nextEv
                ? currentTotalMinutes >= getMinutes(nextEv.time)
                : currentTotalMinutes >= getMinutes(ev.time) + 60;

              let effStatus = ev.status;
              if (effStatus === 'UPCOMING' && isTimeCompleted) {
                effStatus = 'COMPLETED';
              }
              return { ...ev, effectiveStatus: effStatus };
            });

            return effectiveEvents.map((event, index) => {
              const isPink = index % 2 === 1;
              const textColor = isPink ? 'text-black' : 'text-[#ff40c2]';

              return (
                <div
                  key={event.id}
                  onClick={(e) => handleClick(e, event)}
                  className="relative flex-[1_1_100%] cursor-pointer transition-transform active:scale-95 flex flex-col items-center justify-center overflow-hidden"
                >
                  <div className="font-sans font-black text-[60px] text-zinc-900 leading-tight">
                    {event.time}
                  </div>
                  <div className={`font-sans font-extrabold text-[80px] ${textColor} leading-tight text-center px-4`}>
                    {event.name}
                  </div>

                  {event.status === 'IN_PROGRESS' && (
                    <motion.div
                      className="absolute top-4 right-4"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <div className="bg-red-500 text-white px-3 py-1 rounded text-[20px] font-bold uppercase tracking-wider shadow-lg">LIVE</div>
                    </motion.div>
                  )}

                  {event.effectiveStatus === 'COMPLETED' && (
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none">
                      <div className="bg-gray-800/80 px-4 py-2 rounded text-white font-bold text-4xl uppercase tracking-widest">COMPLETED</div>
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>

        <p className="absolute left-1/2 -translate-x-1/2 top-[580px] font-sans text-[395px] text-black leading-none tracking-[0.05em] m-0 whitespace-nowrap tabular-nums z-10 pointer-events-none shadow-none text-center">
          {hours}:{minutes}:{seconds}
        </p>

      </div>
    </div>
  );
};

export default TimetableView;
