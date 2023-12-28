import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const GoogleMapMarker = ({
  markers,
  hotels,
  center,
}: {
  markers: { lat: number; lng: number }[];
  hotels: { lat: number; lng: number }[];
  center: { lat: number; lng: number };
}) => {
  const API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

  const [map, setMap] = useState<any>(null);

  const mapStyles: React.CSSProperties = {
    height: "100%",
    width: "100%",
  };

  const onLoad = (map: any) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };

  return (
    <>
      {API_KEY && (
        <LoadScript googleMapsApiKey={API_KEY}>
          <GoogleMap
            mapContainerStyle={mapStyles}
            center={center}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {markers.map(
              (marker, index) =>
                marker.lat &&
                marker.lng && (
                  <Marker
                    key={index}
                    position={marker}
                    label={{
                      text: `${index + 1}`,
                      color: "white",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  />
                )
            )}
            {hotels.map(
              (marker, index) =>
                marker.lat &&
                marker.lng && (
                  <Marker
                    key={index}
                    position={marker}
                    label={{
                      text: `H`,
                      color: "white",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                    // icon={{
                    //   url: "/custom-marker.png",
                    //   scaledSize: new window.google.maps.Size(40, 40),
                    // }}
                  />
                )
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </>
  );
};

export default GoogleMapMarker;
