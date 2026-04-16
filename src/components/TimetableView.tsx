import { useEffect, useState } from 'react';
import { useEventStore, type SportEvent } from '@/store/useEventStore';
import TotalScoreBoard from './TotalScoreBoard';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

const TimetableView = () => {
  const events = useEventStore((s) => s.events);
  const setEventStatus = useEventStore((s) => s.setEventStatus);
  const setViewMode = useEventStore((s) => s.setViewMode);
  const isMobile = useIsMobile();

  const [scale, setScale] = useState(1);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleResize = () => {
      const baseWidth = isMobile ? 1080 : 1920;
      const baseHeight = isMobile ? 1920 : 1080;
      const scaleW = window.innerWidth / baseWidth;
      const scaleH = window.innerHeight / baseHeight;
      setScale(Math.min(scaleW, scaleH));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = (e: React.MouseEvent, event: SportEvent) => {
    e.stopPropagation();
    events.forEach(ev => {
      if (ev.status === 'IN_PROGRESS' && ev.id !== event.id) {
        setEventStatus(ev.id, 'COMPLETED');
      }
    });
    setEventStatus(event.id, 'IN_PROGRESS');
    setViewMode('IN_PROGRESS');
  };

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-40 bg-[#F4F4F4] flex flex-col items-stretch animate-in fade-in duration-500 overflow-y-auto">
        <img
          src="/assets/background/기본 화면(개막식).svg"
          className="fixed inset-0 w-full h-full object-cover -z-10 opacity-30"
          alt=""
        />

        <div className="shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <TotalScoreBoard />
        </div>

        <div className="flex-1 p-6 space-y-6 pb-32">
          <h2 className="text-4xl font-black text-black tracking-tight mb-8">Match Schedule</h2>

          <div className="space-y-4">
            {/* Events hidden as requested */}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full h-24 bg-white/90 backdrop-blur-md border-t border-gray-100 flex items-center justify-center z-50">
          <p className="font-sans text-5xl text-black font-black tabular-nums tracking-tighter">
            {hours}:{minutes}:{seconds}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-[#F4F4F4] overflow-hidden flex items-start justify-center animate-in fade-in duration-500">
      <div
        className="relative shrink-0"
        style={{
          width: '1920px',
          height: '1080px',
          transform: `scale(${scale})`,
          transformOrigin: 'top'
        }}
      >
        <img
          src="/assets/background/기본 화면(개막식).svg"
          className="absolute inset-0 w-full h-full object-cover -z-10"
          alt=""
        />

        <TotalScoreBoard />

        <div className="absolute top-[120px] left-0 w-full flex h-[493px]">
          {/* Events hidden as requested */}
        </div>

        <p className="absolute left-1/2 -translate-x-1/2 top-[580px] font-sans text-[395px] text-black leading-none tracking-[0.05em] m-0 whitespace-nowrap tabular-nums z-10 pointer-events-none shadow-none text-center">
          {hours}:{minutes}:{seconds}
        </p>

      </div>
    </div>
  );
};

export default TimetableView;
