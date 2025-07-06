import { useRef } from 'react'
import StreetView from './components/StreetView'
import './index.css'
import Sidebar from '@components/Sidebar'
import TopBar from '@components/TopBar'
import TVStatic from '@components/TVStatic'
import { gameProgress } from '@data/gameProgress'
import BottomBar from './components/BottomBar'
import PWAUpdater from './components/PWAUpdater'
import { Toaster } from 'sonner'

function App() {
  const tvStaticRef = useRef(null);

  // Example function to trigger round transition (call this when player clicks guess)
  const handleGuessSubmit = () => {
    if (tvStaticRef.current) {
      tvStaticRef.current.startRoundTransition();
    }
    // Add your guess submission logic here
  };

  return (
    <>
      <StreetView />
      <TVStatic ref={tvStaticRef} />
      <Sidebar gameProgress={gameProgress} onGuessSubmit={handleGuessSubmit} />
      <TopBar gameProgress={gameProgress} />
      <BottomBar />
      <PWAUpdater />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            minWidth: '280px',
            maxWidth: '320px'
          }
        }}
      />
    </>
  )
}

export default App
