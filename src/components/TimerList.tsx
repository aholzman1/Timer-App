"use client";

import { Timer } from "@/types/timer";

interface TimerListProps {
  timers: Timer[];
  onPlay: (timer: Timer) => void;
  onEdit: (timer: Timer) => void;
  onDelete: (timer: Timer) => void;
  onCreateNew: () => void;
}

export function TimerList({
  timers,
  onPlay,
  onEdit,
  onDelete,
  onCreateNew,
}: TimerListProps) {
  return (
    <div className="max-w-6xl mx-auto text-center min-h-screen bg-white pb-8 px-8">
      <div style={{ marginBottom: "12px", paddingTop: "40px", paddingLeft: "16px", paddingRight: "16px" }}>
        <h1 style={{ fontSize: "48px" }} className="font-bold text-black mb-3">WORKOUT TIMER</h1>
        <p style={{ fontSize: "20px", marginBottom: "20px" }} className="text-black opacity-75">Create and run custom circuit timers</p>
      </div>

      <div className="mb-12">
        <button
          onClick={onCreateNew}
          style={{ fontSize: "18px", paddingLeft: "32px", paddingRight: "32px", paddingTop: "12px", paddingBottom: "12px", fontFamily: "'Futura', 'Trebuchet MS', sans-serif", backgroundColor: "black", color: "white" }}
          className="rounded-full border-2 border-black font-semibold transition-all duration-300 hover:opacity-70"
        >
          + CREATE NEW TIMER
        </button>
        <div style={{ height: "2px", backgroundColor: "black", marginTop: "16px", marginLeft: "40px", marginRight: "40px" }}></div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 px-16 mx-auto">
        {timers.map((timer) => {
            const totalTime =
              timer.exercises.reduce((acc, ex) => acc + ex.duration + ex.restAfter, 0) *
              timer.sets;

            return (
              <div
                key={timer.id}
                className="bg-transparent text-black text-center"
              >
                <h3 style={{ fontSize: "30px" }} className="font-bold text-black mb-6">
                  {timer.name}
                </h3>

                <div className="space-y-4" style={{ marginBottom: "10px" }}>
                  <p style={{ fontSize: "18px" }} className="font-semibold">
                    <span className="font-bold">Sets:</span> {timer.sets}
                  </p>
                  <p style={{ fontSize: "18px" }} className="font-semibold">
                    <span className="font-bold">Exercises:</span> {timer.exercises.length}
                  </p>
                  <p style={{ fontSize: "18px" }} className="font-semibold">
                    <span className="font-bold">Total Time:</span>{" "}
                    {Math.floor(totalTime / 60)}:
                    {(totalTime % 60).toString().padStart(2, "0")}
                  </p>
                </div>

                <div className="flex text-center justify-center" style={{ gap: "12px", maxWidth: "400px", margin: "0 auto" }}>
                  <button
                    onClick={() => onPlay(timer)}
                    style={{ fontSize: "18px", paddingLeft: "32px", paddingRight: "32px", paddingTop: "12px", paddingBottom: "12px", flex: "1", fontFamily: "'Futura', 'Trebuchet MS', sans-serif", backgroundColor: "black", color: "white" }}
                    className="rounded-full border-2 border-black font-semibold transition-all duration-300 hover:opacity-70"
                  >
                    PLAY
                  </button>
                  <button
                    onClick={() => onEdit(timer)}
                    style={{ fontSize: "18px", paddingLeft: "32px", paddingRight: "32px", paddingTop: "12px", paddingBottom: "12px", flex: "1", fontFamily: "'Futura', 'Trebuchet MS', sans-serif" }}
                    className="rounded-full border-2 border-black bg-transparent font-semibold transition-all duration-300 text-black hover:opacity-70"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => onDelete(timer)}
                    style={{ fontSize: "18px", paddingLeft: "32px", paddingRight: "32px", paddingTop: "12px", paddingBottom: "12px", flex: "1", fontFamily: "'Futura', 'Trebuchet MS', sans-serif" }}
                    className="rounded-full border-2 border-black bg-transparent font-semibold transition-all duration-300 text-black hover:opacity-70"
                  >
                    DELETE
                  </button>
                </div>
                <div style={{ height: "2px", backgroundColor: "black", marginTop: "16px", marginLeft: "40px", marginRight: "40px" }}></div>
              </div>
            );
          })}
        </div>
    </div>
  );
}

