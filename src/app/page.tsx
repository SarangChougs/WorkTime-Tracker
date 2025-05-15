
"use client";

import { useState, useEffect } from 'react';
import type { TimeLog, Category } from '@/types/timetracker';
import TimeWiseHeader from '@/components/TimeWiseHeader';
import TimerDisplay from '@/components/TimerDisplay';
import CategoryManager from '@/components/CategoryManager';
import TimerControls from '@/components/TimerControls';
import TimeLogsDisplay from '@/components/TimeLogsDisplay';
import WorkSummaryChart from '@/components/WorkSummaryChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

const initialCategories: Category[] = [
  { id: 'work-project-a', name: 'Project Alpha' },
  { id: 'work-meetings', name: 'Meetings' },
  { id: 'work-deep', name: 'Deep Work Focus' },
];

export default function HomePage() {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategories.length > 0 ? initialCategories[0].id : null);
  
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [totalPausedDuration, setTotalPausedDuration] = useState(0); // Stores accumulated pause time for the CURRENT session
  const [currentElapsedTime, setCurrentElapsedTime] = useState(0); // Stores active elapsed time for display

  const { toast } = useToast();

  useEffect(() => {
    const storedLogs = localStorage.getItem('timeWiseLogs');
    const storedCategories = localStorage.getItem('timeWiseCategories');
    if (storedLogs) {
      // Ensure logs are parsed with the potentially new totalPausedDuration field
      const parsedLogs: TimeLog[] = JSON.parse(storedLogs);
      setTimeLogs(parsedLogs);
    }
    if (storedCategories) {
      const parsedCategories = JSON.parse(storedCategories);
      setCategories(parsedCategories);
      if (parsedCategories.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(parsedCategories[0].id);
      }
    } else {
      localStorage.setItem('timeWiseCategories', JSON.stringify(initialCategories));
       if (initialCategories.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(initialCategories[0].id);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timeWiseLogs', JSON.stringify(timeLogs));
  }, [timeLogs]);

  useEffect(() => {
    localStorage.setItem('timeWiseCategories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isTimerRunning && !isPaused && timerStartTime !== null) {
      const updateElapsedTime = () => {
        // Current active elapsed time = Now - Start Time - Total Paused Duration
        setCurrentElapsedTime(Date.now() - timerStartTime - totalPausedDuration);
      };
      updateElapsedTime(); 
      intervalId = setInterval(updateElapsedTime, 1000);
    } else if (isTimerRunning && isPaused && timerStartTime !== null && pauseStartTime !== null) {
      // When paused, currentElapsedTime should reflect the time up to the point of pause
      setCurrentElapsedTime(pauseStartTime - timerStartTime - totalPausedDuration);
    } else if (!isTimerRunning) {
      // Reset displayed elapsed time when timer is not running
      setCurrentElapsedTime(0);
    }

    return () => clearInterval(intervalId);
  }, [isTimerRunning, isPaused, timerStartTime, pauseStartTime, totalPausedDuration]);


  const handleAddCategory = (categoryName: string) => {
    if (categories.some(cat => cat.name.toLowerCase() === categoryName.toLowerCase())) {
      toast({
        title: "Category Exists",
        description: `Category "${categoryName}" already exists.`,
        variant: "destructive",
      });
      return;
    }
    const newCategory: Category = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: categoryName,
    };
    setCategories(prev => [...prev, newCategory]);
    setSelectedCategoryId(newCategory.id); // Automatically select new category
    toast({
      title: "Category Added",
      description: `Category "${categoryName}" has been added.`,
    });
  };

  const handleStartTimer = () => {
    if (!selectedCategoryId) {
      toast({
        title: "No Category Selected",
        description: "Please select a category before starting the timer.",
        variant: "destructive",
      });
      return;
    }
    setTimerStartTime(Date.now());
    setIsTimerRunning(true);
    setIsPaused(false);
    setPauseStartTime(null);
    setTotalPausedDuration(0); // Reset total paused duration for new session
    setCurrentElapsedTime(0); // Reset elapsed time display
    const selectedCategory = categories.find(c => c.id === selectedCategoryId);
    toast({
      title: "Timer Started",
      description: `Tracking time for ${selectedCategory?.name || 'selected category'}.`,
    });
  };

  const handlePauseTimer = () => {
    if (!isTimerRunning || isPaused) return;
    setIsPaused(true);
    setPauseStartTime(Date.now()); // Record the time pause started
    // currentElapsedTime will be updated by useEffect based on pauseStartTime
    const selectedCategory = categories.find(c => c.id === selectedCategoryId);
    toast({
      title: "Timer Paused",
      description: `Timer for ${selectedCategory?.name || 'selected category'} is paused.`,
      variant: "default",
    });
  };

  const handleResumeTimer = () => {
    if (!isTimerRunning || !isPaused || !pauseStartTime) return;
    // Add the duration of the just-ended pause to the total
    setTotalPausedDuration(prevDuration => prevDuration + (Date.now() - pauseStartTime));
    setIsPaused(false);
    setPauseStartTime(null); // Clear pause start time
    // currentElapsedTime will be updated by useEffect
    const selectedCategory = categories.find(c => c.id === selectedCategoryId);
    toast({
      title: "Timer Resumed",
      description: `Timer for ${selectedCategory?.name || 'selected category'} has resumed.`,
    });
  };

  const handleStopTimer = () => {
    if (!timerStartTime || !selectedCategoryId) return;

    const endTime = Date.now();
    let finalTotalPausedDurationThisSession = totalPausedDuration;

    // If timer is stopped while paused, add the current pause interval to this session's total paused duration
    if (isPaused && pauseStartTime) {
      finalTotalPausedDurationThisSession += (endTime - pauseStartTime);
    }

    // Active duration = (End Time - Start Time) - Total Time Paused During This Session
    const activeDuration = (endTime - timerStartTime) - finalTotalPausedDurationThisSession;
    
    const selectedCategoryObject = categories.find(cat => cat.id === selectedCategoryId);

    if (!selectedCategoryObject) {
        toast({ title: "Error", description: "Selected category not found.", variant: "destructive"});
        // Reset timer state even if category is somehow not found
        setIsTimerRunning(false);
        setIsPaused(false);
        setTimerStartTime(null);
        setPauseStartTime(null);
        setTotalPausedDuration(0);
        setCurrentElapsedTime(0);
        return;
    }

    const newLog: TimeLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category: selectedCategoryObject.name,
      startTime: timerStartTime,
      endTime,
      duration: activeDuration, // Log the active duration
      totalPausedDuration: finalTotalPausedDurationThisSession, // Log the total paused duration for this entry
    };

    setTimeLogs(prevLogs => [newLog, ...prevLogs]);

    // Reset all timer states
    setIsTimerRunning(false);
    setIsPaused(false);
    setTimerStartTime(null);
    setPauseStartTime(null);
    setTotalPausedDuration(0);
    setCurrentElapsedTime(0); // Reset displayed elapsed time
    
    toast({
      title: "Timer Stopped",
      description: `Logged ${newLog.category} for ${ (activeDuration / (1000 * 60)).toFixed(1) } minutes.`,
    });
  };
  
  const currentSelectedCategoryName = categories.find(c => c.id === selectedCategoryId)?.name || "No category selected";
  const cardDescription = isTimerRunning 
    ? (isPaused ? `Timer PAUSED for: ${currentSelectedCategoryName}` : `Currently tracking: ${currentSelectedCategoryName}`) 
    : "Select a category and start the timer.";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TimeWiseHeader />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Track Your Time</CardTitle>
            <CardDescription>
              {cardDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CategoryManager
              categories={categories}
              selectedCategory={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              onAddCategory={handleAddCategory}
              disabled={isTimerRunning}
            />
            <Separator />
            <TimerDisplay elapsedTime={currentElapsedTime} />
            <TimerControls
              isRunning={isTimerRunning}
              isPaused={isPaused}
              isCategorySelected={!!selectedCategoryId}
              onStart={handleStartTimer}
              onPause={handlePauseTimer}
              onResume={handleResumeTimer}
              onStop={handleStopTimer}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Review your past work sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <TimeLogsDisplay logs={timeLogs} />
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>Work Summary</CardTitle>
              <CardDescription>Visual breakdown of your time.</CardDescription>
            </CardHeader>
            <CardContent>
              <WorkSummaryChart logs={timeLogs} />
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="text-center py-4 border-t border-border text-sm text-muted-foreground">
        TimeWise Tracker &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
