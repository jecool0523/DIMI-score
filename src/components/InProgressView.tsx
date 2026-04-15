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
    <div className="fixed inset-0 z-40 bg-[#F4F4F4] flex items-start justify-center animate-in fade-in duration-500">
      <div
        className="relative w-[1920px] h-[1080px] shrink-0"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top' }}
      >
        <img src="/assets/background/종목화면.svg" className="absolute inset-0 w-full h-full object-cover -z-10" alt="" />

        <TotalScoreBoard />

        {/* Unified Header: [Event Name] [Icons] [Clock] */}
        <div className="absolute top-[200px] left-0 w-[1920px] h-[100px] flex items-center z-30">
          {/* Event Name */}
          <div className="flex-1 flex justify-center">
            <div className="font-sans font-extrabold text-[130px] text-black whitespace-nowrap m-0 tracking-tight">
              {current.name}
            </div>
          </div>

          {/* Icons Group - Centered & Narrower */}
          <div className="relative w-[480px] h-[100px] flex items-center justify-center">
            {/* Left Arrow */}
            <div className="absolute left-0 w-[100px] h-[100px] -rotate-90">
              <img src="/assets/match-arrow.svg" className="w-full h-full" alt="" />
            </div>
            {/* Loop Icon */}
            <div className="w-[143px] h-[81px]">
              <img src="/assets/match-loop.svg" className="w-full h-full" alt="" />
            </div>
            {/* Right Arrow */}
            <div className="absolute right-0 w-[100px] h-[100px] rotate-90">
              <img src="/assets/match-arrow.svg" className="w-full h-full" alt="" />
            </div>
          </div>

          {/* Clock Text */}
          <div className="flex-1 flex justify-center">
            <div className="font-sans text-[152.68px] text-black whitespace-nowrap m-0 tabular-nums font-[400] leading-none text-center">
              {hours}:{minutes}:{seconds}
            </div>
          </div>
        </div>

        {/* Main Center Area */}
        <div className="absolute top-[470px] left-0 w-[1920px] overflow-hidden flex items-center justify-between">
          <div className="flex flex-[1_0_0] items-center justify-center gap-[632px] px-[280px]">
            <div className="w-[300px] h-[450px] flex items-center justify-center pt-[20px]">
              <span className="font-sans text-[500px] text-black tabular-nums drop-shadow-md pb-[40px]">
                <RouletteNumber value={current.scoreA.toString()} />
              </span>
            </div>

            <div className="w-[300px] h-[450px] flex items-center justify-center pt-[20px]">
              <span className="font-sans text-[500px] text-black tabular-nums drop-shadow-md pb-[40px]">
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
