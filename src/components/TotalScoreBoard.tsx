import { useEffect, useState } from 'react';
import { useEventStore } from '@/store/useEventStore';

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

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      // Scale based on the width of the screen, assuming 1920 is the base width. 
      // If we are on a smaller screen, it will scale down to fit nicely.
      // Maximum scale is 1.
      setScale(Math.min(window.innerWidth / 1920, 1));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full flex justify-center mb-8 bg-transparent overflow-hidden">
      <div
        className="content-stretch flex items-center relative w-[1920px] shrink-0 h-[120px]"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
      >
        <div className="bg-[#04f] h-[120px] overflow-clip relative shrink-0 w-[1014px]">
          <div className="absolute bg-white left-[994px] size-[20px] top-0" />
          <div className="absolute bg-white left-[994px] size-[20px] top-[20px]" />
          <div className="absolute bg-white left-[974px] size-[20px] top-[20px]" />
          <div className="absolute bg-white left-[974px] size-[20px] top-[60px]" />
          <div className="absolute bg-white left-[994px] size-[20px] top-[60px]" />
          <p className="absolute font-display font-bold leading-[normal] left-[40px] text-[110px] text-white top-[-5px] whitespace-nowrap m-0">
            {totalA.toLocaleString()}P
          </p>
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
          <p className="absolute font-display font-bold leading-[normal] right-[40px] text-[#04f] text-[110px] top-[-5px] whitespace-nowrap m-0 text-right">
            {totalB.toLocaleString()}P
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalScoreBoard;
