import styles from '@styles/components/sidebar.module.css';
import hat from '@assets/images/logos/hat.svg';
import logo from '@assets/images/logos/logo.svg';
import sidebar from '@assets/images/icons/sidebar.svg';
import play from '@assets/images/icons/play.svg';
import leaderboard from '@assets/images/icons/leaderboard.svg';
import heart from '@assets/images/icons/heart.svg';
import { useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

const Sidebar = () => {
  const [likeCount, setLikeCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTimeout, setTooltipTimeout] = useState(null);

  const handleLikeClick = () => {
    setLikeCount(prevCount => prevCount + 1);
    setShowTooltip(true);
    
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    
    const newTimeout = setTimeout(() => setShowTooltip(false), 750);
    setTooltipTimeout(newTimeout);
  };
  
  return (
    <nav id={styles.sidebar}>
        <div id={styles.header}>
            <div id={styles.logo_container}>
                <img id={styles.hat} src={hat} alt="hat" />
                <img id={styles.logo} src={logo} alt="logo" />
                <h1>404cast</h1>
            </div>
            <img id={styles.sidebar_toggle} src={sidebar} alt="sidebar" />
        </div>

        <div id={styles.actions}>
            <div className={styles.action}>
                <img src={play} alt="Play icon"/>
                <h2>New Game</h2>
            </div>
            <div className={styles.action}>
                <img src={leaderboard} alt="Leaderboard icon"/>
                <h2>Leaderboard</h2>
            </div>
        </div>

        <div id={styles.game_progress}>

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
                    <img src={heart} alt="Like button" onClick={handleLikeClick}/>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content 
                      className={styles.tooltip}
                      sideOffset={5}
                    >
                      &lt;3
                      <Tooltip.Arrow className={styles.tooltipArrow} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
        </footer>
    </nav>
  );
};

export default Sidebar;
