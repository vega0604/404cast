import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import styles from '@styles/components/tvstatic.module.css';

const TVStatic = forwardRef((_, ref) => {
    const canvasRef = useRef(null);
    const [transitionState, setTransitionState] = useState('gameStart'); // 'gameStart', 'hidden', 'roundTransition'
    const squareGridRef = useRef([]);
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        startRoundTransition: () => {
            setTransitionState('roundTransition');
            startTimeRef.current = Date.now();
        },
        hide: () => {
            setTransitionState('hidden');
        }
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const squareSize = 80; // Bigger squares
        
        // Colors matching sidebar theme (solid colors for full opacity)
        const colors = [
            '#2C336D', // Sidebar gradient start
            '#233D5F', // Sidebar gradient end
            '#2D5987', // Border color
            '#215767', // Hover color
            '#1E2951', // Darker variations
            '#1A2A4A',
            '#263459'
        ];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Initialize square grid
            const cols = Math.ceil(canvas.width / squareSize);
            const rows = Math.ceil(canvas.height / squareSize);
            const grid = [];
            
            for (let i = 0; i < cols; i++) {
                grid[i] = [];
                for (let j = 0; j < rows; j++) {
                    grid[i][j] = {
                        x: i * squareSize,
                        y: j * squareSize,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        visible: true,
                        fadeStartTime: Math.random() * 1500 + 500, // Random start time between 0.5-2 seconds
                        fadeDuration: Math.random() * 1000 + 800 // Random fade duration between 0.8-1.8 seconds
                    };
                }
            }
            squareGridRef.current = grid;
        };

        const drawFrame = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (transitionState === 'hidden') {
                return; // Don't draw anything
            }

            const currentTime = Date.now();
            const elapsed = startTimeRef.current ? currentTime - startTimeRef.current : 0;
            
            console.log('Drawing frame:', { transitionState, elapsed, gridLength: squareGridRef.current.length });

            squareGridRef.current.forEach(column => {
                column.forEach(square => {
                    let shouldDraw = false;
                    let opacity = 1;

                    if (transitionState === 'gameStart') {
                        // Game start: each square fades at its own time
                        if (elapsed < square.fadeStartTime) {
                            // Square hasn't started fading yet
                            shouldDraw = true;
                            opacity = 1;
                        } else if (elapsed < square.fadeStartTime + square.fadeDuration) {
                            // Square is currently fading
                            shouldDraw = true;
                            const fadeProgress = (elapsed - square.fadeStartTime) / square.fadeDuration;
                            opacity = Math.max(0, 1 - fadeProgress);
                        } else {
                            // Square has finished fading
                            shouldDraw = false;
                        }
                    } else if (transitionState === 'roundTransition') {
                        if (elapsed < 1000) {
                            // First 1 second: all squares visible with slight flicker
                            shouldDraw = true;
                            opacity = Math.random() > 0.05 ? 1 : 0.7; // Subtle flicker
                        } else if (elapsed < 2000) {
                            // Next 1 second: full screen solid
                            shouldDraw = true;
                            opacity = 1;
                        } else {
                            // After 2 seconds: each square fades at its own time
                            const roundFadeStart = elapsed - 2000;
                            if (roundFadeStart < square.fadeStartTime) {
                                // Square hasn't started fading yet
                                shouldDraw = true;
                                opacity = 1;
                            } else if (roundFadeStart < square.fadeStartTime + square.fadeDuration) {
                                // Square is currently fading
                                shouldDraw = true;
                                const fadeProgress = (roundFadeStart - square.fadeStartTime) / square.fadeDuration;
                                opacity = Math.max(0, 1 - fadeProgress);
                            } else {
                                // Square has finished fading
                                shouldDraw = false;
                            }
                        }
                    }

                    if (shouldDraw && opacity > 0.01) { // Avoid drawing nearly transparent squares that cause glitches
                        // Apply opacity to the color - ensure we have valid hex color
                        if (square.color && square.color.startsWith('#') && square.color.length === 7) {
                            const r = parseInt(square.color.slice(1, 3), 16);
                            const g = parseInt(square.color.slice(3, 5), 16);
                            const b = parseInt(square.color.slice(5, 7), 16);
                            
                            // Ensure RGB values are valid numbers
                            if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
                                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, opacity))})`;
                                ctx.fillRect(square.x, square.y, squareSize, squareSize);
                            }
                        }
                    }
                });
            });

            // Auto-hide after transitions complete
            if (transitionState === 'gameStart' && elapsed > 4500) {
                setTransitionState('hidden');
            } else if (transitionState === 'roundTransition' && elapsed > 6000) {
                setTransitionState('hidden');
            }
        };

        resizeCanvas();
        startTimeRef.current = Date.now();
        
        // Animation loop
        const animate = () => {
            drawFrame();
            animationRef.current = requestAnimationFrame(animate);
        };
        animate();
        
        // Handle resize
        window.addEventListener('resize', resizeCanvas);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [transitionState]);

    return (
        <canvas
            ref={canvasRef}
            className={styles.tvStatic}
        />
    );
});

TVStatic.displayName = 'TVStatic';

export default TVStatic;