import { useState, useEffect, useRef } from 'react'
import './App.css'

type TimerMode = 'work' | 'break' | 'longBreak'

const TIMER_DURATIONS = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
}

function App() {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.work)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const playBeep = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    
    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.5)
  }

  const sendNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/timer.svg' })
    }
  }

  const handleTimerComplete = () => {
    setIsRunning(false)
    playBeep()
    
    if (mode === 'work') {
      const newSessions = sessions + 1
      setSessions(newSessions)
      
      if (newSessions % 4 === 0) {
        setMode('longBreak')
        setTimeLeft(TIMER_DURATIONS.longBreak)
        sendNotification('Time for a long break!', 'You\'ve completed 4 sessions. Take a 15-minute break.')
      } else {
        setMode('break')
        setTimeLeft(TIMER_DURATIONS.break)
        sendNotification('Time for a break!', 'Take a 5-minute break.')
      }
    } else {
      setMode('work')
      setTimeLeft(TIMER_DURATIONS.work)
      sendNotification('Back to work!', 'Start your next Pomodoro session.')
    }
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setMode('work')
    setTimeLeft(TIMER_DURATIONS.work)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((TIMER_DURATIONS[mode] - timeLeft) / TIMER_DURATIONS[mode]) * 100

  const getModeLabel = () => {
    switch (mode) {
      case 'work':
        return 'Work Session'
      case 'break':
        return 'Short Break'
      case 'longBreak':
        return 'Long Break'
    }
  }

  const getModeColor = () => {
    switch (mode) {
      case 'work':
        return 'from-red-500 to-orange-500'
      case 'break':
        return 'from-green-500 to-teal-500'
      case 'longBreak':
        return 'from-blue-500 to-purple-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Pomodoro Timer</h1>
          <p className="text-gray-400">Stay focused, stay productive</p>
        </div>

        <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-700">
          {/* Mode indicator */}
          <div className={`bg-gradient-to-r ${getModeColor()} rounded-2xl p-4 mb-6`}>
            <p className="text-white text-center font-semibold text-lg">{getModeLabel()}</p>
          </div>

          {/* Circular timer */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg className="transform -rotate-90 w-64 h-64">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-700"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                className={`text-transparent bg-clip-text bg-gradient-to-r ${getModeColor()} transition-all duration-1000 ease-linear`}
                style={{
                  stroke: mode === 'work' ? '#ef4444' : mode === 'break' ? '#10b981' : '#8b5cf6',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold text-white">{formatTime(timeLeft)}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-6">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 shadow-lg"
              >
                Start
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 shadow-lg"
              >
                Pause
              </button>
            )}
            <button
              onClick={handleReset}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 shadow-lg"
            >
              Reset
            </button>
          </div>

          {/* Session counter */}
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Completed Sessions</p>
            <div className="flex justify-center gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < sessions % 4 ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-white font-bold text-2xl mt-2">{sessions}</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Nightshift #003 • Built by Obrera
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
