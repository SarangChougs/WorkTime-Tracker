
"use client";

import type React from 'react';
import { formatDuration } from '@/lib/timeUtils';

interface TimerDisplayProps {
  elapsedTime: number; // Received directly from parent
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ elapsedTime }) => {
  return (
    <div className="my-6 text-center">
      <p className="text-6xl font-mono text-foreground tabular-nums tracking-tight">
        {formatDuration(elapsedTime)}
      </p>
    </div>
  );
};

export default TimerDisplay;
