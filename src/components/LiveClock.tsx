import React, { useState, useEffect } from 'react';

export const LiveClock: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [timeStr, setTimeStr] = useState(() => {
    const n = new Date();
    const pad = (num: number) => (num < 10 ? '0' + num : num);
    return `${pad(n.getUTCHours())}:${pad(n.getUTCMinutes())}:${pad(n.getUTCSeconds())} UTC`;
  });

  useEffect(() => {
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const update = () => {
      const n = new Date();
      setTimeStr(`${pad(n.getUTCHours())}:${pad(n.getUTCMinutes())}:${pad(n.getUTCSeconds())} UTC`);
    };
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span
      className={`font-mono font-medium text-[13px] text-[#9AFFC4] tabular-nums ${className}`}
    >
      {timeStr}
    </span>
  );
};
