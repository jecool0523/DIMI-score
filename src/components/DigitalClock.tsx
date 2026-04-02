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
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-[8rem] leading-none tracking-tighter text-foreground tabular-nums">
        {hours}:{minutes}:{seconds}
      </span>
      <div className="flex items-center gap-3 mt-1">
        <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">{ampm}</span>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.15em] text-primary uppercase">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          LIVE MATCH CLOCK
        </span>
      </div>
    </div>
  );
};

export default DigitalClock;
