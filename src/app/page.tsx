"use client";

import { useState, useEffect } from "react";
import { useTimerStorage } from "@/hooks/useTimerStorage";
import { TimerList } from "@/components/TimerList";
import { TimerForm } from "@/components/TimerForm";
import { TimerDisplay } from "@/components/TimerDisplay";
import { Timer } from "@/types/timer";

type AppView = "list" | "create" | "edit" | "play";

export default function Home() {
  const { timers, loading, addTimer, updateTimer, deleteTimer } =
    useTimerStorage();
  const [currentView, setCurrentView] = useState<AppView>("list");
  const [selectedTimer, setSelectedTimer] = useState<Timer | null>(null);

  // Handle hydration
  useEffect(() => {
    // This ensures the component is properly mounted before rendering
  }, []);

  const handleCreateNew = () => {
    setSelectedTimer(null);
    setCurrentView("create");
  };

  const handleEdit = (timer: Timer) => {
    setSelectedTimer(timer);
    setCurrentView("edit");
  };

  const handlePlay = (timer: Timer) => {
    setSelectedTimer(timer);
    setCurrentView("play");
  };

  const handleDelete = (timer: Timer) => {
    if (confirm(`Delete timer "${timer.name}"?`)) {
      deleteTimer(timer.id);
    }
  };

  const handleSaveTimer = (timer: Timer) => {
    if (currentView === "create") {
      addTimer(timer);
    } else {
      updateTimer(timer.id, timer);
    }
    setCurrentView("list");
    setSelectedTimer(null);
  };

  const handleCancel = () => {
    setCurrentView("list");
    setSelectedTimer(null);
  };

  const handlePlayComplete = () => {
    alert("Workout complete! Great job!");
    setCurrentView("list");
    setSelectedTimer(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      {currentView === "list" && (
        <TimerList
          timers={timers}
          onPlay={handlePlay}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreateNew={handleCreateNew}
        />
      )}

      {currentView === "create" && (
        <TimerForm onSave={handleSaveTimer} onCancel={handleCancel} existingTimers={timers} />
      )}

      {currentView === "edit" && selectedTimer && (
        <TimerForm
          initialTimer={selectedTimer}
          onSave={handleSaveTimer}
          onCancel={handleCancel}
          existingTimers={timers}
        />
      )}

      {currentView === "play" && selectedTimer && (
        <TimerDisplay
          timer={selectedTimer}
          onComplete={handlePlayComplete}
          onBack={() => setCurrentView("list")}
        />
      )}
    </main>
  );
}

