"use client";

import type React from 'react';
import { useEffect, useState } from 'react';
import { formatDuration } from '@/lib/timeUtils';

interface TimerDisplayProps {
  startTime: number | null;
  isRunning: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ startTime, isRunning }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isRunning && startTime) {
      setElapsedTime(Date.now() - startTime); // Initial update
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else if (!isRunning) {
      // If timer stops but was running, keep the last elapsed time
      // If timer was never started or reset, elapsedTime should be 0
      if (!startTime) setElapsedTime(0);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, startTime]);

  return (
    <div className="my-6 text-center">
      <p className="text-6xl font-mono text-foreground tabular-nums">
        {formatDuration(elapsedTime)}
      </p>
    </div>
  );
};

export default TimerDisplay;
