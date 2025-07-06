import { useRef, useEffect, useState } from 'react'
import StreetView from './components/StreetView'
import './index.css'
import Sidebar from '@components/Sidebar'
import TopBar from '@components/TopBar'
import TVStatic from '@components/TVStatic'
import BottomBar from './components/BottomBar'
import PWAUpdater from './components/PWAUpdater'
import { Toaster, toast } from 'sonner'

function App() {

    const tvStaticRef = useRef(null);
    const streetViewRef = useRef(null);
    const baseURL = import.meta.env.VITE_BACKEND_BASE;
    const [leaderboard, setLeaderboard] = useState([])
    const [gameHistory, setGameHistory] = useState([]);
    const [currentGame, setCurrentGame] = useState({
        datetime: new Date(),
        user_name: null,
        rounds: []
    })

    const [currentRound, setCurrentRound] = useState({
        location: null,
        score: null,
        answer: null,
        guess: null
    })

    const [roundStreak, setRoundStreak] = useState(0);
    const [roundStartTime, setRoundStartTime] = useState(Date.now())

    useEffect(() => {
        function loadGameHistory() {
            let gameHistString = localStorage.getItem('gameHistory');
            console.log('Loading game history:', gameHistString)
            let gameHist = JSON.parse(gameHistString) || [];
            if (gameHist.length > 0){
                setCurrentGame(prev => ({
                    ...prev, 
                    user_name: gameHist[gameHist.length-1].user_name
                }))
            }
            setGameHistory(gameHist)
        }

        function loadLeaderboards(){
            fetch(`${baseURL}/leaderboards`, {
                method: 'GET',
                headers: {
                    'Accepts': 'application/json'
                },
                mode: 'cors'
            }).then(res => res.json())
            .then(json => setLeaderboard(json))
            .catch(err => console.error(err))
        }

        loadGameHistory()
        loadLeaderboards()
    }, [])


    function updateLeaderboards(game){
        let date = game.datetime
        let name = game.user_name
        let score = game.rounds.reduce((prev, curr) => prev + curr.score)

        fetch(`${baseURL}/leaderboards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({date, name, score}),
            mode: 'cors'
        }).then(res => res.json())
        .then(json => setLeaderboard(json))
        .catch(err => console.error(err))
    }

    function startNewGame() {
        // Save current game to history if it has rounds
        if (currentGame.rounds.length > 0) {
            const updatedHistory = [...gameHistory, currentGame];
            setGameHistory(updatedHistory);
            localStorage.setItem('gameHistory', JSON.stringify(updatedHistory));
            
            // Update leaderboards
            updateLeaderboards(currentGame);
        }
        
        // Start the TV static transition
        if (tvStaticRef?.current) {
            tvStaticRef.current.startRoundTransition(() => {
                // This callback runs when the screen is mostly covered by transition
                console.log('🎬 Screen covered, starting new game...');
                
                // Reset for new game
                setCurrentGame({
                    datetime: new Date(),
                    user_name: currentGame.user_name,
                    rounds: []
                });
                
                // Reset current round to trigger new location generation
                setCurrentRound({
                    location: null,
                    score: null,
                    answer: null,
                    guess: null
                });
                
                // Reset round streak and start time
                setRoundStreak(0);
                setRoundStartTime(Date.now());
            });
        } else {
            // Fallback if TV static ref is not available
            setCurrentGame({
                datetime: new Date(),
                user_name: currentGame.user_name,
                rounds: []
            });
            
            setCurrentRound({
                location: null,
                score: null,
                answer: null,
                guess: null
            });
            
            setRoundStreak(0);
            setRoundStartTime(Date.now());
        }
        
        toast.info('New game started!', {
            duration: 3000
        });
    }

    useEffect(() => {
        // Only process if we have a completed round (with a score)
        if (currentRound.score !== null) {
            // Add the completed round to the current game
            setCurrentGame(prevGame => {
                const updatedRounds = [...prevGame.rounds, currentRound];
                const updatedGame = { ...prevGame, rounds: updatedRounds };
                
                // Check if we've reached 10 rounds (game complete)
                if (updatedRounds.length >= 10) {
                    // Game is complete - save to history and reset
                    setGameHistory(prevHistory => {
                        const updatedHistory = [...prevHistory, updatedGame];
                        localStorage.setItem('gameHistory', JSON.stringify(updatedHistory));
                        return updatedHistory;
                    });
                    
                    // Update leaderboards
                    updateLeaderboards(updatedGame);
                    
                    // Show game completion toast
                    const totalScore = updatedRounds.reduce((sum, round) => sum + round.score, 0);
                    toast.success(`Game Complete! Total Score: ${totalScore}`, {
                        duration: 5000,
                        description: 'Starting new game...'
                    });
                    
                    // Reset round streak and start time for new game
                    setRoundStreak(0);
                    setRoundStartTime(Date.now());
                    
                    // Return new game state
                    return {
                        datetime: new Date(),
                        user_name: prevGame.user_name,
                        rounds: []
                    };
                } else {
                    // Game continues - return updated game
                    return updatedGame;
                }
            });
            
            // Show round completion feedback
            const roundNumber = currentGame.rounds.length + 1;
            toast.info(`Round ${roundNumber} Complete! Score: ${currentRound.score}`, {
                duration: 3000,
                description: roundNumber < 10 ? `Round ${roundNumber + 1} starting...` : 'Game complete!'
            });
            
            // Reset currentRound for next round - this will trigger StreetView to generate new location
            setCurrentRound({
                location: null,
                score: null,
                answer: null,
                guess: null
            });
            
            // Update round streak and start time for next round
            setRoundStreak(prev => prev + 1);
            setRoundStartTime(Date.now());
        }
    }, [currentRound.score]) // Only trigger when score changes from null to a value

    // Example function to trigger round transition (call this when player clicks guess)

    return (
        <>
            {/* {currentGame.user_name == null && "enter name"} */}

            <StreetView ref={streetViewRef} setCurrentRound={setCurrentRound} currentRound={currentRound}/>
            <TVStatic ref={tvStaticRef} />
            <Sidebar gameHistory={gameHistory} leaderboard={leaderboard} currentGame={currentGame} onNewGame={startNewGame} />
            <TopBar gameProgress={currentGame} currentRound={currentRound} />
            <BottomBar 
                tvStaticRef={tvStaticRef} 
                streetViewRef={streetViewRef} 
                setCurrentRound={setCurrentRound} 
                currentRound={currentRound}
                baseURL={baseURL}
                roundStreak={roundStreak}
                roundStartTime={roundStartTime}
            />
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
