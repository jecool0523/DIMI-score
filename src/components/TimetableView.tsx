import { useEffect, useState } from 'react';
import { useEventStore, type SportEvent } from '@/store/useEventStore';
import TotalScoreBoard from './TotalScoreBoard';
import { motion } from 'framer-motion';

const TimetableView = ({ isLunchTime = false }: { isLunchTime?: boolean }) => {
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
    setEventStatus(event.id, 'IN_PROGRESS');
  };

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="w-full bg-[#F4F4F4] overflow-hidden flex items-start justify-center animate-in fade-in duration-500">
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
          src={
            isLunchTime
              ? '/assets/background/점심 화면.svg'
              : '/assets/background/기본 화면(개막식).svg'
          }
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
              return (
                <div
                  key={event.id}
                  onClick={(e) => handleClick(e, event)}
                  className="relative flex-[1_1_100%] cursor-pointer transition-transform active:scale-95 flex flex-col items-center justify-center overflow-hidden"
                >
                  {/* All text and status overlays removed as requested */}
                </div>
              );
            });
          })()}
        </div>

        <p className="absolute left-1/2 -translate-x-1/2 top-[580px] font-sans text-[395px] text-black leading-none tracking-[0.05em] m-0 whitespace-nowrap tabular-nums z-10 pointer-events-none shadow-none text-center">
          {hours}:{minutes}:{seconds}
        </p>

        <div className="absolute top-[120px] left-[170px] w-[100px] h-[493px] flex flex-col items-center justify-center gap-[40px] z-20">
          {[0, 0.4, 0.8].map((delay, i) => (
            <motion.div
              key={i}
              className="w-[100px] h-[100px]"
              style={{ rotate: 90 }}
              initial={{ opacity: 0, x: -30 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [-30, 0, 0, 30],
              }}
              transition={{
                duration: 3,
                times: [0, 0.1, 0.8, 1],
                ease: ["easeOut", "linear", "easeIn"],
                repeat: Infinity,
                repeatDelay: 3,
                delay: delay
              }}
            >
              <img
                src="/assets/match-arrow.svg"
                className="w-full h-full"
                style={{ filter: 'brightness(0) invert(1)' }}
                alt=""
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimetableView;
