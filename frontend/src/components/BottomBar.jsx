import styles from '@styles/components/bottombar.module.css';
import good from '@assets/images/icons/good.svg';
import bad from '@assets/images/icons/bad.svg';
import * as Slider from '@radix-ui/react-slider';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useState } from 'react';

const BottomBar = () => {
    const [value, setValue] = useState([50]);
    const [isDragging, setIsDragging] = useState(false);

    return (
        <Tooltip.Provider delayDuration={100}>
            <div id={styles.bottombar}>
                <div id={styles.slider_container}>
                    <img src={good} alt="Safe icon"/>
                    <Slider.Root
                        className={styles.slider}
                        value={value}
                        onValueChange={setValue}
                        onValueCommit={() => setIsDragging(false)}
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
                    <img src={bad} alt="Danger icon"/>
                </div>
                <button id={styles.guess_button}>Guess</button>
            </div>
        </Tooltip.Provider>
    );
};

export default BottomBar; 