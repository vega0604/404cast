import { LoadScript, GoogleMap, StreetViewPanorama } from '@react-google-maps/api';
import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const TORONTO_BOUNDS = {
  north: 43.750000, // Northern boundary (around Lawrence Ave)
  south: 43.620000, // Southern boundary (around Lake Ontario)
  east: -79.300000,  // Eastern boundary (around Victoria Park Ave)
  west: -79.500000   // Western boundary (around Jane St)
};

const StreetView = forwardRef(({ setCurrentRound, currentRound }, ref) => {
  const [center, setCenter] = useState({
    lat: 43.6532,
    lng: -79.3832,
  });

  const [apiReady, setApiReady] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [pov, setPov] = useState({ heading: 0, pitch: 0 }); // Track camera position


  // Generate random coordinates within Toronto's actual boundaries
  const generateRandomTorontoLocation = () => {
    const lat = TORONTO_BOUNDS.south + Math.random() * (TORONTO_BOUNDS.north - TORONTO_BOUNDS.south);
    const lng = TORONTO_BOUNDS.west + Math.random() * (TORONTO_BOUNDS.east - TORONTO_BOUNDS.west);
    
    console.log('🏘️ Generated random Toronto location:', { lat, lng });
    return { lat, lng };
  };

  const [captureDate, setCaptureDate] = useState(null);

  const generateNewLocation = () => {
    console.log('🔄 Generating new location for next round...');
    const newLocation = generateRandomTorontoLocation();
    setCenter(newLocation);
    // Reset camera to default position for new location
    setPov({ heading: 0, pitch: 0 });
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    generateNewLocation
  }));

  // Initialize with a random Toronto location
  useEffect(() => {
    const initialLocation = generateRandomTorontoLocation();
    setCenter(initialLocation);
  }, []);

  // Generate new location when currentRound is reset (location is null)
  useEffect(() => {
    if (currentRound && currentRound.location === null) {
      console.log('🔄 CurrentRound reset, generating new location...');
      generateNewLocation();
    }
  }, [currentRound?.location]);

  useEffect(() => {
    if (!apiReady || !window.google) return;

    const svService = new window.google.maps.StreetViewService();
    svService.getPanorama(
      { location: center, radius: 100 },
      (data, status) => {
        if (status === 'OK') {
          const loc = data.location;
          const actualLat = loc.latLng.lat();
          const actualLng = loc.latLng.lng();
          
          setCurrentRound(prev => {
            // Reset the round and set the new location
            return {
                location: {description: loc.description, lat: actualLat, long: actualLng},
                score: null,
                answer: null,
                guess: null
            }
          });
          
          console.log('📍 Panorama metadata:');
          console.log('LatLng:', loc.latLng.toString());
          console.log('Pano ID:', loc.pano);
          console.log('Street name / description:', loc.description);

          if (data.imageDate) {
            const date = new Date(data.imageDate);
            setCaptureDate(date);
            console.log('Capture date:', date.toLocaleString());
          }
        } else {
          console.warn('No panorama found near this location. Regenerating.');
          // Fallback: use original coordinates
          generateNewLocation();
        }
      }
    );
  }, [apiReady, center]);

  return (
    <>
      <LoadScript
        googleMapsApiKey={API_KEY}
        onLoad={() => setApiReady(true)}
      >
        <GoogleMap
          mapContainerStyle={{ width: '100vw', height: '100vh' }}
          center={center}
          zoom={14}
          mapContainerClassName="google-map-container"
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            disableDefaultUI: true,
            gestureHandling: 'none'
          }}
        >
          <StreetViewPanorama
            position={center}
            visible 
            options={{
              pov: pov,
              addressControl: false,
              fullscreenControl: false,
              motionTrackingControl: false,
              panControl: false,
              enableCloseButton: false,
              clickToGo: false,
              zoomControl: true,
              scrollwheel: true
            }}
            onPovChanged={(newPov) => {
              // Update POV state when user moves camera
              if (newPov) {
                setPov({ heading: newPov.heading, pitch: newPov.pitch });
              }
            }}
            containerStyle={{ width: '100vw', height: '100vh' }}
          />
        </GoogleMap>
      </LoadScript>
      <div className="vignette_overlay"></div>
    </>
  );
});

StreetView.displayName = 'StreetView';

export default StreetView;
