import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatted = time.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <div className="flex items-center gap-3">
      <Clock className="text-primary" size={28} />
      <span className="font-display text-4xl tracking-wider text-foreground tabular-nums">
        {formatted}
      </span>
    </div>
  );
};

export default DigitalClock;
