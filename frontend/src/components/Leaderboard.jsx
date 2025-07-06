import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from '@styles/components/leaderboard.module.css';
import cancel from '@assets/images/icons/cancel.svg'

const Leaderboard = ({ isOpen, onOpenChange }) => {
    const [leaderboardData, setLeaderboardData] = useState([]);
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
            // First, try to load from cache
            const cachedData = localStorage.getItem('leaderboardCache');
            const cacheTimestamp = localStorage.getItem('leaderboardCacheTimestamp');
            const now = Date.now();
            const cacheAge = now - (parseInt(cacheTimestamp) || 0);
            const cacheValid = cacheAge < 5 * 60 * 1000; // 5 minutes cache

            if (cachedData && cacheValid) {
                const parsedData = JSON.parse(cachedData);
                setLeaderboardData(Array.isArray(parsedData) ? parsedData : []);
                setIsLoading(false);
                return;
            }

            // Fetch fresh data from API
            const baseURL = import.meta.env.VITE_BACKEND_BASE;
            const response = await fetch(`${baseURL}/leaderboards`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const leaderboardArray = Array.isArray(data.leaderboard) ? data.leaderboard : [];
            
            // Cache the data
            localStorage.setItem('leaderboardCache', JSON.stringify(leaderboardArray));
            localStorage.setItem('leaderboardCacheTimestamp', now.toString());
            
            setLeaderboardData(leaderboardArray);
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
            
            // Try to use cached data even if expired
            const cachedData = localStorage.getItem('leaderboardCache');
            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                setLeaderboardData(Array.isArray(parsedData) ? parsedData : []);
            } else {
                setLeaderboardData([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderLeaderboardItem = (item, index) => (
        <div key={item._id || index} className={styles.leaderboard_item}>
            <div className={styles.rank}>#{index + 1}</div>
            <div className={styles.player_info}>
                <div className={styles.player_name}>{item.fullname}</div>
                <div className={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</div>
            </div>
            <div className={styles.score}>{item.score.toLocaleString()}</div>
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
                            <h3 className={styles.section_title}>Least likely to get 404'd</h3>
                            <div className={styles.leaderboard_list}>
                                {isLoading ? (
                                    <div className={styles.loading}>Loading...</div>
                                ) : leaderboardData.length > 0 ? (
                                    leaderboardData.slice(0, 10).map((item, index) => 
                                        renderLeaderboardItem(item, index)
                                    )
                                ) : (
                                    <div className={styles.empty_state}>No scores yet</div>
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