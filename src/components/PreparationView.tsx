import { useEffect, useState } from 'react';
import { useEventStore } from '@/store/useEventStore';
import TotalScoreBoard from './TotalScoreBoard';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const PreparationView = () => {
  const events = useEventStore((s) => s.events);
  const nextEvent = events.find((e) => e.status === 'UPCOMING') || events.find((e) => e.status === 'IN_PROGRESS');
  const isMobile = useIsMobile();

  const [scale, setScale] = useState(1);
  const [time, setTime] = useState(new Date());

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

  return (
    <div className="fixed inset-0 z-40 bg-[#F4F4F4] overflow-hidden flex items-start justify-center animate-in fade-in duration-500">
      <div
        className="relative shrink-0"
        style={{
          width: isMobile ? '1080px' : '1920px',
          height: isMobile ? '1920px' : '1080px',
          transform: `scale(${scale})`,
          transformOrigin: 'top'
        }}
      >
        <img src="/assets/background/준비화면.svg" className="absolute inset-0 w-full h-full object-cover -z-10" alt="" />

        <TotalScoreBoard />

        {/* Content Box (Left/Top) */}
        <div className={`absolute left-0 w-full flex items-center justify-center ${isMobile ? 'top-[420px] h-[500px]' : 'top-[120px] w-[916px] h-[861px]'}`}>
          <p className={`font-sans font-extrabold leading-tight text-black text-center whitespace-normal m-0 tracking-tight break-keep ${isMobile ? 'text-[180px]' : 'text-[205.4px] px-[71.3px]'}`}>
            {nextEvent.name}
          </p>
        </div>

        {/* Content Box (Right/Center Clock) */}
        <div className={`absolute flex items-center justify-center ${isMobile ? 'top-[950px] left-0 w-full h-[300px]' : 'top-[120px] left-[917px] w-[1003px] h-[535px]'}`}>
          <div className={`font-sans leading-[0.9] text-[#ff40c2] m-0 flex tabular-nums gap-4 z-10 font-black ${isMobile ? 'text-[240px] flex-row' : 'text-[170px] flex-col text-right pr-[120px]'}`}>
            <span>{hours}{isMobile ? ':' : ''}</span>
            <span>{minutes}{isMobile ? ':' : ''}</span>
            <span>{seconds}</span>
          </div>
        </div>

        {/* Content Box (Bottom Arrows) */}
        <div className={`absolute flex items-center justify-center gap-[100px] ${isMobile ? 'top-[1300px] left-0 w-full h-[400px]' : 'top-[656px] left-0 w-[1046px] h-[325px] px-[150px]'}`}>
          {arrowTransitions.map((delay, i) => (
            <motion.div
              key={i}
              className={`${isMobile ? 'w-[250px] h-[250px]' : 'w-[175px] h-[175px]'}`}
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
