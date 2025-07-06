import { LoadScript, GoogleMap, StreetViewPanorama } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const TORONTO_BOUNDS = {
  north: 43.855457, // Northern boundary
  south: 43.580573, // Southern boundary  
  east: -79.115204,  // Eastern boundary
  west: -79.639219   // Western boundary
};

const StreetView = () => {
  const [center, setCenter] = useState({
    lat: 43.6532,
    lng: -79.3832,
  });

  const [apiReady, setApiReady] = useState(false);
  const [locationData, setLocationData] = useState(null);

  // Generate random coordinates within Toronto's actual boundaries
  const generateRandomTorontoLocation = () => {
    const lat = TORONTO_BOUNDS.south + Math.random() * (TORONTO_BOUNDS.north - TORONTO_BOUNDS.south);
    const lng = TORONTO_BOUNDS.west + Math.random() * (TORONTO_BOUNDS.east - TORONTO_BOUNDS.west);
    
    console.log('🏘️ Generated random Toronto location:', { lat, lng });
    return { lat, lng };
  };

  // Fetch neighbourhood risk prediction
  const fetchLocationPrediction = async (lat, lng) => {
    try {
      const response = await fetch(`/api/predictions/${lat}/${lng}`);
      const data = await response.json();
      console.log('🏘️ Neighbourhood prediction:', data);
      setLocationData(data);
      return data;
    } catch (error) {
      console.error('Error fetching location prediction:', error);
      return null;
    }
  };
  const [captureDate, setCaptureDate] = useState(null);

  const generateNewLocation = () => {
    const newLocation = generateRandomTorontoLocation();
    setCenter(newLocation);
  };

  // Initialize with a random Toronto location
  useEffect(() => {
    const initialLocation = generateRandomTorontoLocation();
    setCenter(initialLocation);
  }, []);

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

          console.log('📍 Panorama metadata:');
          console.log('LatLng:', loc.latLng.toString());
          console.log('Pano ID:', loc.pano);
          console.log('Street name / description:', loc.description);

          // Fetch neighbourhood prediction for actual panorama coordinates
          fetchLocationPrediction(actualLat, actualLng);

          if (data.imageDate) {
            const date = new Date(data.imageDate);
            setCaptureDate(date);
            console.log('Capture date:', date.toLocaleString());
          }
        } else {
          console.warn('No panorama found near this location. Regenerating.');
          // Fallback: use original coordinates
          fetchLocationPrediction(center.lat, center.lng);
          generateNewLocation();
        }
      }
    );
  }, [apiReady, center]);

  return (
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
          visible options={{
            pov: { heading: 0, pitch: 0 },
            addressControl: false,
            fullscreenControl: false,
            motionTrackingControl: false,
            panControl: false,
            enableCloseButton: false,
            clickToGo: false,
            zoomControl: true,
            scrollwheel: true
          }}
          containerStyle={{ width: '100vw', height: '100vh' }}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default StreetView;
