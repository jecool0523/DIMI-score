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
        <p className="font-display text-5xl text-white">더 이상 진행할 종목이 없습니다 🎉</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-[#0a0a0a] overflow-hidden flex items-center justify-center animate-in fade-in duration-500">
      <div
        className="relative w-[1920px] h-[1080px] shrink-0"
        style={{ transform: `scale(${scale})` }}
      >
        <img src="/assets/background/준비화면-배경.svg" className="absolute inset-0 w-full h-full object-cover -z-10" alt="" />

        <TotalScoreBoard />

        {/* Content Box (Left) */}
        <div className="absolute top-[120px] left-0 w-[916px] h-[861px]">
          <p className="absolute font-['Pretendard'] font-bold leading-normal left-[94.6px] text-[93.3px] text-white top-[219.4px] whitespace-nowrap m-0 tracking-tight">
            다음 종목
          </p>
          <p className="absolute font-['Pretendard'] font-extrabold leading-tight left-[71.3px] text-[205.4px] text-white top-[362.1px] whitespace-nowrap m-0 tracking-tighter w-[800px] break-keep">
            {nextEvent.name}
          </p>
        </div>

        {/* Content Box (Right Top) */}
        <div className="absolute top-[120px] left-[917px] w-[1003px] h-[535px]">
          <div className="absolute font-display leading-[1] left-[87.3px] text-[#ff40c2] text-[130.8px] top-[217.9px] uppercase select-none m-0 flex flex-col tracking-widest gap-0">
            <span>DIMIGO</span>
            <span>SPORTS</span>
            <span>DAY</span>
          </div>

          <div className="absolute font-display leading-[1] right-[128.3px] text-[#ff40c2] text-[171.6px] text-right top-[164.4px] m-0 flex flex-col tracking-widest tabular-nums gap-0">
            <span>{hours}</span>
            <span>{minutes}</span>
            <span>{seconds}</span>
          </div>
        </div>

        {/* Content Box (Left Bottom) */}
        <div className="absolute top-[656px] left-0 w-[1046px] h-[325px] overflow-hidden">
          {/* Pink Arrows */}
          <div className="absolute top-[80px] left-[190px] right-0 flex gap-20">
            <div className="w-[124px] h-[124px] animate-pulse">
              <img src="/assets/arrow-right-pink.svg" className="w-full h-full" alt="" />
            </div>
            <div className="w-[124px] h-[124px] animate-pulse delay-100">
              <img src="/assets/arrow-right-pink.svg" className="w-full h-full" alt="" />
            </div>
            <div className="w-[124px] h-[124px] animate-pulse delay-200">
              <img src="/assets/arrow-right-pink.svg" className="w-full h-full" alt="" />
            </div>
          </div>
        </div>

        {/* Content Box (Right Bottom) */}
        <div className="absolute top-[656px] left-[1047px] w-[873px] h-[325px] overflow-hidden">
          <div className="absolute font-['Pretendard'] font-bold leading-tight left-[154px] text-[80px] text-white top-[82px] m-0 tracking-tight flex flex-col">
            <span>선수분들은 준비해</span>
            <span>주시길 바랍니다.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PreparationView;
