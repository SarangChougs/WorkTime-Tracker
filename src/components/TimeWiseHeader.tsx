import { Timer } from 'lucide-react';

export default function TimeWiseHeader() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <Timer className="h-8 w-8 text-primary mr-2" />
        <h1 className="text-2xl font-semibold text-foreground">TimeWise Tracker</h1>
      </div>
    </header>
  );
}
