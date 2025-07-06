import StreetView from './components/StreetView'
import './index.css'
import Sidebar from '@components/Sidebar'
import TopBar from '@components/TopBar'
import { gameProgress } from '@data/gameProgress'
import BottomBar from './components/BottomBar'

function App() {
  return (
    <>
      <StreetView />
      <Sidebar gameProgress={gameProgress} />
      <TopBar gameProgress={gameProgress} />
      <BottomBar />
    </>
  )
}

export default App
