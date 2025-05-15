
"use client";

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TimeLog } from '@/types/timetracker';
import { formatDuration, formatTimestamp } from '@/lib/timeUtils';
import { Tag, Clock, CalendarDays, PauseCircle } from 'lucide-react';

interface LogEntryCardProps {
  log: TimeLog;
}

const LogEntryCard: React.FC<LogEntryCardProps> = ({ log }) => {
  return (
    <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Tag className="mr-2 h-5 w-5 text-primary" />
          {log.category}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">{formatDuration(log.duration)}</p>
            <p className="text-xs text-muted-foreground">Active Duration</p>
          </div>
        </div>
        
        {log.totalPausedDuration !== undefined && log.totalPausedDuration > 0 && (
          <div className="flex items-center">
            <PauseCircle className="mr-2 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">{formatDuration(log.totalPausedDuration)}</p>
              <p className="text-xs text-muted-foreground">Paused</p>
            </div>
          </div>
        )}

        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
           <div>
            <p className="font-medium text-foreground">{formatTimestamp(log.startTime)} - {formatTimestamp(log.endTime)}</p>
            <p className="text-xs text-muted-foreground">Time Range</p>
          </div>
        </div>

         <div className="flex items-center sm:justify-end">
           <div>
             <p className="font-medium text-foreground">{new Date(log.startTime).toLocaleDateString()}</p>
             <p className="text-xs text-muted-foreground">Date</p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogEntryCard;
