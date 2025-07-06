import styles from '@styles/components/bottombar.module.css';
import good from '@assets/images/icons/good.svg';
import bad from '@assets/images/icons/bad.svg';
import * as Slider from '@radix-ui/react-slider';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useState, useEffect, useRef } from 'react';

const BottomBar = ({ tvStaticRef, streetViewRef, setCurrentRound, currentRound, baseURL, roundStreak, roundStartTime}) => {
    const [value, setValue] = useState([50]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [goodWiggle, setGoodWiggle] = useState(false);
    const [badWiggle, setBadWiggle] = useState(false);
    const goodWiggleTimeoutRef = useRef(null);
    const badWiggleTimeoutRef = useRef(null);

    // Reset slider to 50 when currentRound changes (new round starts)
    useEffect(() => {
        setValue([50]);
    }, [currentRound?.location]);

    const handleSliderValueChange = (newValue) => {
        setValue(newValue);
        
        const currentValue = newValue[0];
        
        // Trigger good icon wiggle when crossing 25% threshold
        if (currentValue <= 25 && !goodWiggle) {
            if (goodWiggleTimeoutRef.current) clearTimeout(goodWiggleTimeoutRef.current);
            
            setGoodWiggle(true);
            goodWiggleTimeoutRef.current = setTimeout(() => {
                setGoodWiggle(false);
                goodWiggleTimeoutRef.current = null;
            }, 800);
        } else if (currentValue > 25) {
            setGoodWiggle(false);
            if (goodWiggleTimeoutRef.current) {
                clearTimeout(goodWiggleTimeoutRef.current);
                goodWiggleTimeoutRef.current = null;
            }
        }
        
        // Trigger bad icon wiggle when crossing 75% threshold
        if (currentValue >= 75 && !badWiggle) {
            if (badWiggleTimeoutRef.current) clearTimeout(badWiggleTimeoutRef.current);
            
            setBadWiggle(true);
            badWiggleTimeoutRef.current = setTimeout(() => {
                setBadWiggle(false);
                badWiggleTimeoutRef.current = null;
            }, 800);
        } else if (currentValue < 75) {
            setBadWiggle(false);
            if (badWiggleTimeoutRef.current) {
                clearTimeout(badWiggleTimeoutRef.current);
                badWiggleTimeoutRef.current = null;
            }
        }
    };

    useEffect(() => {
        return () => {
            if (goodWiggleTimeoutRef.current) {
                clearTimeout(goodWiggleTimeoutRef.current);
            }
            if (badWiggleTimeoutRef.current) {
                clearTimeout(badWiggleTimeoutRef.current);
            }
        };
    }, []);

    // Function to submit guess and wait for score before starting new round
    const handleGuessSubmit = (event) => {
        event.preventDefault();
        
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        
        console.log('🎯 Submitting guess:', value[0]);
        console.log('Current round:', currentRound);
        
        // Check if currentRound and location exist
        if (!currentRound || !currentRound.location) {
            console.error('No location data available');
            setIsSubmitting(false);
            return;
        }
        
        let lat = currentRound.location.lat;
        let long = currentRound.location.long;
        let guess = value[0]; // Use the slider value as the guess
        
        // Submit guess to backend
        const url = new URL(`${baseURL}/scores`);
        url.searchParams.append('lat', lat);
        url.searchParams.append('long', long);
        url.searchParams.append('guess', guess);
        url.searchParams.append('streak', roundStreak);
        url.searchParams.append('time', Date.now() - roundStartTime);

        fetch(url, {
            method: 'GET',
            headers: {
                'Accepts': 'application/json'
            },
            mode: 'cors'
        }).then(res => res.json())
        .then(json => {
            console.log('Score received:', json); 
            
            // Update current round with score (this will trigger the useEffect in App.jsx)
            setCurrentRound({...currentRound, guess, score: json.score, answer: json.answer});
            
            // Start the transition to new round after score is received
            if (tvStaticRef?.current) {
                tvStaticRef.current.startRoundTransition();
            }
            
            // Reset submitting state after transition
            setTimeout(() => setIsSubmitting(false), 2000);
        })
        .catch(err => {
            console.error('Error submitting guess:', err);
            setIsSubmitting(false);
        });
    };

    return (
        <Tooltip.Provider delayDuration={100}>
            <div id={styles.bottombar}>
                <div id={styles.slider_container}>
                    <img 
                        src={good} 
                        alt="Safe icon"
                        className={goodWiggle ? styles.wiggle : ''}
                    />
                    <Slider.Root
                        className={styles.slider}
                        value={value}
                        onValueChange={handleSliderValueChange}
                        onValueCommit={() => {}}
                        max={100}
                        min={0}
                        step={1}
                        aria-label="Risk level"
                    >
                        <Slider.Track className={styles.slider_track}>
                            <Slider.Range className={styles.slider_range} />
                        </Slider.Track>
                        <Tooltip.Root open={true}>
                            <Tooltip.Trigger asChild>
                                <Slider.Thumb className={styles.slider_thumb} />
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Content className={styles.tooltip_content} sideOffset={5}>
                                    {value[0]}%
                                    <Tooltip.Arrow className={styles.tooltip_arrow} />
                                </Tooltip.Content>
                            </Tooltip.Portal>
                        </Tooltip.Root>
                    </Slider.Root>
                    <img 
                        src={bad} 
                        alt="Danger icon"
                        className={badWiggle ? styles.wiggle : ''}
                    />
                </div>
                <button 
                    id={styles.guess_button}
                    onClick={handleGuessSubmit}
                    disabled={isSubmitting}
                    type="button"
                >
                    {isSubmitting ? 'Loading...' : 'Guess'}
                </button>
            </div>
        </Tooltip.Provider>
    );
};

export default BottomBar; 