import { useEffect, useState, useRef } from 'react';
import { useEventStore } from '@/store/useEventStore';
import confetti from 'canvas-confetti';
import TotalScoreBoard from './TotalScoreBoard';
import RouletteNumber from './RouletteNumber';
import { motion, AnimatePresence } from 'framer-motion';

const InProgressView = () => {
  const events = useEventStore((s) => s.events);
  const inProgressEvents = events.filter((e) => e.status === 'IN_PROGRESS');
  const current = inProgressEvents.find((e) => e.teamA && e.teamA.trim() !== '') ?? inProgressEvents[0];

  const [scale, setScale] = useState(1);
  const [time, setTime] = useState(new Date());
  const serverTimeOffset = useEventStore((s) => s.serverTimeOffset);

  const prevScoreARef = useRef(current?.scoreA);
  const prevScoreBRef = useRef(current?.scoreB);

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
    const timer = setInterval(() => setTime(new Date()), 100);
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
    return null;
  }

  // Countdown Calculation
  const getRemainingTimeMs = () => {
    if (!current) return 0;

    // Use setDuration (fallback to duration or 15m)
    const cdDurationMin = current.setDuration || current.duration || 15;
    const durationMs = cdDurationMin * 60 * 1000;

    // Determine the relevant start time for this countdown
    // Only start if explicitly triggered by setStartTime in Admin
    let startTimestamp = current.setStartTime;

    if (!startTimestamp) return 0;

    const currentTime = Date.now() + serverTimeOffset;
    const elapsedMs = currentTime - startTimestamp;
    return Math.max(0, durationMs - elapsedMs);
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
    if (current.duration) {
      durationInMinutes = current.duration;
    } else if (nextEvent) {
      const getMinutes = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      };
      durationInMinutes = getMinutes(nextEvent.time) - getMinutes(current.time);
      if (durationInMinutes <= 0) durationInMinutes = 40;
    }
    const durationMs = durationInMinutes * 60 * 1000;
    const currentTime = Date.now() + serverTimeOffset;
    let elapsedMs = 0;

    if (current.actualStartTime) {
      elapsedMs = currentTime - current.actualStartTime;
    } else {
      const [h, m] = current.time.split(':').map(Number);
      const scheduledDate = new Date();
      scheduledDate.setHours(h, m, 0, 0);
      elapsedMs = currentTime - scheduledDate.getTime();
    }
    return Math.min(Math.max(elapsedMs / durationMs, 0), 1);
  };

  const progress = getProgress();
  const baseWidth = 1920;
  const progressWidth = baseWidth * progress;

  return (
    <div className="w-full bg-[#F4F4F4] flex items-start justify-center animate-in fade-in duration-500 overflow-hidden">
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
            className="h-full bg-[#FF5297]"
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
                fontSize: '600px',
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
