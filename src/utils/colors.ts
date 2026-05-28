// Bank of 8 vibrant colors
export const VIBRANT_COLORS = [
  "#FF6B6B", // Red
  "#FF8C42", // Sunset Orange
  "#FFE66D", // Banana Yellow
  "#32CD32", // Lime Green
  "#00CED1", // Cyan
  "#00BFFF", // Sky Blue
  "#FF1493", // Magenta
  "#DA70D6", // Light Purple
];

// Get the next color in sequence without repeating until all are used
export function getNextExerciseColor(exerciseIndex: number): string {
  return VIBRANT_COLORS[exerciseIndex % VIBRANT_COLORS.length];
}

// Get a random unused color (ensures no repeats until all used)
export function getRandomUsedColor(usedColors: string[]): string {
  const availableColors = VIBRANT_COLORS.filter(color => !usedColors.includes(color));
  
  // If all colors used, reset to all available
  if (availableColors.length === 0) {
    availableColors.push(...VIBRANT_COLORS);
  }
  
  return availableColors[Math.floor(Math.random() * availableColors.length)];
}

// Get a random unused color from the bank
export function getUnusedColor(usedColors: string[]): string {
  const available = VIBRANT_COLORS.filter(color => !usedColors.includes(color));
  if (available.length === 0) {
    // Reset if all used, pick random from all
    return VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
  }
  return available[Math.floor(Math.random() * available.length)];
}
