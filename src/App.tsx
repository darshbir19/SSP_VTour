import { useState } from 'react'
import { HomePage } from './components/HomePage'
import { MapTour } from './components/MapTour'

type ViewMode = 'home' | 'map'

export function App() {
  const [view, setView] = useState<ViewMode>('home')

  return (
    <div className="h-screen w-screen bg-ssp-bg text-slate-100">
      {view === 'home' ? (
        <HomePage onStart={() => setView('map')} />
      ) : (
        <MapTour onBack={() => setView('home')} />
      )}
    </div>
  )
}

