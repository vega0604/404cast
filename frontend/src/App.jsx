import StreetView from './components/StreetView'
import './index.css'
import Sidebar from '@components/Sidebar'
import TopBar from '@components/TopBar'
import { gameProgress } from '@data/gameProgress'

function App() {

  return (
    <>
      <StreetView />
      <Sidebar gameProgress={gameProgress} />
      <TopBar gameProgress={gameProgress} />
    </>
  )
}

export default App
