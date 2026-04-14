import { useState, useEffect } from 'react';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <span className="font-['Pretendard'] text-[8rem] leading-none tracking-tighter text-foreground tabular-nums">
        {hours}:{minutes}:{seconds}
      </span>
    </div>
  );
};

export default DigitalClock;
