export interface TimeLog {
  id: string;
  category: string;
  startTime: number; // Unix timestamp in milliseconds
  endTime: number;   // Unix timestamp in milliseconds
  duration: number;  // Duration in milliseconds
}

export interface Category {
  id: string;
  name: string;
}
