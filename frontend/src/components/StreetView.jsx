import { LoadScript, GoogleMap, StreetViewPanorama } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const StreetView = () => {
  const [center] = useState({
    lat: 43.6532 + (Math.random() - 0.5) * 0.04,
    lng: -79.3832 + (Math.random() - 0.5) * 0.04,
  });

  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    if (!apiReady || !window.google) return;

    const svService = new window.google.maps.StreetViewService();
    svService.getPanorama(
      { location: center, radius: 100 },
      (data, status) => {
        if (status === 'OK') {
          const loc = data.location;
          console.log('📍 Panorama metadata:');
          console.log('LatLng:', loc.latLng.toString());
          console.log('Pano ID:', loc.pano);
          console.log('Street name / description:', loc.description);
        } else {
          console.warn('No panorama found near this location');
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
