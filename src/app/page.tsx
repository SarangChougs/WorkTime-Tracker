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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const { toast } = useToast();

  // Effect to load data from localStorage if available (optional persistence)
  useEffect(() => {
    const storedLogs = localStorage.getItem('timeWiseLogs');
    const storedCategories = localStorage.getItem('timeWiseCategories');
    if (storedLogs) {
      setTimeLogs(JSON.parse(storedLogs));
    }
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      localStorage.setItem('timeWiseCategories', JSON.stringify(initialCategories));
    }
  }, []);

  // Effect to save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('timeWiseLogs', JSON.stringify(timeLogs));
  }, [timeLogs]);

  useEffect(() => {
    localStorage.setItem('timeWiseCategories', JSON.stringify(categories));
  }, [categories]);


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
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Simple unique ID
      name: categoryName,
    };
    setCategories(prev => [...prev, newCategory]);
    setSelectedCategoryId(newCategory.id); // Auto-select new category
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
    const selectedCategory = categories.find(c => c.id === selectedCategoryId);
    toast({
      title: "Timer Started",
      description: `Tracking time for ${selectedCategory?.name || 'selected category'}.`,
    });
  };

  const handleStopTimer = () => {
    if (!timerStartTime || !selectedCategoryId) return;

    const endTime = Date.now();
    const duration = endTime - timerStartTime;
    const selectedCategoryObject = categories.find(cat => cat.id === selectedCategoryId);

    if (!selectedCategoryObject) {
        toast({ title: "Error", description: "Selected category not found.", variant: "destructive"});
        // Reset timer state to prevent inconsistent state
        setIsTimerRunning(false);
        setTimerStartTime(null);
        // Optionally reset selectedCategoryId if it's invalid
        // setSelectedCategoryId(null); 
        return;
    }


    const newLog: TimeLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category: selectedCategoryObject.name,
      startTime: timerStartTime,
      endTime,
      duration,
    };

    setTimeLogs(prevLogs => [newLog, ...prevLogs]); // Add new log to the beginning
    setIsTimerRunning(false);
    setTimerStartTime(null); // Reset timer start time for the display
    
    toast({
      title: "Timer Stopped",
      description: `Logged ${newLog.category} for ${ (duration / (1000 * 60)).toFixed(1) } minutes.`,
    });
  };
  
  const currentSelectedCategoryName = categories.find(c => c.id === selectedCategoryId)?.name || "No category selected";

  return (
    <div className="min-h-screen flex flex-col">
      <TimeWiseHeader />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Track Your Time</CardTitle>
            <CardDescription>
              {isTimerRunning ? `Currently tracking: ${currentSelectedCategoryName}` : "Select a category and start the timer."}
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
            <TimerDisplay startTime={timerStartTime} isRunning={isTimerRunning} />
            <TimerControls
              isRunning={isTimerRunning}
              isCategorySelected={!!selectedCategoryId}
              onStart={handleStartTimer}
              onStop={handleStopTimer}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Review your past work sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <TimeLogsDisplay logs={timeLogs} />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
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
