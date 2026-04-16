import { useEffect, useState } from 'react';
import { useEventStore } from '@/store/useEventStore';
import TotalScoreBoard from './TotalScoreBoard';

const PreparationView = () => {
  const events = useEventStore((s) => s.events);
  const nextEvent = events.find((e) => e.status === 'UPCOMING') || events.find((e) => e.status === 'IN_PROGRESS');

  const [scale, setScale] = useState(1);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleResize = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
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
        <p className="font-sans text-5xl text-white">더 이상 진행할 종목이 없습니다 🎉</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-[#F4F4F4] overflow-hidden flex items-start justify-center animate-in fade-in duration-500">
      <div
        className="relative w-[1920px] h-[1080px] shrink-0"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top' }}
      >
        <img src="/assets/background/준비화면.svg" className="absolute inset-0 w-full h-full object-cover -z-10" alt="" />

        <TotalScoreBoard />

        {/* Content Box (Left) */}
        <div className="absolute top-[120px] left-0 w-[916px] h-[861px]">
          <p className="absolute font-sans font-extrabold leading-tight left-[71.3px] text-[205.4px] text-black top-[220px] whitespace-nowrap m-0 tracking-tighter w-[800px] break-keep">
            {nextEvent.name}
          </p>
        </div>

        {/* Content Box (Right Top) */}
        <div className="absolute top-[120px] left-[917px] w-[1003px] h-[535px]">
          {/* Blackout rect hiding baked-in SVG clock numbers ensuring clean dynamic text rendering */}
          <div className="absolute right-[0px] top-[60px] w-[400px] h-[440px] z-0" />

          <div className="absolute font-sans leading-[1] right-[128.3px] text-[#ff40c2] text-[170px] text-right top-[5px] m-0 flex flex-col tracking-normal tabular-nums gap-0 z-10">
            <span>{hours}</span>
            <span>{minutes}</span>
            <span>{seconds}</span>
          </div>
        </div>

        {/* Content Box (Left Bottom) */}
        <div className="absolute top-[656px] left-0 w-[1046px] h-[325px] overflow-hidden" />

        {/* Content Box (Right Bottom) */}
        <div className="absolute top-[656px] left-[1047px] w-[873px] h-[325px] overflow-hidden" />

      </div>
    </div>
  );
};

export default PreparationView;
