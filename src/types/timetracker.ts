
export interface TimeLog {
  id: string;
  category: string;
  startTime: number; // Unix timestamp in milliseconds
  endTime: number;   // Unix timestamp in milliseconds
  duration: number;  // Active duration in milliseconds
  totalPausedDuration?: number; // Total paused duration in milliseconds for this log
}

export interface Category {
  id: string;
  name: string;
}
