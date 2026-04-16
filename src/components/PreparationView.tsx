import { useEffect, useState } from 'react';
import { useEventStore } from '@/store/useEventStore';
import TotalScoreBoard from './TotalScoreBoard';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import MarqueeBanner from './MarqueeBanner';

const PreparationView = () => {
  const events = useEventStore((s) => s.events);
  const isMobile = useIsMobile();
  const [scale, setScale] = useState(1);
  const [time, setTime] = useState(new Date());

  const getNextEvent = () => {
    const currentTotalMinutes = time.getHours() * 60 + time.getMinutes();
    const getMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const inProgressIdx = events.findIndex(e => e.status === 'IN_PROGRESS');
    if (inProgressIdx !== -1 && inProgressIdx < events.length - 1) {
      return events[inProgressIdx + 1];
    }

    return events.find(e => e.status === 'UPCOMING' && getMinutes(e.time) >= currentTotalMinutes)
      || events.find(e => e.status === 'UPCOMING')
      || events.find(e => e.status === 'IN_PROGRESS');
  };

  const nextEvent = getNextEvent();

  useEffect(() => {
    const handleResize = () => {
      const baseWidth = isMobile ? 1080 : 1920;
      const baseHeight = isMobile ? 1920 : 1080;
      const scaleW = window.innerWidth / baseWidth;
      const scaleH = window.innerHeight / baseHeight;
      setScale(Math.min(scaleW, scaleH));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  if (!nextEvent) {
    return (
      <div className="fixed inset-0 z-40 bg-[#0a0a0a] flex items-center justify-center animate-in fade-in duration-500">
        <p className={`font-sans ${isMobile ? 'text-2xl px-6 text-center' : 'text-5xl'} text-white uppercase font-black`}>
          더 이상 진행할 종목이 없습니다 🎉
        </p>
      </div>
    );
  }

  const arrowTransitions = [0, 0.4, 0.8];

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-40 bg-[#F4F4F4] flex flex-col items-stretch animate-in fade-in duration-500 overflow-y-auto">
        <img
          src="/assets/background/준비화면.svg"
          className="fixed inset-0 w-full h-full object-cover -z-10 opacity-30"
          alt=""
        />

        <div className="shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <TotalScoreBoard />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-16">
          <div className="space-y-4 text-center">
            <p className="text-xl font-black text-blue-600 uppercase tracking-[0.2em]">Next Event</p>
            <h2 className="text-6xl font-black text-black leading-tight tracking-tighter break-keep">
              {nextEvent.name}
            </h2>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-9xl font-black text-[#ff40c2] tabular-nums tracking-tighter">
              {hours}:{minutes}
            </div>
            <div className="text-4xl font-bold text-[#ff40c2]/60 tabular-nums">
              {seconds}
            </div>
          </div>

          <div className="flex items-center gap-8">
            {arrowTransitions.map((delay, i) => (
              <motion.div
                key={i}
                className="w-16 h-16"
                initial={{ opacity: 0, x: -20, rotate: 90 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: [-20, 0, 0, 20],
                  rotate: 90,
                }}
                transition={{
                  duration: 2,
                  times: [0, 0.1, 0.9, 1],
                  repeat: Infinity,
                  repeatDelay: 1,
                  delay: delay
                }}
              >
                <img src="/assets/match-arrow.svg" className="w-full h-full" alt="" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="h-24 shrink-0">
          <MarqueeBanner />
        </div>
      </div>
    );
  }

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
        <img src="/assets/background/준비화면.svg" className="absolute inset-0 w-full h-full object-cover -z-10" alt="" />

        <TotalScoreBoard />

        <div className="absolute top-[120px] left-0 w-[916px] h-[861px] flex items-center justify-center">
          <p className="font-sans font-extrabold leading-tight text-black text-center whitespace-normal m-0 tracking-tight break-keep text-[205.4px] px-[71.3px]">
            {nextEvent.name}
          </p>
        </div>

        <div className="absolute top-[120px] left-[917px] w-[1003px] h-[535px] flex items-center justify-center">
          <div className="font-sans leading-[0.9] text-[#ff40c2] m-0 flex flex-col text-right pr-[120px] tabular-nums gap-0 z-10 font-black text-[170px]">
            <span>{hours}</span>
            <span>{minutes}</span>
            <span>{seconds}</span>
          </div>
        </div>

        <div className="absolute top-[656px] left-0 w-[1046px] h-[325px] flex items-center gap-[100px] px-[150px]">
          {arrowTransitions.map((delay, i) => (
            <motion.div
              key={i}
              className="w-[175px] h-[175px]"
              initial={{ opacity: 0, x: -60, rotate: 90 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [-60, 0, 0, 60],
                rotate: 90,
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
              <img src="/assets/match-arrow.svg" className="w-full h-full" alt="" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreparationView;
