import { useEffect, useRef } from 'react';
import { useEventStore } from '@/store/useEventStore';
import confetti from 'canvas-confetti';
import RouletteNumber from './RouletteNumber';
import { motion } from 'framer-motion';

const TotalScoreBoard = () => {
  const events = useEventStore((s) => s.events);
  const bonusScoreA = useEventStore((s) => s.bonusScoreA);
  const bonusScoreB = useEventStore((s) => s.bonusScoreB);

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
  // Clamp ratio to keep the divider visible and within reasonable bounds
  const ratio = Math.max(0.1, Math.min(0.9, rawRatio));
  const widthA = ratio * 1920;

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
    <div className="w-full flex justify-center bg-transparent z-10 absolute top-0 left-0 pointer-events-none">
      <div className="content-stretch flex items-center relative w-[1920px] shrink-0 h-[120px] bg-transparent overflow-hidden">

        {/* Team A Bar (Blue) */}
        <motion.div
          animate={{ width: widthA }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="h-[120px] relative shrink-0 overflow-hidden"
          style={{ backgroundColor: BLUE }}
        >
          {/* Left Score (White on Blue) */}
          <div className="absolute font-['USN_Stencil'] leading-[normal] left-[45px] text-[120px] text-white top-[-10px] whitespace-nowrap m-0 tracking-tighter z-20">
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
          </div>
        </motion.div>

        {/* Team B Bar (White) */}
        <motion.div
          animate={{ width: 1920 - widthA }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="h-[120px] relative shrink-0 overflow-hidden"
          style={{ backgroundColor: WHITE }}
        >
          {/* Right Score (Black on White) */}
          <div className="absolute font-['USN_Stencil'] leading-[normal] right-[45px] text-black text-[120px] top-[-10px] whitespace-nowrap m-0 text-right tracking-tighter z-20">
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
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default TotalScoreBoard;
