# Workout Timer App

A Next.js web application for creating and running custom circuit workout timers. Users can define sets, exercises, and time periods, save timers for future use, and run timers with audio/visual feedback.

## Features

✅ **Create Custom Timers**: Define sets, exercises, and time periods for your workouts
✅ **Save Timers**: All timers are automatically saved to browser local storage
✅ **Run Timers**: Play timers with countdown functionality
✅ **Edit & Delete**: Modify existing timers or remove them
✅ **Responsive Design**: Works seamlessly on mobile and desktop
✅ **Visual Feedback**: Real-time display of current set, exercise, and remaining time

## Tech Stack

- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Storage**: Browser Local Storage
- **Build**: Turbopack for fast compilation

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Build

Create an optimized production build:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main app page
├── components/
│   ├── TimerForm.tsx        # Component for creating/editing timers
│   ├── TimerList.tsx        # Component for displaying saved timers
│   └── TimerDisplay.tsx     # Component for running the timer
├── hooks/
│   └── useTimerStorage.ts   # Custom hook for local storage management
└── types/
    └── timer.ts             # TypeScript interfaces for timer data
```

## How to Use

1. **Create a Timer**:
   - Click "Create New Timer"
   - Enter a name for your workout
   - Set the number of sets
   - Add exercises with duration and rest periods
   - Click "Create Timer"

2. **View Saved Timers**:
   - All created timers are displayed on the home screen
   - Each timer card shows total time, number of sets, and exercises

3. **Run a Timer**:
   - Click the "Play" button on any timer
   - Use Start/Resume/Pause buttons to control the timer
   - Use Reset to stop and restart from the beginning

4. **Edit or Delete**:
   - Click "Edit" to modify a timer
   - Click "Delete" to remove a timer from your library

## Data Persistence

All timers are stored in browser local storage, so they persist across browser sessions. The data includes:
- Timer name and metadata
- Sets and exercises configuration
- Creation and update timestamps

## Deployment to Vercel

This app is ready to deploy to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Choose the repository and let Vercel auto-detect the Next.js framework
4. Click "Deploy"

The app will be automatically deployed and will update with each push to your repository.

## Development Guidelines

- Use TypeScript for type safety
- Follow Next.js best practices
- Implement responsive design with Tailwind CSS
- Use React hooks for state management
- Store timer data in browser local storage

## License

MIT
