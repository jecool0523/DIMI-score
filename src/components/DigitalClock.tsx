import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <span className={`font-['Pretendard'] ${isMobile ? 'text-[4rem]' : 'text-[8rem]'} leading-none tracking-tighter text-foreground tabular-nums`}>
        {hours}:{minutes}:{seconds}
      </span>
    </div>
  );
};

export default DigitalClock;
