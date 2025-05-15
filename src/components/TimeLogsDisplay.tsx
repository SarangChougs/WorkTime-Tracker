"use client";

import type React from 'react';
import type { TimeLog } from '@/types/timetracker';
import LogEntryCard from './LogEntryCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardList } from 'lucide-react';

interface TimeLogsDisplayProps {
  logs: TimeLog[];
}

const TimeLogsDisplay: React.FC<TimeLogsDisplayProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <ClipboardList className="mx-auto h-12 w-12 mb-4" />
        <p className="text-lg">No time logged yet.</p>
        <p>Start the timer to record your activities.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      {logs.map((log) => (
        <LogEntryCard key={log.id} log={log} />
      ))}
    </ScrollArea>
  );
};

export default TimeLogsDisplay;
