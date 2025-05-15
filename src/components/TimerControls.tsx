
"use client";

import type React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, PauseIcon, PlayIcon as ResumeIcon } from 'lucide-react'; // Using PlayIcon also for Resume for thematic consistency

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  isCategorySelected: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  isCategorySelected,
  onStart,
  onPause,
  onResume,
  onStop,
}) => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-6">
      {!isRunning ? (
        <Button
          size="lg"
          onClick={onStart}
          disabled={!isCategorySelected}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-8 py-3 text-base"
          aria-label="Start timer"
        >
          <Play className="mr-2 h-5 w-5" /> Start
        </Button>
      ) : (
        <>
          {isPaused ? (
            <Button
              size="lg"
              onClick={onResume}
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg px-8 py-3 text-base"
              aria-label="Resume timer"
            >
              <ResumeIcon className="mr-2 h-5 w-5" /> Resume
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={onPause}
              variant="outline"
              className="rounded-lg px-8 py-3 text-base border-primary text-primary hover:bg-primary/10"
              aria-label="Pause timer"
            >
              <PauseIcon className="mr-2 h-5 w-5" /> Pause
            </Button>
          )}
          <Button
            size="lg"
            onClick={onStop}
            variant="destructive"
            className="rounded-lg px-8 py-3 text-base"
            aria-label="Stop timer"
          >
            <Square className="mr-2 h-5 w-5" /> Stop
          </Button>
        </>
      )}
    </div>
  );
};

export default TimerControls;
