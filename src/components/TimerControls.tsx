"use client";

import type React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  isCategorySelected: boolean;
  onStart: () => void;
  onStop: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isCategorySelected,
  onStart,
  onStop,
}) => {
  return (
    <div className="flex justify-center space-x-4 mt-6">
      {!isRunning ? (
        <Button
          size="lg"
          onClick={onStart}
          disabled={!isCategorySelected}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          aria-label="Start timer"
        >
          <Play className="mr-2 h-5 w-5" /> Start
        </Button>
      ) : (
        <Button
          size="lg"
          onClick={onStop}
          variant="destructive"
          aria-label="Stop timer"
        >
          <Square className="mr-2 h-5 w-5" /> Stop
        </Button>
      )}
    </div>
  );
};

export default TimerControls;
