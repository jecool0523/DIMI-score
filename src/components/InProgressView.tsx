import { useEffect, useState, useRef } from 'react';
import { useEventStore } from '@/store/useEventStore';
import confetti from 'canvas-confetti';
import TotalScoreBoard from './TotalScoreBoard';
import RouletteNumber from './RouletteNumber';

const bluePixels = [
  { x: 0, y: 306.47 }, { x: 38.31, y: 306.47 }, { x: 75.46, y: 306.47 },
  { x: 38.31, y: 114.93 }, { x: 0, y: 498.01 }, { x: 38.31, y: 498.01 }, { x: 75.46, y: 498.01 },
  { x: 0, y: 344.78 }, { x: 38.31, y: 344.78 }, { x: 0, y: 153.23 }, { x: 75.46, y: 153.23 },
  { x: 38.31, y: 536.32 }, { x: 75.46, y: 536.32 }, { x: 0, y: 0 }, { x: 75.46, y: 0 },
  { x: 0, y: 383.08 }, { x: 0, y: 191.54 }, { x: 38.31, y: 191.54 }, { x: 38.31, y: 38.31 },
  { x: 75.46, y: 38.31 }, { x: 0, y: 421.39 }, { x: 38.31, y: 421.39 }, { x: 75.46, y: 421.39 },
  { x: 0, y: 229.85 }, { x: 40, y: 268.16 }, { x: 0, y: 76.62 }, { x: 0, y: 38.31 },
  { x: 38.31, y: 459.7 }
];

const whitePixels = [
  { x: 75.46, y: 191.54 }, { x: 37.15, y: 191.54 }, { x: 0, y: 191.54 },
  { x: 37.15, y: 383.08 }, { x: 75.46, y: 0 }, { x: 37.15, y: 0 }, { x: 0, y: 0 },
  { x: 37.15, y: 536.32 }, { x: 75.46, y: 153.23 }, { x: 37.15, y: 153.23 },
  { x: 75.46, y: 344.78 }, { x: 0, y: 344.78 }, { x: 75.46, y: 498.01 }, { x: 0, y: 498.01 },
  { x: 75.46, y: 114.93 }, { x: 75.46, y: 306.47 }, { x: 37.15, y: 306.47 },
  { x: 37.15, y: 459.7 }, { x: 0, y: 459.7 }, { x: 75.46, y: 76.62 },
  { x: 37.15, y: 76.62 }, { x: 0, y: 76.62 }, { x: 75.46, y: 268.16 },
  { x: 35.46, y: 229.85 }, { x: 75.46, y: 421.39 }, { x: 75.46, y: 459.7 },
  { x: 37.15, y: 38.31 }
];

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
        <TotalScoreBoard />

        {/* Title Row */}
        <div className="absolute top-[192px] w-[1920px] flex items-center justify-center gap-[127px]">
          <div className="font-['Pretendard'] font-extrabold text-[130px] text-white whitespace-nowrap m-0 tracking-tight">
            {current.name}
          </div>
          <div className="w-[480px] flex justify-between items-center bg-transparent">
            <img src="/assets/arrow-right-pink.svg" className="size-[100px] rotate-180" alt="" />
            <img src="/assets/notice-footer-2.svg" className="h-[80px] object-contain" alt="" />
            <img src="/assets/arrow-right-pink.svg" className="size-[100px]" alt="" />
          </div>
          <div className="font-[USN_Stencil] text-[152.68px] text-white whitespace-nowrap m-0 tabular-nums font-[400] leading-none mb-4">
            {hours}:{minutes}:{seconds}
          </div>
        </div>

        {/* Horizontal pink bars */}
        <div className="absolute left-0 top-[396px] w-[1406px] h-[15px] bg-[#ff40c2]" />
        <div className="absolute left-0 top-[411px] w-[1406px] h-[15px] bg-[#ff40c2]" />

        {/* Gray dividing line */}
        <div className="absolute left-0 top-[412px] w-[1920px] h-[1px]">
          <img alt="" className="absolute inset-0 size-full object-cover" src="/assets/vector13.svg" />
        </div>

        {/* Main Center Area */}
        <div className="absolute top-[412.37px] left-0 w-[1920px] overflow-hidden flex items-center justify-between">
          <div className="relative w-[114px] h-[575px]">
            {bluePixels.map((p, i) => (
              <div key={`b-${i}`} className="absolute bg-[#04f] size-[38.3px]" style={{ left: `${p.x}px`, top: `${p.y}px` }} />
            ))}
          </div>

          <div className="flex flex-[1_0_0] items-center justify-center gap-[301px] px-[280px]">
            <div className="w-[235px] h-[313px] flex items-center justify-center">
              <span className="font-display text-[260px] text-white tabular-nums drop-shadow-md pb-[70px]">
                <RouletteNumber value={current.scoreA.toString()} />
              </span>
            </div>

            <div className="h-[399px] w-[58px] flex flex-col justify-center items-center gap-[283px]">
              <div className="size-[58px] bg-[#ff40c2]" />
              <div className="size-[58px] bg-[#ff40c2]" />
            </div>

            <div className="w-[235px] h-[313px] flex items-center justify-center">
              <span className="font-display text-[260px] text-white tabular-nums drop-shadow-md pb-[70px]">
                <RouletteNumber value={current.scoreB.toString()} />
              </span>
            </div>
          </div>

          <div className="relative w-[114px] h-[575px]">
            {whitePixels.map((p, i) => (
              <div key={`w-${i}`} className="absolute bg-white size-[38.3px]" style={{ left: `${p.x}px`, top: `${p.y}px` }} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bg-[#111] flex flex-col h-[99px] items-center left-0 overflow-clip top-[981px] w-[1920px]">
          <div className="h-0 relative shrink-0 w-[1920px]">
            <div className="absolute inset-[-1.25px_0]">
              <img alt="" className="block max-w-none size-full" src="/assets/notice-footer-line.svg" />
            </div>
          </div>
          <div className="flex flex-[1_0_0] items-center justify-center px-[30px] w-full text-white text-[52px] font-['Pretendard'] font-medium">
            <div className="flex items-center justify-between w-[1860px]">
              <div className="w-[60.41px] h-[34.18px] bg-[#EB0D7D]" />
              <p className="m-0 tracking-tight">대충 중요한 공지사항입니다! 공지사항을 보는 것은 중요합니다.</p>
              <div className="w-[60.41px] h-[34.18px] bg-[#EB0D7D]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InProgressView;
