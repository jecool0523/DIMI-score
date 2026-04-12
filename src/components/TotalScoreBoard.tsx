import { useEffect, useRef } from 'react';
import { useEventStore } from '@/store/useEventStore';
import confetti from 'canvas-confetti';
import RouletteNumber from './RouletteNumber';

const TotalScoreBoard = () => {
  const events = useEventStore((s) => s.events);

  let totalA = 0;
  let totalB = 0;
  events.forEach((e) => {
    if (e.teamA && e.teamB) {
      totalA += e.scoreA;
      totalB += e.scoreB;
    }
  });

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

  return (
    <div className="w-full flex justify-center mb-8 bg-transparent overflow-hidden">
      <div className="content-stretch flex items-center relative w-[1920px] shrink-0 h-[120px]">
        <div className="bg-[#04f] h-[120px] overflow-clip relative shrink-0 w-[1014px]">
          <div className="absolute bg-white left-[994px] size-[20px] top-0" />
          <div className="absolute bg-white left-[994px] size-[20px] top-[20px]" />
          <div className="absolute bg-white left-[974px] size-[20px] top-[20px]" />
          <div className="absolute bg-white left-[974px] size-[20px] top-[60px]" />
          <div className="absolute bg-white left-[994px] size-[20px] top-[60px]" />
          <div className="absolute font-display font-bold leading-[normal] left-[40px] text-[110px] text-white top-[-5px] whitespace-nowrap m-0">
            <RouletteNumber value={`${totalA.toLocaleString()}P`} />
          </div>
          <div className="absolute bg-white left-[994px] size-[20px] top-[100px]" />
          <div className="absolute bg-[#04f] left-[994px] size-[20px] top-[20px]" />
        </div>
        <div className="bg-white h-[120px] overflow-clip relative shrink-0 w-[906px]">
          <div className="absolute bg-[#04f] left-0 size-[20px] top-0" />
          <div className="absolute bg-white left-0 size-[20px] top-[20px]" />
          <div className="absolute bg-[#04f] left-0 size-[20px] top-[40px]" />
          <div className="absolute bg-[#04f] left-0 size-[20px] top-[60px]" />
          <div className="absolute bg-white left-0 size-[20px] top-[80px]" />
          <div className="absolute bg-[#04f] left-[20px] size-[20px] top-[80px]" />
          <div className="absolute bg-[#04f] left-[40px] size-[20px] top-[80px]" />
          <div className="absolute bg-[#04f] left-[40px] size-[20px] top-[60px]" />
          <div className="absolute bg-[#04f] left-[20px] size-[20px] top-[40px]" />
          <div className="absolute bg-[#04f] left-[40px] size-[20px] top-[20px]" />
          <div className="absolute bg-[#04f] left-[20px] size-[20px] top-0" />
          <div className="absolute bg-[#04f] left-0 size-[20px] top-[100px]" />
          <div className="absolute font-display font-bold leading-[normal] right-[40px] text-[#04f] text-[110px] top-[-5px] whitespace-nowrap m-0 text-right">
            <RouletteNumber value={`${totalB.toLocaleString()}P`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalScoreBoard;
