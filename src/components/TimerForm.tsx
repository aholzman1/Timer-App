"use client";

import { useState } from "react";
import { Timer, Exercise } from "@/types/timer";
import { v4 as uuidv4 } from "uuid";
import { getUnusedColor } from "@/utils/colors";

interface TimerFormProps {
  onSave: (timer: Timer) => void;
  onCancel: () => void;
  initialTimer?: Timer;
  existingTimers?: Timer[];
}

export function TimerForm({
  onSave,
  onCancel,
  initialTimer,
  existingTimers = [],
}: TimerFormProps) {
  const [timerName, setTimerName] = useState(initialTimer?.name || "");
  const [sets, setSets] = useState(initialTimer?.sets || 3);
  const [exercises, setExercises] = useState<Exercise[]>(
    initialTimer?.exercises || [
      {
        id: uuidv4(),
        name: "Exercise 1",
        duration: 30,
        restAfter: 10,
        color: getUnusedColor([]),
      },
    ]
  );

  const addExercise = () => {
    const usedColors = exercises.map(ex => ex.color).filter(Boolean) as string[];
    const newColor = getUnusedColor(usedColors);
    setExercises([
      ...exercises,
      {
        id: uuidv4(),
        name: `Exercise ${exercises.length + 1}`,
        duration: 30,
        restAfter: 10,
        color: newColor,
      },
    ]);
  };

  const removeExercise = (id: string) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((ex) => ex.id !== id));
    }
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises(
      exercises.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timerName.trim()) {
      alert("Please enter a timer name");
      return;
    }
    
    // Check for duplicate timer names
    const isDuplicate = existingTimers.some(
      (timer) =>
        timer.name.toLowerCase() === timerName.toLowerCase() &&
        timer.id !== initialTimer?.id
    );
    if (isDuplicate) {
      alert("A timer with this name already exists. Please use a different name.");
      return;
    }
    
    if (exercises.length === 0) {
      alert("Please add at least one exercise");
      return;
    }

    const now = Date.now();
    const timer: Timer = {
      id: initialTimer?.id || uuidv4(),
      name: timerName,
      sets,
      exercises,
      createdAt: initialTimer?.createdAt || now,
      updatedAt: now,
    };

    onSave(timer);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto text-center min-h-screen bg-white py-6" style={{ marginLeft: "40px", marginRight: "40px", paddingBottom: "40px" }}>
      <div style={{ paddingTop: "40px", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "48px" }} className="font-bold text-black mb-6">
          {initialTimer ? "EDIT TIMER" : "CREATE NEW TIMER"}
        </h2>
        <div style={{ height: "2px", backgroundColor: "black", marginTop: "16px", marginLeft: "40px", marginRight: "40px" }}></div>
      </div>

      <div style={{ marginTop: "5px", marginBottom: "32px" }}>
        <label style={{ fontSize: "28px" }} className="block font-semibold text-black mb-4">
          Timer Name
        </label>
        <input
          type="text"
          value={timerName}
          onChange={(e) => setTimerName(e.target.value)}
          className="px-4 py-6 bg-black bg-opacity-10 text-black rounded-full text-center placeholder-black placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-black font-semibold"
          placeholder="e.g., Full Body Workout"
          style={{ marginBottom: "32px", fontSize: "18px", maxWidth: "600px", margin: "5px auto 5px auto", display: "block", width: "90%", fontFamily: "'Futura', 'Trebuchet MS', sans-serif", border: "2px solid #000000" }}
        />
      </div>

      <div style={{ marginBottom: "32px" }}>
        <label style={{ fontSize: "28px" }} className="block font-semibold text-black mb-4">
          Number of Sets
        </label>
        <input
          type="number"
          min="1"
          max="20"
          value={sets}
          onChange={(e) => setSets(parseInt(e.target.value))}
          className="px-4 py-6 bg-black bg-opacity-10 text-black rounded-full text-center focus:outline-none focus:ring-2 focus:ring-black font-semibold"
          style={{ fontSize: "18px", maxWidth: "600px", width: "90%", margin: "5px auto 5px auto", display: "block", border: "2px solid #000000" }}
        />
      </div>

      <div style={{ height: "2px", backgroundColor: "black", marginTop: "16px", marginLeft: "40px", marginRight: "40px", marginBottom: "16px" }}></div>

      <div style={{ marginBottom: "32px" }}>
        <div className="flex justify-center items-center mb-6">
          <h3 style={{ fontSize: "28px" }} className="font-semibold text-black">
            Exercises
          </h3>
          <button
            type="button"
            onClick={addExercise}
            style={{ fontSize: "18px", marginLeft: "16px", marginBottom: "20px", paddingLeft: "24px", paddingRight: "24px", paddingTop: "8px", paddingBottom: "8px", fontFamily: "'Futura', 'Trebuchet MS', sans-serif", backgroundColor: "black", color: "white" }}
            className="rounded-full border-2 border-black font-semibold transition-all duration-300 hover:opacity-70"
          >
            + ADD EXERCISE
          </button>
        </div>

        <div className="space-y-6" style={{ marginLeft: "10px", marginRight: "10px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="text-black border-2"
              style={{ backgroundColor: exercise.color || "#000000", borderColor: "#000000", borderRadius: "25px", padding: "15px" }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 style={{ fontSize: "20px" }} className="font-semibold">
                  Exercise {index + 1}
                </h3>
                {exercises.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExercise(exercise.id)}
                    style={{ fontSize: "14px", paddingLeft: "24px", paddingRight: "24px", paddingTop: "8px", paddingBottom: "8px", fontFamily: "'Futura', 'Trebuchet MS', sans-serif" }}
                    className="rounded-full border-2 border-black bg-transparent font-semibold transition-all duration-300 text-black hover:opacity-70"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label style={{ fontSize: "18px" }} className="block font-semibold text-black mb-2">
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    value={exercise.name}
                    onChange={(e) =>
                      updateExercise(exercise.id, { name: e.target.value })
                    }
                    className="px-4 py-6 bg-black bg-opacity-20 rounded-full text-black placeholder-black placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-black font-semibold text-center" style={{ fontSize: "18px", maxWidth: "500px", margin: "5px auto 5px auto", display: "block", width: "100%", border: "2px solid #000000", fontFamily: "'Futura', 'Trebuchet MS', sans-serif" }}
                    placeholder="e.g., Push-ups"
                  />
                </div>

                <div className="grid grid-cols-2" style={{ gap: "32px" }}>
                  <div>
                    <label style={{ fontSize: "18px" }} className="block font-semibold text-black mb-2">
                      Exercise Time (sec)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="300"
                      value={exercise.duration}
                      onChange={(e) =>
                        updateExercise(exercise.id, {
                          duration: parseInt(e.target.value),
                        })
                      }
                      className="px-4 py-6 bg-black bg-opacity-20 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-black font-semibold text-center" style={{ fontSize: "18px", width: "100%", margin: "5px auto 5px auto", border: "2px solid #000000", fontFamily: "'Futura', 'Trebuchet MS', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "18px" }} className="block font-semibold text-black mb-2">
                      Rest After (sec)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="300"
                      value={exercise.restAfter}
                      onChange={(e) =>
                        updateExercise(exercise.id, {
                          restAfter: parseInt(e.target.value),
                        })
                      }
                      className="px-4 py-6 bg-black bg-opacity-20 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-black font-semibold text-center" style={{ fontSize: "18px", width: "100%", margin: "5px auto 5px auto", border: "2px solid #000000", fontFamily: "'Futura', 'Trebuchet MS', sans-serif" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 justify-center pt-6 pb-6" style={{ gap: "16px" }}>
        <button
          type="button"
          onClick={onCancel}
          style={{ fontSize: "18px", paddingLeft: "32px", paddingRight: "32px", paddingTop: "12px", paddingBottom: "12px", fontFamily: "'Futura', 'Trebuchet MS', sans-serif", color: "black", border: "2px solid black", backgroundColor: "white", borderRadius: "9999px", maxWidth: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}
          className="font-semibold transition-all duration-300 hover:opacity-70"
        >
          CANCEL
        </button>
        <button
          type="submit"
          style={{ fontSize: "18px", paddingLeft: "32px", paddingRight: "32px", paddingTop: "12px", paddingBottom: "12px", fontFamily: "'Futura', 'Trebuchet MS', sans-serif", backgroundColor: "black", color: "white" }}
          className="rounded-full border-2 border-black font-semibold transition-all duration-300 hover:opacity-70"
        >
          {initialTimer ? "UPDATE TIMER" : "CREATE TIMER"}
        </button>
      </div>
    </form>
  );
}
