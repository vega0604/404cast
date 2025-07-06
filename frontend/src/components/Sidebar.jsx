import styles from '@styles/components/sidebar.module.css';
import hat from '@assets/images/logos/hat.svg';
import logo from '@assets/images/logos/logo.svg';
import sidebar from '@assets/images/icons/sidebar.svg';
import play from '@assets/images/icons/play.svg';
import leaderboard from '@assets/images/icons/leaderboard.svg';
import heart from '@assets/images/icons/heart.svg';
import { useState, useEffect } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import Leaderboard from './Leaderboard';

const Sidebar = ({ gameHistory, currentGame, onNewGame }) => {
    const [likeCount, setLikeCount] = useState(() => {
        const cached = localStorage.getItem('likeCount');
        return cached ? parseInt(cached, 10) : 0;
    });
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipTimeout, setTooltipTimeout] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

    useEffect(() => {
        fetchLikesCount();
        
    }, []);
    const baseURL = import.meta.env.VITE_BACKEND_BASE;

    const fetchLikesCount = async () => {
        const url = `${baseURL}/likes`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setLikeCount(data.count);
            localStorage.setItem('likeCount', data.count.toString());
        } catch (error) {
            console.error('Error fetching likes count:', error);
        }
    };

    const handleSidebarToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLikeClick = async () => {
        if (isLoading) return;
        setIsLoading(true);
        console.log(baseURL)
        const url = `${baseURL}/likes/increment`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            setLikeCount(data.count);
            localStorage.setItem('likeCount', data.count.toString());
            setShowTooltip(true);
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            const newTimeout = setTimeout(() => setShowTooltip(false), 750);
            setTooltipTimeout(newTimeout);

        } catch (error) {
            console.error('Error incrementing likes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <nav id={styles.sidebar} className={isCollapsed ? styles.collapsed : ''}>
            <div id={styles.header} className={isCollapsed ? styles.collapsed_header : ''}>
                <div id={styles.logo_container}>
                    <img id={styles.hat} src={hat} alt="hat" />
                    <img id={styles.logo} src={logo} alt="logo" />
                    <h1>404cast</h1>
                </div>
                <img id={styles.sidebar_toggle} src={sidebar} alt="sidebar" onClick={handleSidebarToggle} />
            </div>

            {!isCollapsed && (
                <>
                    <div id={styles.actions}>
                        <div className={styles.action} onClick={onNewGame}>
                            <img src={play} alt="Play icon" />
                            <h2>New Game</h2>
                        </div>
                        <div className={styles.action} onClick={() => setIsLeaderboardOpen(true)}>
                            <img src={leaderboard} alt="Leaderboard icon" />
                            <h2>Leaderboard</h2>
                        </div>
                    </div>

                    <div id={styles.game_progress}>
                        {/* Show current game if it has rounds, otherwise show most recent completed game */}
                        {currentGame && currentGame.rounds.length > 0 ? (
                            <>
                                <h3 id={styles.session_header}>Current Game</h3>
                                {currentGame.rounds.map((round, index) => (
                                    <div key={`current-${index}`} className={`${styles.round} ${round.score === null ? styles.active : ''}`}>
                                        <div className={styles.round_number}>{index + 1}</div>
                                        <div className={styles.location_name}>{round.location?.description || 'Unknown location'}</div>
                                        {round.score !== null && (
                                            <div
                                                className={styles.round_score}
                                                style={{
                                                    backgroundColor: `hsla(${Math.max(0, Math.min(125, (round.score / 100) * 125))}, 51%, 27%, 1)`
                                                }}
                                            >
                                                {round.score}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </>
                        ) : gameHistory.length > 0 ? (
                            <>
                                <h3 id={styles.session_header}>Last Game - {new Date(gameHistory[gameHistory.length - 1].datetime).toLocaleDateString()}</h3>
                                {gameHistory[gameHistory.length - 1].rounds.map((round, index) => (
                                    <div key={`history-${index}`} className={styles.round}>
                                        <div className={styles.round_number}>{index + 1}</div>
                                        <div className={styles.location_name}>{round.location?.description || 'Unknown location'}</div>
                                        {round.score !== null && (
                                            <div
                                                className={styles.round_score}
                                                style={{
                                                    backgroundColor: `hsla(${Math.max(0, Math.min(125, (round.score / 100) * 125))}, 51%, 27%, 1)`
                                                }}
                                            >
                                                {round.score}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--light_50)' }}>
                                No games played yet
                            </div>
                        )}
                    </div>

                    <footer>
                        <p id={styles.credits}>
                            <span>Made with</span>
                            <span id={styles.emoji}>🕵️</span>
                        </p>
                        <div id={styles.like_container}>
                            <div>{likeCount}</div>
                            <Tooltip.Provider>
                                <Tooltip.Root open={showTooltip}>
                                    <Tooltip.Trigger asChild>
                                        <img src={heart} alt="Like button" onClick={handleLikeClick} />
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                        <Tooltip.Content
                                            className={styles.tooltip}
                                            sideOffset={5}
                                        >
                                            &lt;3
                                            <Tooltip.Arrow className={styles.tooltip_arrow} />
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                            </Tooltip.Provider>
                        </div>
                    </footer>
                </>
            )}
            
            <Leaderboard 
                isOpen={isLeaderboardOpen} 
                onOpenChange={setIsLeaderboardOpen} 
            />
        </nav>
    );
};

export default Sidebar;
