import { useEffect, useState } from 'react';
import { useEventStore } from '@/store/useEventStore';
import TotalScoreBoard from './TotalScoreBoard';
import { motion } from 'framer-motion';

const PreparationView = () => {
  const events = useEventStore((s) => s.events);
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

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  if (!nextEvent) {
    return (
      <div className="fixed inset-0 z-40 bg-[#0a0a0a] flex items-center justify-center animate-in fade-in duration-500">
        <p className="font-sans text-5xl text-white uppercase font-black">
          더 이상 진행할 종목이 없습니다 🎉
        </p>
      </div>
    );
  }

  const arrowTransitions = [0, 0.4, 0.8];

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

        <div className="absolute top-[120px] left-0 w-[916px] h-[861px]">
          <p className="absolute font-sans font-extrabold leading-tight text-black whitespace-normal m-0 tracking-tight break-keep text-[205.4px] left-[71.3px] top-[180px] w-[800px]">
            {nextEvent.name}
          </p>
        </div>

        <div className="absolute top-[120px] left-[917px] w-[1003px] h-[535px]">
          <div className="absolute font-sans leading-[0.9] text-[#ff40c2] m-0 flex flex-col text-right tabular-nums gap-0 z-10 font-black text-[170px] right-[60px] top-[80px]">
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
