import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from '@styles/components/leaderboard.module.css';
import cancel from '@assets/images/icons/cancel.svg'

const Leaderboard = ({ isOpen, onOpenChange }) => {
    const [leaderboardData, setLeaderboardData] = useState({
        mostLikely: [],
        leastLikely: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                fetchLeaderboardData();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const fetchLeaderboardData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/leaderboards');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            setLeaderboardData({
                mostLikely: Array.isArray(data.mostLikely) ? data.mostLikely : [],
                leastLikely: Array.isArray(data.leastLikely) ? data.leastLikely : []
            });
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);

            setLeaderboardData({
                mostLikely: [],
                leastLikely: []
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderLeaderboardItem = (item, index) => (
        <div key={item.id} className={styles.leaderboard_item}>
            <div className={styles.rank}>#{index + 1}</div>
            <div className={styles.player_info}>
                <div className={styles.player_name}>{item.playerName}</div>
                <div className={styles.location}>{item.location}</div>
            </div>
            <div className={styles.score}>{item.score}</div>
        </div>
    );

    if (!isOpen) {
        return null;
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content className={styles.content}>
                    <Dialog.Title className={styles.title}>Leaderboard</Dialog.Title>
                    
                    <div className={styles.leaderboards_container}>
                        <div className={styles.leaderboard_section}>
                            <h3 className={styles.section_title}>Most Likely to be Abducted</h3>
                            <div className={styles.leaderboard_list}>
                                {leaderboardData.mostLikely && leaderboardData.mostLikely.length > 0 ? (
                                    leaderboardData.mostLikely.map((item, index) => 
                                        renderLeaderboardItem(item, index)
                                    )
                                ) : (
                                    <div className={styles.empty_state}>No data available</div>
                                )}
                            </div>
                        </div>

                        <div className={styles.leaderboard_section}>
                            <h3 className={styles.section_title}>Least Likely to be Abducted</h3>
                            <div className={styles.leaderboard_list}>
                                {leaderboardData.leastLikely && leaderboardData.leastLikely.length > 0 ? (
                                    leaderboardData.leastLikely.map((item, index) => 
                                        renderLeaderboardItem(item, index)
                                    )
                                ) : (
                                    <div className={styles.empty_state}>No data available</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Dialog.Close asChild>
                        <button className={styles.close_button} aria-label="Close">
                            <img src={cancel} alt="Cancel icon"/>
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default Leaderboard; 