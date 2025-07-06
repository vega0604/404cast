import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from '@styles/components/username-modal.module.css';

const UsernameModal = ({ isOpen, onUsernameSubmit }) => {
    const [username, setUsername] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            setIsSubmitting(true);
            onUsernameSubmit(username.trim());
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && username.trim()) {
            handleSubmit(e);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={() => {}}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content className={styles.content}>
                    <Dialog.Title className={styles.title}>
                        Game Complete!
                    </Dialog.Title>
                    
                    <p className={styles.description}>
                        Enter your name to save your score to the leaderboard and start a new game.
                    </p>
                    
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter your name..."
                            className={styles.input}
                            autoFocus
                            maxLength={20}
                            required
                        />
                        
                        <button 
                            type="submit" 
                            className={styles.submit_button}
                            disabled={!username.trim() || isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Score & Continue'}
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default UsernameModal; 