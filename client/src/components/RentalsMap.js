import React, { useState, useEffect } from "react";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";

const RentalsMap = ({ google, locations, setHighlight }) => {
  const [center, setCenter] = useState();

  useEffect(() => {
    const arr = Object.keys(locations);
    const getLat = (key) => locations[key]["lat"];
    const avgLat = arr.reduce((a, b) => a + Number(getLat(b)), 0) / arr.length;
    const getLng = (key) => locations[key]["lng"];
    const avgLng = arr.reduce((a, b) => a + Number(getLng(b)), 0) / arr.length;
    setCenter({ lat: avgLat, lng: avgLng });
  }, [locations]);

  return (
    <>
      {center && (
        <Map
          google={google}
          center={center}
          initialCenter={locations[0]}
          zoom={13}
          disableDefaultUI={true}
          containerStyle={{
            width: "50vw",
            height: "calc(100vh - 135px)",
          }}
        >
          {locations.map((locations, i) => (
            <Marker
              position={locations}
              onClick={() => setHighlight(i)}
            ></Marker>
          ))}
        </Map>
      )}
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyCjU-Sp73-n84mBvBOxLZYjmUKvvns05DI",
})(RentalsMap);
