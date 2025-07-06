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
  const streetViewRef = useRef(null);

  // Simple handler that just logs - actual functionality moved to BottomBar
  const handleGuessSubmit = () => {
    console.log('Guess submitted from sidebar/other components');
  };

  return (
    <>
      <StreetView ref={streetViewRef} />
      <TVStatic ref={tvStaticRef} />
      <Sidebar gameProgress={gameProgress} onGuessSubmit={handleGuessSubmit} />
      <TopBar gameProgress={gameProgress} />
      <BottomBar tvStaticRef={tvStaticRef} streetViewRef={streetViewRef} />
      <PWAUpdater />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '8px',
            minWidth: '280px',
            width: '100%',
            maxWidth: '320px',
            fontSize: '1.25rem',
          }
        }}
      />
    </>
  )
}

export default App
