import styles from '@styles/components/bottombar.module.css';
import good from '@assets/images/icons/good.svg';
import bad from '@assets/images/icons/bad.svg';
import * as Slider from '@radix-ui/react-slider';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useState, useEffect, useRef } from 'react';

const BottomBar = ({ tvStaticRef, streetViewRef }) => {
    const [value, setValue] = useState([50]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [goodWiggle, setGoodWiggle] = useState(false);
    const [badWiggle, setBadWiggle] = useState(false);
    const goodWiggleTimeoutRef = useRef(null);
    const badWiggleTimeoutRef = useRef(null);

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

    // Function to trigger round transition and load new location
    const handleGuessSubmit = (event) => {
        event.preventDefault();
        
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        
        // Start the TV static transition with callback for when screen is covered
        if (tvStaticRef?.current) {
            tvStaticRef.current.startRoundTransition(() => {
                // This callback runs when the screen is mostly covered by transition
                console.log('🎬 Screen covered, generating new location...');
                if (streetViewRef?.current) {
                    streetViewRef.current.generateNewLocation();
                }
            });
        }
        
        console.log('🎯 Starting new round with guess value:', value[0]);
        
        // Reset after 4 seconds (extended to account for delayed location change)
        setTimeout(() => setIsSubmitting(false), 4000);
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