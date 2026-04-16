import { useEffect, useState, useRef } from 'react';
import { useEventStore } from '@/store/useEventStore';
import confetti from 'canvas-confetti';
import TotalScoreBoard from './TotalScoreBoard';
import RouletteNumber from './RouletteNumber';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import MarqueeBanner from './MarqueeBanner';

const InProgressView = () => {
  const events = useEventStore((s) => s.events);
  const current = events.find((e) => e.status === 'IN_PROGRESS');
  const isMobile = useIsMobile();

  const [scale, setScale] = useState(1);
  const [time, setTime] = useState(new Date());

  const prevScoreARef = useRef(current?.scoreA);
  const prevScoreBRef = useRef(current?.scoreB);

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

  useEffect(() => {
    if (current?.scoreA !== undefined && prevScoreARef.current !== undefined) {
      if (current.scoreA > prevScoreARef.current) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { x: 0, y: 0.5 },
          angle: 45,
          colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#ffffff']
        });
      }
    }
    prevScoreARef.current = current?.scoreA;
  }, [current?.scoreA]);

  useEffect(() => {
    if (current?.scoreB !== undefined && prevScoreBRef.current !== undefined) {
      if (current.scoreB > prevScoreBRef.current) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { x: 1, y: 0.5 },
          angle: 135,
          colors: ['#ffffff', '#f8fafc', '#e2e8f0', '#94a3b8']
        });
      }
    }
    prevScoreBRef.current = current?.scoreB;
  }, [current?.scoreB]);

  if (!current) {
    return (
      <div className="fixed inset-0 z-40 bg-[#111] flex items-center justify-center animate-in fade-in duration-500">
        <p className={`font-sans ${isMobile ? 'text-2xl px-6 text-center' : 'text-5xl'} text-white uppercase font-black`}>
          현재 진행 중인 종목이 없습니다
        </p>
      </div>
    );
  }

  // Countdown Calculation
  const getRemainingTimeMs = () => {
    if (!current) return 0;
    const currentIndex = events.findIndex(e => e.id === current.id);
    const nextEvent = events[currentIndex + 1];
    let durationInMinutes = 40;

    if (nextEvent) {
      const getMinutes = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      };
      durationInMinutes = getMinutes(nextEvent.time) - getMinutes(current.time);
      if (durationInMinutes <= 0) durationInMinutes = 40;
    }

    const durationMs = durationInMinutes * 60 * 1000;
    let elapsedMs = 0;

    if (current.actualStartTime) {
      elapsedMs = time.getTime() - current.actualStartTime;
    } else {
      const now = time;
      const [h, m] = current.time.split(':').map(Number);
      const scheduledDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
      elapsedMs = now.getTime() - scheduledDate.getTime();
    }

    return Math.max(durationMs - elapsedMs, 0);
  };

  const remainingMs = getRemainingTimeMs();
  const totalSeconds = Math.floor(remainingMs / 1000);
  const remMinutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const remSeconds = (totalSeconds % 60).toString().padStart(2, '0');

  const secondsLeft = Math.ceil(remainingMs / 1000);
  const showOverlay = remainingMs > 0 && remainingMs <= 10000;

  // Progress Calculation
  const getProgress = () => {
    if (!current) return 0;
    const currentIndex = events.findIndex(e => e.id === current.id);
    const nextEvent = events[currentIndex + 1];
    let durationInMinutes = 40;
    if (nextEvent) {
      const getMinutes = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      };
      durationInMinutes = getMinutes(nextEvent.time) - getMinutes(current.time);
      if (durationInMinutes <= 0) durationInMinutes = 40;
    }
    const durationMs = durationInMinutes * 60 * 1000;
    let elapsedMs = 0;
    if (current.actualStartTime) {
      elapsedMs = time.getTime() - current.actualStartTime;
    } else {
      const now = time;
      const [h, m] = current.time.split(':').map(Number);
      const scheduledDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
      elapsedMs = now.getTime() - scheduledDate.getTime();
    }
    return Math.min(Math.max(elapsedMs / durationMs, 0), 1);
  };

  const progress = getProgress();
  const baseWidth = isMobile ? 1080 : 1920;
  const progressWidth = baseWidth * progress;

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-40 bg-[#F4F4F4] flex flex-col items-stretch animate-in fade-in duration-500 overflow-y-auto">
        <img
          src="/assets/background/종목화면.svg"
          className="fixed inset-0 w-full h-full object-cover -z-10 opacity-30"
          alt=""
        />

        <div className="shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <TotalScoreBoard />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-12 py-10 px-6">
          <div className="text-center space-y-2">
            <h2 className="text-5xl font-black text-black tracking-tight">{current.name}</h2>
            <div className="text-3xl font-medium text-gray-600 tabular-nums">
              {remMinutes}:{remSeconds}
            </div>
          </div>

          <div className="w-full space-y-8">
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white shadow-xl text-center">
                <p className="text-sm font-black text-blue-600 mb-2 uppercase tracking-widest">TEAM A</p>
                <div className="text-8xl font-black text-black">
                  <RouletteNumber value={current.scoreA.toString()} />
                </div>
              </div>
              <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white shadow-xl text-center">
                <p className="text-sm font-black text-[#ff40c2] mb-2 uppercase tracking-widest">TEAM B</p>
                <div className="text-8xl font-black text-black">
                  <RouletteNumber value={current.scoreB.toString()} />
                </div>
              </div>
            </div>

            <div className="px-2 space-y-3">
              <div className="flex justify-between text-xs font-black text-gray-500 uppercase tracking-tighter">
                <span>Progress</span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  className="h-full bg-gradient-to-r from-blue-500 to-[#ff40c2] shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-[80px] shrink-0">
          <MarqueeBanner />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-[#F4F4F4] flex items-start justify-center animate-in fade-in duration-500 overflow-hidden">
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
          src="/assets/background/종목화면.svg"
          className="absolute inset-0 w-full h-full object-cover -z-10"
          alt=""
        />

        <TotalScoreBoard />

        <div className="absolute top-[200px] left-0 w-[1920px] h-[100px] flex items-center z-30">
          <div className="flex-1 flex justify-center">
            <div className="font-sans font-extrabold text-[130px] text-black whitespace-nowrap m-0 tracking-tight">
              {current.name}
            </div>
          </div>

          <div className="relative w-[480px] h-[100px] flex items-center justify-center shrink-0">
            <div className="w-[480px] flex items-center justify-center relative h-full">
              <motion.div
                className="absolute left-0 w-[100px] h-[100px] pt-[10px]"
                initial={{ opacity: 0, x: 60, rotate: -90 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: [60, 0, 0, -60],
                  rotate: -90,
                }}
                transition={{
                  duration: 4,
                  times: [0, 0.1, 0.8, 1],
                  ease: ["easeOut", "linear", "easeIn"],
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
              >
                <img src="/assets/match-arrow.svg" className="w-full h-full" alt="" />
              </motion.div>

              <div className="w-[143px] h-[81px]">
                <img src="/assets/match-loop.svg" className="w-full h-full" alt="" />
              </div>

              <motion.div
                className="absolute right-0 w-[100px] h-[100px] pt-[10px]"
                initial={{ opacity: 0, x: -60, rotate: 90 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: [-60, 0, 0, 60],
                  rotate: 90,
                }}
                transition={{
                  duration: 4,
                  times: [0, 0.1, 0.8, 1],
                  ease: ["easeOut", "linear", "easeIn"],
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
              >
                <img src="/assets/match-arrow.svg" className="w-full h-full" alt="" />
              </motion.div>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="font-sans text-[152.68px] text-black whitespace-nowrap m-0 tabular-nums font-[400] leading-none text-center">
              {remMinutes}:{remSeconds}
            </div>
          </div>
        </div>

        <div className="absolute top-[386px] left-0 w-[1920px] h-[25px] z-20">
          <div
            className="h-full bg-[#FF5297] transition-all duration-1000 ease-linear"
            style={{ width: `${progressWidth}px` }}
          />
        </div>

        <div className="absolute top-[470px] left-0 w-[1920px] overflow-hidden flex items-center justify-between">
          <div className="flex flex-[1_0_0] items-center justify-center gap-[632px] px-[280px]">
            <div className="w-[300px] h-[450px] flex items-center justify-center pt-[20px]">
              <span className="font-sans text-[500px] text-black tabular-nums drop-shadow-md pb-[40px]">
                <RouletteNumber value={current.scoreA.toString()} />
              </span>
            </div>

            <div className="w-[300px] h-[450px] flex items-center justify-center pt-[20px]">
              <span className="font-sans text-[500px] text-black tabular-nums drop-shadow-md pb-[40px]">
                <RouletteNumber value={current.scoreB.toString()} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            key={secondsLeft}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div
              className="text-[#FF40C2] font-['USN_Stencil'] leading-none text-center select-none"
              style={{
                fontSize: isMobile ? '400px' : '600px',
                textShadow: '0 0 40px rgba(255, 64, 194, 0.8), 0 0 80px rgba(255, 64, 194, 0.4)',
              }}
            >
              {secondsLeft}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InProgressView;
