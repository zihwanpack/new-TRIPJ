export const geocodeAddress = (address: string): Promise<google.maps.LatLngLiteral> => {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
};
