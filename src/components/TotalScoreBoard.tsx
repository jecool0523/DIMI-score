import { useEffect, useRef } from 'react';
import { useEventStore } from '@/store/useEventStore';
import confetti from 'canvas-confetti';
import RouletteNumber from './RouletteNumber';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const TotalScoreBoard = () => {
  const events = useEventStore((s) => s.events);
  const bonusScoreA = useEventStore((s) => s.bonusScoreA);
  const bonusScoreB = useEventStore((s) => s.bonusScoreB);
  const isMobile = useIsMobile();

  let totalA = bonusScoreA;
  let totalB = bonusScoreB;
  events.forEach((e) => {
    if (e.teamA && e.teamB) {
      totalA += e.scoreA;
      totalB += e.scoreB;
    }
  });

  const sum = totalA + totalB;
  const rawRatio = sum === 0 ? 0.5 : totalA / sum;
  const ratio = Math.max(0.1, Math.min(0.9, rawRatio));

  const baseWidth = isMobile ? 1080 : 1920;
  const widthA = ratio * baseWidth;

  const prevTotalARef = useRef(totalA);
  const prevTotalBRef = useRef(totalB);

  useEffect(() => {
    if (prevTotalARef.current !== undefined && totalA > prevTotalARef.current) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { x: 0, y: 0.5 },
        angle: 45,
        colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#ffffff']
      });
    }
    prevTotalARef.current = totalA;
  }, [totalA]);

  useEffect(() => {
    if (prevTotalBRef.current !== undefined && totalB > prevTotalBRef.current) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { x: 1, y: 0.5 },
        angle: 135,
        colors: ['#ffffff', '#f8fafc', '#e2e8f0', '#94a3b8']
      });
    }
    prevTotalBRef.current = totalB;
  }, [totalB]);

  const BLUE = "#0081ff";
  const WHITE = "#ffffff";

  return (
    <div className="w-full bg-transparent z-10 pointer-events-none">
      <div className={`flex items-center relative w-full overflow-hidden ${isMobile ? 'h-[160px]' : 'h-[120px]'}`}>
        {/* Team A Bar (Blue) */}
        <motion.div
          animate={{ flexBasis: `${ratio * 100}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="h-full relative shrink-0 overflow-hidden flex items-center"
          style={{ backgroundColor: BLUE }}
        >
          {/* Left Score */}
          <div className={`font-sans leading-none font-black text-white whitespace-nowrap m-0 tracking-tighter z-20 pl-[45px] ${isMobile ? 'text-[80px]' : 'text-[120px] mt-[-23px]'}`}>
            <RouletteNumber value={`${totalA.toLocaleString()}P`} />
          </div>

          {/* Pixel Divider Blocks (White part) */}
          <div className="absolute right-0 top-0 h-full w-[60px] pointer-events-none">
            <div className="absolute bg-white right-0 size-[20px] top-0" />
            <div className="absolute bg-white right-0 size-[20px] top-[20px]" />
            <div className="absolute bg-white right-[20px] size-[20px] top-[20px]" />
            <div className="absolute bg-white right-[20px] size-[20px] top-[60px]" />
            <div className="absolute bg-white right-0 size-[20px] top-[60px]" />
            <div className="absolute bg-white right-0 size-[20px] top-[100px]" />
            {isMobile && <div className="absolute bg-white right-0 size-[20px] top-[140px]" />}
          </div>
        </motion.div>

        {/* Team B Bar (White) */}
        <motion.div
          animate={{ flexBasis: `${(1 - ratio) * 100}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="h-full relative shrink-0 overflow-hidden flex items-center justify-end"
          style={{ backgroundColor: WHITE }}
        >
          {/* Right Score */}
          <div className={`font-sans leading-none font-black text-[#0081ff] whitespace-nowrap m-0 text-right tracking-tighter z-20 pr-[45px] ${isMobile ? 'text-[80px]' : 'text-[120px] mt-[-23px]'}`}>
            <RouletteNumber value={`${totalB.toLocaleString()}P`} />
          </div>

          {/* Pixel Divider Blocks (Blue part) */}
          <div className="absolute left-0 top-0 h-full w-[80px] pointer-events-none">
            <div className="absolute bg-[#0081ff] left-0 size-[20px] top-0" />
            <div className="absolute bg-[#0081ff] left-0 size-[20px] top-[40px]" />
            <div className="absolute bg-[#0081ff] left-0 size-[20px] top-[60px]" />
            <div className="absolute bg-[#0081ff] left-0 size-[20px] top-[100px]" />
            <div className="absolute bg-[#0081ff] left-[20px] size-[20px] top-0" />
            <div className="absolute bg-[#0081ff] left-[20px] size-[20px] top-[40px]" />
            <div className="absolute bg-[#0081ff] left-[40px] size-[20px] top-[20px]" />
            <div className="absolute bg-[#0081ff] left-[40px] size-[20px] top-[60px]" />
            <div className="absolute bg-[#0081ff] left-[40px] size-[20px] top-[80px]" />
            <div className="absolute bg-[#0081ff] left-[20px] size-[20px] top-[80px]" />
            {isMobile && <div className="absolute bg-[#0081ff] left-0 size-[20px] top-[140px]" />}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TotalScoreBoard;
