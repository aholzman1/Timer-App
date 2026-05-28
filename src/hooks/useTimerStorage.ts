"use client";

import { useState, useEffect } from "react";
import { Timer } from "@/types/timer";
import { getNextExerciseColor } from "@/utils/colors";

const STORAGE_KEY = "workoutTimers";

// Ensure all exercises have colors assigned
function normalizeTimers(timers: Timer[]): Timer[] {
  return timers.map((timer) => ({
    ...timer,
    exercises: timer.exercises.map((exercise, index) => ({
      ...exercise,
      color: exercise.color || getNextExerciseColor(index),
    })),
  }));
}

export function useTimerStorage() {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [loading, setLoading] = useState(true);

  // Load timers from local storage on component mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const normalized = normalizeTimers(parsed);
        setTimers(normalized);
      } catch (error) {
        console.error("Failed to parse stored timers:", error);
      }
    }
    setLoading(false);
  }, []);

  // Save timers to local storage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
    }
  }, [timers, loading]);

  const addTimer = (timer: Timer) => {
    setTimers((prev) => [...prev, timer]);
  };

  const updateTimer = (id: string, updatedTimer: Timer) => {
    setTimers((prev) =>
      prev.map((timer) => (timer.id === id ? updatedTimer : timer))
    );
  };

  const deleteTimer = (id: string) => {
    setTimers((prev) => prev.filter((timer) => timer.id !== id));
  };

  const getTimer = (id: string) => {
    return timers.find((timer) => timer.id === id);
  };

  return {
    timers,
    loading,
    addTimer,
    updateTimer,
    deleteTimer,
    getTimer,
  };
}
