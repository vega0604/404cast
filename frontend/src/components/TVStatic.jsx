import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import styles from '@styles/components/tvstatic.module.css';

const TVStatic = forwardRef((_, ref) => {
    const canvasRef = useRef(null);
    const [transitionState, setTransitionState] = useState('gameStart'); // 'gameStart', 'hidden', 'roundTransition'
    const [roundTransitionType, setRoundTransitionType] = useState('sequential'); // 'sequential', 'random', 'radial'
    const squareGridRef = useRef([]);
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        startRoundTransition: (onScreenCovered) => {
            // Randomly select transition type for round transitions
            const types = ['sequential', 'random', 'radial'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            setRoundTransitionType(randomType);
            setTransitionState('roundTransition');
            startTimeRef.current = Date.now();
            
            // Store callback for when screen is covered
            if (onScreenCovered) {
                const totalSquares = 300; // Approximate for timing calculation
                const screenCoveredTime = (totalSquares * 0.7 * 3) + 150; // 70% coverage + fade duration
                setTimeout(onScreenCovered, Math.max(800, screenCoveredTime)); // At least 800ms
            }
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
            
            // Calculate center for radial transition
            const centerCol = Math.floor(cols / 2);
            const centerRow = Math.floor(rows / 2);
            
            for (let i = 0; i < cols; i++) {
                grid[i] = [];
                for (let j = 0; j < rows; j++) {
                    // Calculate distance from center for radial transition
                    const distanceFromCenter = Math.sqrt(
                        Math.pow(i - centerCol, 2) + Math.pow(j - centerRow, 2)
                    );
                    
                    grid[i][j] = {
                        x: i * squareSize,
                        y: j * squareSize,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        visible: true,
                        
                        // Game start transition (random)
                        fadeStartTime: Math.random() * 1500 + 500, // Random start time between 0.5-2 seconds
                        fadeDuration: Math.random() * 1000 + 800, // Random fade duration between 0.8-1.8 seconds
                        
                        // Round transition timings
                        sequentialIndex: i * rows + j, // Sequential order (left-to-right, top-to-bottom)
                        randomIndex: Math.random(), // Random order
                        radialIndex: distanceFromCenter, // Radial order (center outward)
                        
                        col: i,
                        row: j
                    };
                }
            }
            
            // Sort squares by random index for random transition
            const flatGrid = grid.flat();
            flatGrid.sort((a, b) => a.randomIndex - b.randomIndex);
            flatGrid.forEach((square, index) => {
                square.randomOrder = index;
            });
            
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
                        // Get transition parameters based on type
                        let squareOrder;
                        if (roundTransitionType === 'sequential') {
                            squareOrder = square.sequentialIndex;
                        } else if (roundTransitionType === 'random') {
                            squareOrder = square.randomOrder;
                        } else if (roundTransitionType === 'radial') {
                            squareOrder = square.radialIndex;
                        }
                        
                        // Transition timing configuration
                        const fadeInDelay = 3; // ms between each square fade in
                        const individualFadeDuration = 150; // ms for each square to fade in/out
                        const fullScreenDuration = 800; // ms to stay at full screen
                        
                        // Calculate total squares for normalization
                        const totalSquares = squareGridRef.current.flat().length;
                        const maxOrder = roundTransitionType === 'radial' 
                            ? Math.max(...squareGridRef.current.flat().map(s => s.radialIndex))
                            : totalSquares - 1;
                        
                        // Normalize square order to 0-1 range, then scale to total squares
                        const normalizedOrder = roundTransitionType === 'radial'
                            ? (squareOrder / maxOrder) * totalSquares
                            : squareOrder;
                            
                        const fadeInStartTime = normalizedOrder * fadeInDelay;
                        const fadeInEndTime = fadeInStartTime + individualFadeDuration;
                        const fullScreenEndTime = fadeInEndTime + (totalSquares * fadeInDelay) + fullScreenDuration;
                        const fadeOutStartTime = fullScreenEndTime + (normalizedOrder * fadeInDelay);
                        const fadeOutEndTime = fadeOutStartTime + individualFadeDuration;
                        
                        if (elapsed < fadeInStartTime) {
                            // Square hasn't started fading in yet
                            shouldDraw = false;
                        } else if (elapsed < fadeInEndTime) {
                            // Square is fading in
                            shouldDraw = true;
                            const fadeProgress = (elapsed - fadeInStartTime) / individualFadeDuration;
                            opacity = Math.pow(fadeProgress, 0.5); // Smooth ease-in
                        } else if (elapsed < fadeOutStartTime) {
                            // Square is fully visible (full screen phase)
                            shouldDraw = true;
                            opacity = 1;
                        } else if (elapsed < fadeOutEndTime) {
                            // Square is fading out
                            shouldDraw = true;
                            const fadeProgress = (elapsed - fadeOutStartTime) / individualFadeDuration;
                            opacity = Math.pow(1 - fadeProgress, 0.5); // Smooth ease-out
                        } else {
                            // Square has finished fading out
                            shouldDraw = false;
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
            } else if (transitionState === 'roundTransition') {
                // Calculate when transition should be complete
                const totalSquares = squareGridRef.current.flat().length;
                const fadeInDelay = 3;
                const individualFadeDuration = 150;
                const fullScreenDuration = 800;
                
                const totalTransitionTime = (totalSquares * fadeInDelay * 2) + fullScreenDuration + (individualFadeDuration * 2) + 500; // 500ms buffer
                
                if (elapsed > totalTransitionTime) {
                    setTransitionState('hidden');
                }
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
    }, [transitionState, roundTransitionType]);

    return (
        <canvas
            ref={canvasRef}
            className={styles.tvStatic}
        />
    );
});

TVStatic.displayName = 'TVStatic';

export default TVStatic;