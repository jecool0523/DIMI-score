import { useEffect, useRef } from 'react';
import { useEventStore } from '@/store/useEventStore';
import confetti from 'canvas-confetti';
import RouletteNumber from './RouletteNumber';

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
    <div className="w-full flex justify-center bg-transparent z-10 absolute top-0 left-0 pointer-events-none">
      <div className="content-stretch flex items-center relative w-[1920px] shrink-0 h-[120px] bg-transparent">
        <div className="h-[120px] relative shrink-0 w-[1014px] bg-transparent">
          <div className="absolute font-['Pretendard'] font-bold leading-[normal] left-[40px] text-[110px] text-white top-[-5px] whitespace-nowrap m-0">
            <RouletteNumber value={`${totalA.toLocaleString()}P`} />
          </div>
        </div>
        <div className="h-[120px] relative shrink-0 w-[906px] bg-transparent">
          <div className="absolute font-['Pretendard'] font-bold leading-[normal] right-[40px] text-[#04f] text-[110px] top-[-5px] whitespace-nowrap m-0 text-right">
            <RouletteNumber value={`${totalB.toLocaleString()}P`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalScoreBoard;
