import { LoadScript, GoogleMap, StreetViewPanorama } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const StreetView = () => {
  const [center] = useState({
    lat: 43.6532 + (Math.random() - 0.5) * 0.04,
    lng: -79.3832 + (Math.random() - 0.5) * 0.04,
  });

  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100vw', height: '100vh' }} // Required to display map
        center={center}
        zoom={14}
        options={{ streetViewControl: false, mapTypeControl: false }}
      >
        <StreetViewPanorama
          position={center}
          visible
          options={{ pov: { heading: 0, pitch: 0 } }}
          containerStyle={{ width: '100vw', height: '100vh' }} // Required to display panorama
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default StreetView;
