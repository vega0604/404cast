import { useEffect, useRef, useState } from 'react';

const AudioPlayer = ({ audioSrc, autoPlay = true, loop = true, volume = 0.3, isMuted = false }) => {
    const audioRef = useRef(null);
    const [playAttempted, setPlayAttempted] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleCanPlay = () => {
            console.log('Audio can play, attempting autoplay...');
            if (autoPlay && !playAttempted) {
                setPlayAttempted(true);
                audio.play()
                    .then(() => {
                        console.log('Audio started successfully');
                    })
                    .catch((error) => {
                        console.log('Autoplay blocked by browser:', error);
                        console.log('User interaction required to start audio');
                    });
            }
        };

        const handleLoadStart = () => {
            console.log('Audio loading started');
        };

        const handleLoaded = () => {
            console.log('Audio loaded successfully');
        };

        const handleError = (e) => {
            console.error('Audio loading error:', e);
        };

        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('loadstart', handleLoadStart);
        audio.addEventListener('loadeddata', handleLoaded);
        audio.addEventListener('error', handleError);

        // Set initial volume
        audio.volume = volume;
        console.log('Audio component initialized with src:', audioSrc);

        return () => {
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('loadstart', handleLoadStart);
            audio.removeEventListener('loadeddata', handleLoaded);
            audio.removeEventListener('error', handleError);
        };
    }, [audioSrc, autoPlay, volume, playAttempted]);

    // Handle mute/unmute
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isMuted) {
            audio.pause();
            console.log('Audio muted');
        } else if (playAttempted) {
            audio.play().catch((error) => {
                console.log('Could not resume audio:', error);
            });
            console.log('Audio unmuted');
        }
    }, [isMuted, playAttempted]);

    useEffect(() => {
        const startAudioOnInteraction = () => {
            const audio = audioRef.current;
            if (audio && audio.paused) {
                audio.play().then(() => {
                    console.log('Audio started after user interaction');
                }).catch(console.error);
            }
        };

        document.addEventListener('click', startAudioOnInteraction, { once: true });
        
        return () => {
            document.removeEventListener('click', startAudioOnInteraction);
        };
    }, []);

    return (
        <audio
            ref={audioRef}
            src={audioSrc}
            loop={loop}
            preload="auto"
            style={{ display: 'none' }}
        />
    );
};

export default AudioPlayer;