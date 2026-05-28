export interface Exercise {
  id: string;
  name: string;
  duration: number; // in seconds
  restAfter: number; // in seconds
  color?: string; // hex color code
}

export interface Timer {
  id: string;
  name: string;
  sets: number;
  exercises: Exercise[];
  createdAt: number;
  updatedAt: number;
}

export interface TimerState {
  currentSet: number;
  currentExerciseIndex: number;
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  inRest: boolean; // Track if currently in rest period
}
