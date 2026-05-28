"use client";

import { useState, useEffect, useRef } from "react";
import { Timer, TimerState } from "@/types/timer";
import { speak } from "@/utils/speech";

interface TimerDisplayProps {
  timer: Timer;
  onComplete: () => void;
  onBack: () => void;
}

// Helper function to determine if text should be light or dark
function getTextColor(hex: string): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const R = (num >> 16);
  const G = (num >> 8 & 0x00FF);
  const B = (num & 0x0000FF);
  const brightness = (R * 299 + G * 587 + B * 114) / 1000;
  return brightness > 128 ? "#000000" : "#FFFFFF";
}

export function TimerDisplay({ timer, onComplete, onBack }: TimerDisplayProps) {
  const [state, setState] = useState<TimerState>({
    currentSet: 1,
    currentExerciseIndex: 0,
    timeRemaining: timer.exercises[0].duration,
    isRunning: false,
    isPaused: false,
    inRest: false,
  });

  const currentExercise = timer.exercises[state.currentExerciseIndex];
  const isResting = state.inRest;
  const totalExercises = timer.exercises.length;
  const currentExerciseColor = currentExercise?.color || "#ffffff";
  const lastSpokenTimeRef = useRef<number | null>(null);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isRunning && !state.isPaused) {
      interval = setInterval(() => {
        setState((prev) => {
          const newTimeRemaining = prev.timeRemaining - 1;
          const currentEx = timer.exercises[prev.currentExerciseIndex];

          if (newTimeRemaining <= 0) {
            let nextSet = prev.currentSet;
            let nextExerciseIndex = prev.currentExerciseIndex;
            let nextTime = 0;
            let nextInRest = false;

            // If currently in exercise, move to rest period
            if (!prev.inRest && currentEx.restAfter > 0) {
              nextTime = currentEx.restAfter;
              nextInRest = true;
              speak("Rest");
              lastSpokenTimeRef.current = null;
              // Keep same exercise index
            } else {
              // Move to next exercise
              if (nextExerciseIndex < timer.exercises.length - 1) {
                nextExerciseIndex++;
                nextTime = timer.exercises[nextExerciseIndex].duration;
                nextInRest = false;
                speak(timer.exercises[nextExerciseIndex].name);
                lastSpokenTimeRef.current = null;
              } else if (nextSet < timer.sets) {
                // Move to next set
                nextSet++;
                nextExerciseIndex = 0;
                nextTime = timer.exercises[0].duration;
                nextInRest = false;
                speak(timer.exercises[0].name);
                lastSpokenTimeRef.current = null;
              } else {
                // Workout complete
                speak("Workout complete");
                // Defer onComplete to next tick to avoid setState during render
                setTimeout(() => {
                  onComplete();
                }, 0);
                return prev;
              }
            }

            return {
              ...prev,
              currentSet: nextSet,
              currentExerciseIndex: nextExerciseIndex,
              timeRemaining: nextTime,
              inRest: nextInRest,
            };
          }

          // Handle last 3 seconds countdown
          if (newTimeRemaining > 0 && newTimeRemaining <= 3 && lastSpokenTimeRef.current !== newTimeRemaining) {
            speak(newTimeRemaining.toString());
            lastSpokenTimeRef.current = newTimeRemaining;
          }

          return { ...prev, timeRemaining: newTimeRemaining };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [state.isRunning, state.isPaused, timer, onComplete]);

  const toggleTimer = () => {
    if (!state.isRunning) {
      lastSpokenTimeRef.current = null;
      setState((prev) => ({ ...prev, isRunning: true, isPaused: false }));
    } else {
      setState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
    }
  };

  const stopTimer = () => {
    lastSpokenTimeRef.current = null;
    setState({
      currentSet: 1,
      currentExerciseIndex: 0,
      timeRemaining: timer.exercises[0].duration,
      isRunning: false,
      isPaused: false,
      inRest: false,
    });
  };

  const skipForward = () => {
    setState((prev) => {
      let nextSet = prev.currentSet;
      let nextExerciseIndex = prev.currentExerciseIndex;
      let nextTime = 0;
      let nextInRest = false;

      // If currently in exercise, move to rest
      if (!prev.inRest && timer.exercises[prev.currentExerciseIndex].restAfter > 0) {
        nextTime = timer.exercises[prev.currentExerciseIndex].restAfter;
        nextInRest = true;
      } else {
        // Move to next exercise
        if (nextExerciseIndex < timer.exercises.length - 1) {
          nextExerciseIndex++;
          nextTime = timer.exercises[nextExerciseIndex].duration;
          nextInRest = false;
        } else if (nextSet < timer.sets) {
          // Move to next set
          nextSet++;
          nextExerciseIndex = 0;
          nextTime = timer.exercises[0].duration;
          nextInRest = false;
        }
      }

      lastSpokenTimeRef.current = null;
      return {
        ...prev,
        currentSet: nextSet,
        currentExerciseIndex: nextExerciseIndex,
        timeRemaining: nextTime,
        inRest: nextInRest,
      };
    });
  };

  const skipBackward = () => {
    setState((prev) => {
      let nextSet = prev.currentSet;
      let nextExerciseIndex = prev.currentExerciseIndex;
      let nextTime = 0;
      let nextInRest = false;

      // If in rest, go back to the exercise
      if (prev.inRest) {
        nextTime = timer.exercises[prev.currentExerciseIndex].duration;
        nextInRest = false;
      } else if (nextExerciseIndex > 0) {
        // Move to previous exercise's rest period
        nextExerciseIndex--;
        nextTime = timer.exercises[nextExerciseIndex].restAfter;
        nextInRest = true;
      } else if (nextSet > 1) {
        // Move to previous set's last exercise
        nextSet--;
        nextExerciseIndex = timer.exercises.length - 1;
        nextTime = timer.exercises[nextExerciseIndex].restAfter;
        nextInRest = true;
      } else {
        // At beginning, go to first exercise
        nextExerciseIndex = 0;
        nextTime = timer.exercises[0].duration;
        nextInRest = false;
      }

      lastSpokenTimeRef.current = null;
      return {
        ...prev,
        currentSet: nextSet,
        currentExerciseIndex: nextExerciseIndex,
        timeRemaining: nextTime,
        inRest: nextInRest,
      };
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate total workout duration in seconds
  const totalWorkoutDuration = timer.exercises.reduce((acc, ex) => {
    return acc + ex.duration + ex.restAfter;
  }, 0) * timer.sets;

  // Calculate elapsed time based on current state
  const getElapsedTime = () => {
    let elapsed = 0;

    // Add time from completed sets
    const timePerSet = timer.exercises.reduce((acc, ex) => acc + ex.duration + ex.restAfter, 0);
    elapsed += (state.currentSet - 1) * timePerSet;

    // Add time from completed exercises in current set
    for (let i = 0; i < state.currentExerciseIndex; i++) {
      elapsed += timer.exercises[i].duration + timer.exercises[i].restAfter;
    }

    // Add time spent on current exercise
    const currentExerciseTotalTime = currentExercise.duration + currentExercise.restAfter;
    const timeSpentOnCurrent = currentExerciseTotalTime - state.timeRemaining;
    elapsed += timeSpentOnCurrent;

    return elapsed;
  };

  const elapsedTime = getElapsedTime();

  return (
    <div className="flex flex-col items-center justify-between min-h-screen text-center" style={{ width: "100%", paddingTop: "30px", paddingBottom: "30px", paddingLeft: "10px", paddingRight: "10px", backgroundColor: isResting ? "#d1d5db" : currentExerciseColor, color: isResting ? "#000000" : getTextColor(currentExerciseColor), boxSizing: "border-box", margin: "0", overflow: "hidden" }}>
      {/* Top Stats Row - ELAPSED, INTERVAL, REMAINING */}
      <div className="w-full pt-2 pb-2">
        <div className="flex justify-around items-start">
          <div className="text-center">
            <p style={{ fontSize: "clamp(14px, 2vw, 18px)" }} className="font-bold mb-1">ELAPSED</p>
            <p style={{ fontSize: "clamp(16px, 2.5vw, 22px)" }} className="font-bold">{formatTime(elapsedTime)}</p>
          </div>
          <div className="text-center">
            <p style={{ fontSize: "clamp(14px, 2vw, 18px)" }} className="font-bold mb-1">INTERVAL</p>
            <p style={{ fontSize: "clamp(16px, 2.5vw, 22px)" }} className="font-bold">{state.currentSet}/{timer.sets}</p>
          </div>
          <div className="text-center">
            <p style={{ fontSize: "clamp(14px, 2vw, 18px)" }} className="font-bold mb-1">REMAINING</p>
            <p style={{ fontSize: "clamp(16px, 2.5vw, 22px)" }} className="font-bold">{formatTime(totalWorkoutDuration - elapsedTime)}</p>
          </div>
        </div>
      </div>

      {/* Main Content - Centered Exercise and Timer */}
      <div className="flex flex-col items-center justify-center w-full mb-2">
        {/* Current Exercise Name */}
        <p style={{ fontSize: "clamp(18px, 4vw, 24px)" }} className="font-bold uppercase tracking-wider mb-2 opacity-100">
          CURRENT INTERVAL
        </p>

        {/* Current Exercise Type */}
        <p style={{ fontSize: "clamp(28px, 7vw, 48px)" }} className="font-bold uppercase tracking-widest mb-3">
          {isResting ? "REST" : currentExercise.name}
        </p>

        {/* Countdown Timer - Responsive Large */}
        <div className="text-center mb-1">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "clamp(80px, 25vw, 140px)", fontFamily: "'Futura', 'Trebuchet MS', sans-serif", fontWeight: "bold", lineHeight: "1" }}>
            <span style={{ textAlign: "right" }}>
              {String(Math.floor(state.timeRemaining / 60)).padStart(2, "0")}
            </span>
            <span style={{ textAlign: "center" }}>:</span>
            <span style={{ textAlign: "left" }}>
              {String(state.timeRemaining % 60).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Controls - Under Timer */}
      <div className="flex justify-center items-center mb-0" style={{ gap: "clamp(4px, 2vw, 8px)", maxWidth: "100%", marginTop: "2px" }}>
        {/* Close Button */}
        <button
          onClick={onBack}
          style={{ width: "clamp(50px, 12vw, 60px)", height: "clamp(50px, 12vw, 60px)", fontSize: "clamp(24px, 6vw, 32px)", fontWeight: "900", lineHeight: "1", fontFamily: "'Futura', 'Trebuchet MS', sans-serif", borderColor: isResting ? "#000000" : getTextColor(currentExerciseColor), color: isResting ? "#000000" : getTextColor(currentExerciseColor) }}
          className="rounded-full border-4 bg-transparent flex items-center justify-center hover:opacity-70 transition-opacity"
          title="Close"
        >
          ×
        </button>

        {/* Skip Backward Button */}
        <button
          onClick={skipBackward}
          style={{ width: "clamp(50px, 12vw, 60px)", height: "clamp(50px, 12vw, 60px)", fontSize: "clamp(24px, 6vw, 32px)", lineHeight: "1", fontFamily: "'Futura', 'Trebuchet MS', sans-serif", borderColor: isResting ? "#000000" : getTextColor(currentExerciseColor), color: isResting ? "#000000" : getTextColor(currentExerciseColor) }}
          className="rounded-full border-4 bg-transparent flex items-center justify-center hover:opacity-70 transition-opacity"
          title="Skip Backward"
        >
          ≪
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={toggleTimer}
          style={{ width: "clamp(50px, 12vw, 60px)", height: "clamp(50px, 12vw, 60px)", fontSize: "clamp(24px, 6vw, 32px)", lineHeight: "1", fontFamily: "'Futura', 'Trebuchet MS', sans-serif", borderColor: isResting ? "#000000" : getTextColor(currentExerciseColor), color: isResting ? "#000000" : getTextColor(currentExerciseColor) }}
          className="rounded-full border-4 bg-transparent flex items-center justify-center hover:opacity-70 transition-opacity"
          title={!state.isRunning ? "Start" : state.isPaused ? "Resume" : "Pause"}
        >
          {!state.isRunning ? "▶" : state.isPaused ? "▶" : "◼"}
        </button>

        {/* Skip Forward Button */}
        <button
          onClick={skipForward}
          style={{ width: "clamp(50px, 12vw, 60px)", height: "clamp(50px, 12vw, 60px)", fontSize: "clamp(24px, 6vw, 32px)", lineHeight: "1", fontFamily: "'Futura', 'Trebuchet MS', sans-serif", borderColor: isResting ? "#000000" : getTextColor(currentExerciseColor), color: isResting ? "#000000" : getTextColor(currentExerciseColor) }}
          className="rounded-full border-4 bg-transparent flex items-center justify-center hover:opacity-70 transition-opacity"
          title="Skip Forward"
        >
          ≫
        </button>

        {/* Reset Button */}
        <button
          onClick={stopTimer}
          style={{ width: "clamp(50px, 12vw, 60px)", height: "clamp(50px, 12vw, 60px)", fontSize: "clamp(24px, 6vw, 32px)", lineHeight: "1", fontFamily: "'Futura', 'Trebuchet MS', sans-serif", borderColor: isResting ? "#000000" : getTextColor(currentExerciseColor), color: isResting ? "#000000" : getTextColor(currentExerciseColor) }}
          className="rounded-full border-4 bg-transparent flex items-center justify-center hover:opacity-70 transition-opacity"
          title="Reset"
        >
          ↻
        </button>
      </div>

      {/* Next Exercise Preview - Bottom */}
      {state.currentExerciseIndex < totalExercises - 1 && (
        <div className="text-center border-4 flex-shrink-0" style={{ width: "clamp(280px, 100%, 500px)", borderRadius: "20px", paddingTop: "12px", paddingBottom: "12px", paddingLeft: "16px", paddingRight: "16px", backgroundColor: timer.exercises[state.currentExerciseIndex + 1].color || "#000000", borderColor: "#000000", marginTop: "4px", maxWidth: "90vw" }}>
          <p style={{ fontSize: "clamp(14px, 3vw, 18px)", color: getTextColor(timer.exercises[state.currentExerciseIndex + 1].color || "#000000") }} className="font-bold uppercase tracking-wider mb-1 opacity-100">UP NEXT...</p>
          <p style={{ fontSize: "clamp(20px, 5vw, 28px)", color: getTextColor(timer.exercises[state.currentExerciseIndex + 1].color || "#000000") }} className="font-bold">
            {timer.exercises[state.currentExerciseIndex + 1].name}
          </p>
          <p style={{ fontSize: "clamp(20px, 5vw, 28px)", color: getTextColor(timer.exercises[state.currentExerciseIndex + 1].color || "#000000") }} className="font-semibold mt-1">
            :{timer.exercises[state.currentExerciseIndex + 1].duration}
          </p>
        </div>
      )}
    </div>
  );
}
