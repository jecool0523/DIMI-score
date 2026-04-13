import { useEffect, useState, useRef } from 'react';
import { useEventStore } from '@/store/useEventStore';
import confetti from 'canvas-confetti';
import TotalScoreBoard from './TotalScoreBoard';
import RouletteNumber from './RouletteNumber';

const InProgressView = () => {
  const events = useEventStore((s) => s.events);
  const current = events.find((e) => e.status === 'IN_PROGRESS');

  const [scale, setScale] = useState(1);
  const [time, setTime] = useState(new Date());

  const prevScoreARef = useRef(current?.scoreA);
  const prevScoreBRef = useRef(current?.scoreB);

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
        <p className="font-display text-5xl text-white">현재 진행 중인 종목이 없습니다</p>
      </div>
    );
  }

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="fixed inset-0 z-40 bg-[#111] overflow-hidden flex items-center justify-center animate-in fade-in duration-500">
      <div
        className="relative w-[1920px] h-[1080px] shrink-0"
        style={{ transform: `scale(${scale})` }}
      >
        <img src="/assets/background/종목화면-배경.svg" className="absolute inset-0 w-full h-full object-cover -z-10" alt="" />

        <TotalScoreBoard />

        {/* Title Row */}
        <div className="absolute top-[192px] w-[1920px] flex items-center justify-center gap-[127px]">
          <div className="font-['Pretendard'] font-extrabold text-[130px] text-white whitespace-nowrap m-0 tracking-tight">
            {current.name}
          </div>
          <div className="w-[480px] flex justify-between items-center bg-transparent opacity-0">
            {/* Invisible spacer since arrows and logos are inside background image now! */}
          </div>
          <div className="font-[USN_Stencil] text-[152.68px] text-white whitespace-nowrap m-0 tabular-nums font-[400] leading-none mb-4">
            {hours}:{minutes}:{seconds}
          </div>
        </div>

        {/* Main Center Area */}
        <div className="absolute top-[412.37px] left-0 w-[1920px] overflow-hidden flex items-center justify-between">
          <div className="flex flex-[1_0_0] items-center justify-center gap-[301px] px-[280px]">
            <div className="w-[235px] h-[313px] flex items-center justify-center pt-[50px]">
              <span className="font-display text-[300px] text-white tabular-nums drop-shadow-md pb-[70px]">
                <RouletteNumber value={current.scoreA.toString()} />
              </span>
            </div>

            <div className="h-[399px] w-[58px] bg-transparent" />

            <div className="w-[235px] h-[313px] flex items-center justify-center pt-[50px]">
              <span className="font-display text-[300px] text-white tabular-nums drop-shadow-md pb-[70px]">
                <RouletteNumber value={current.scoreB.toString()} />
              </span>
            </div>
          </div>
        </div>

        {/* Footer Text Only */}
        <div className="absolute flex flex-col h-[99px] items-center left-0 overflow-clip top-[981px] w-[1920px] bg-transparent">
          <div className="flex flex-[1_0_0] items-center justify-center px-[30px] w-full text-white text-[52px] font-['Pretendard'] font-medium">
            <div className="flex items-center justify-center w-[1860px]">
              <p className="m-0 tracking-tight text-center">대충 중요한 공지사항입니다! 공지사항을 보는 것은 중요합니다.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InProgressView;
