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
        <p className="font-sans text-5xl text-white">현재 진행 중인 종목이 없습니다</p>
      </div>
    );
  }

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="fixed inset-0 z-40 bg-white flex items-center justify-center animate-in fade-in duration-500">
      <div
        className="relative w-[1920px] h-[1080px] shrink-0"
        style={{ transform: `scale(${scale})` }}
      >
        <img src="/assets/background/종목화면.svg" className="absolute inset-0 w-full h-full object-cover -z-10" alt="" />

        <TotalScoreBoard />

        {/* Title Row */}
        <div className="absolute top-[92px] left-[125px] w-[600px] h-[190px] flex items-center justify-center">
          <div className="font-sans font-extrabold text-[130px] text-black whitespace-nowrap m-0 tracking-tight">
            {current.name}
          </div>
        </div>

        {/* Center Icons */}
        <div className="absolute top-[121px] left-[772px] flex items-center justify-center gap-[31px]">
          <img src="/assets/arrow-right-pink.svg" className="size-[100px] rotate-180" alt="" />
          <img src="/assets/notice-footer-2.svg" className="h-[80px] object-contain" alt="" />
          <img src="/assets/arrow-right-pink.svg" className="size-[100px]" alt="" />
        </div>

        {/* Clock Text */}
        <div className="absolute top-[99px] left-[1091px] w-[700px] h-[190px] flex items-center justify-center">
          <div className="font-sans text-[152.68px] text-black whitespace-nowrap m-0 tabular-nums font-[400] leading-none">
            {hours}:{minutes}:{seconds}
          </div>
        </div>

        {/* Main Center Area */}
        <div className="absolute top-[412.37px] left-0 w-[1920px] overflow-hidden flex items-center justify-between">
          <div className="flex flex-[1_0_0] items-center justify-center gap-[632px] px-[280px]">
            <div className="w-[235px] h-[313px] flex items-center justify-center pt-[50px]">
              <span className="font-sans text-[300px] text-black tabular-nums drop-shadow-md pb-[70px]">
                <RouletteNumber value={current.scoreA.toString()} />
              </span>
            </div>

            <div className="w-[235px] h-[313px] flex items-center justify-center pt-[50px]">
              <span className="font-sans text-[300px] text-black tabular-nums drop-shadow-md pb-[70px]">
                <RouletteNumber value={current.scoreB.toString()} />
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InProgressView;
