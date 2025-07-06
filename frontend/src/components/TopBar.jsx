import { useState } from 'react';
import styles from '@styles/components/topbar.module.css';
import help from '@assets/images/icons/help.svg'
import speaker from '@assets/images/icons/speaker.svg'
import speaker_muted from '@assets/images/icons/speaker_muted.svg'
import AudioPlayer from '@components/AudioPlayer'
import { toast } from 'sonner'

const TopBar = ({ gameProgress }) => {
    const [isMusicOn, setIsMusicOn] = useState(true);

    const toggleMusic = () => {
        setIsMusicOn(!isMusicOn);
    };

    const handleHelpClick = () => {
        toast('Estimate the % chance of a violent abduction here!', {
            duration: 5000,
            position: 'bottom-center',
            className: styles.help_toast
        });
    };

    return (
        <>
            <header id={styles.topbar}>
                <button 
                    className={styles.misc_button}
                    onClick={handleHelpClick}
                    aria-label="Help"
                >
                    <img src={help} alt="Help icon" />
                </button>
                <button 
                    className={styles.misc_button}
                    onClick={toggleMusic}
                    aria-label={isMusicOn ? "Mute music" : "Unmute music"}
                    aria-pressed={!isMusicOn}
                >
                    <img 
                        src={isMusicOn ? speaker : speaker_muted} 
                        alt={isMusicOn ? "Music playing" : "Music muted"}
                    />
                </button>
                <div id={styles.progress_card}>
                    <div className={styles.location}>
                        <div className={styles.label}>Location</div>
                        {gameProgress.rounds.find(round => round.score === null)?.location || gameProgress.rounds[gameProgress.rounds.length - 1]?.location}
                    </div>
                    <div className={styles.round}>
                        <div className={styles.label}>Round</div>
                        {gameProgress.rounds.find(round => round.score === null)?.round || gameProgress.rounds.length} / 10
                    </div>
                    <div className={styles.points}>
                        <div className={styles.label}>Points</div>
                        {gameProgress.rounds
                            .filter(round => round.score !== null)
                            .reduce((sum, round) => sum + round.score, 0)
                            .toLocaleString('en-US')}
                    </div>
                </div>
            </header>
            <AudioPlayer 
                audioSrc="/assets/audio/background-music.mp3" 
                isMuted={!isMusicOn}
            />
        </>
    );
};

export default TopBar; 