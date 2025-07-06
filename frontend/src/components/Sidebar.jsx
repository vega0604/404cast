import styles from '@styles/components/sidebar.module.css';
import hat from '@assets/images/logos/hat.svg';
import logo from '@assets/images/logos/logo.svg';
import sidebar from '@assets/images/icons/sidebar.svg';
import play from '@assets/images/icons/play.svg';
import leaderboard from '@assets/images/icons/leaderboard.svg';
import heart from '@assets/images/icons/heart.svg';
import { useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

const gameProgress = {
    sessionDate: "Sat, Jul 5 | 12:38 AM",
    rounds: [
        { round: 1, location: "Jane & Finch", score: 64 },
        { round: 2, location: "Kensington Marketlol", score: 82 },
        { round: 3, location: "Bloor West Village", score: 100 },
        { round: 4, location: "Trinity-Bellwoods", score: 45 },
        { round: 5, location: "Little Portugal", score: 58 },
        { round: 6, location: "Regent Park", score: 7 },
        { round: 7, location: "Roncesvalles", score: 0 },
        { round: 8, location: "Briar Hill-Belgravia", score: null }
    ]
};

const Sidebar = () => {
    const [likeCount, setLikeCount] = useState(0);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipTimeout, setTooltipTimeout] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleSidebarToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLikeClick = () => {
        setLikeCount(prevCount => prevCount + 1);
        setShowTooltip(true);

        if (tooltipTimeout) clearTimeout(tooltipTimeout);

        const newTimeout = setTimeout(() => setShowTooltip(false), 750);
        setTooltipTimeout(newTimeout);
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
                        <div className={styles.action}>
                            <img src={play} alt="Play icon" />
                            <h2>New Game</h2>
                        </div>
                        <div className={styles.action}>
                            <img src={leaderboard} alt="Leaderboard icon" />
                            <h2>Leaderboard</h2>
                        </div>
                    </div>

                    <div id={styles.game_progress}>
                        <h3 id={styles.session_header}>{gameProgress.sessionDate}</h3>
                        {gameProgress.rounds.map((round, index) => (
                            <div key={index} className={`${styles.round} ${round.score === null ? styles.active : ''}`}>
                                <div className={styles.round_number}>{round.round}</div>
                                <div className={styles.location_name}>{round.location}</div>
                                {round.score !== null && (
                                    <div className={styles.round_score}>
                                        {round.score}
                                    </div>
                                )}
                            </div>
                        ))}
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
        </nav>
    );
};

export default Sidebar;
