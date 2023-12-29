import React, { useEffect, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

interface PathMapProps {
  waypoints: ({ lat: number; lng: number } | undefined)[][];
}

const PathMap: React.FC<PathMapProps> = ({ waypoints }) => {
  const mapRef = useRef<any>(null);
  const API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

  const loadMap = (map: any) => {
    mapRef.current = map;
  };

  const renderPath = (waypointPath: ({ lat: number; lng: number } | undefined)[]) => {
    const validWaypoints = waypointPath.filter((waypoint) => waypoint !== undefined);

    if (validWaypoints.length < 2) {
      // 경로를 그릴 수 있는 최소한의 좌표가 없으면 무시
      return;
    }

    const firstWaypoint = validWaypoints[0];
    const lastWaypoint = validWaypoints[validWaypoints.length - 1];

    // 유효한 좌표가 있는지 확인 후 진행
    if (firstWaypoint && lastWaypoint) {
      const origin = { lat: firstWaypoint.lat, lng: firstWaypoint.lng };
      const destination = { lat: lastWaypoint.lat, lng: lastWaypoint.lng };
      const waypointsWithoutOriginAndDestination = validWaypoints.slice(1, -1);

      const waypointsWithStops = waypointsWithoutOriginAndDestination.map((waypoint: any) => ({
        location: { lat: waypoint.lat, lng: waypoint.lng },
        stopover: true,
      }));

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();

      directionsService.route(
        {
          origin,
          destination,
          waypoints: waypointsWithStops,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response: any, status: any) => {
          if (status === "OK") {
            directionsRenderer.setMap(mapRef.current);
            directionsRenderer.setDirections(response);
          } else {
            console.error(`Directions request failed with status: ${status}`);
          }
        }
      );
    }
  };

  useEffect(() => {
    if (waypoints.length > 0) {
      waypoints.forEach((waypointPath, index) => {
        renderPath(waypointPath);
      });
    }
  }, [waypoints]);

  return (
    <>
      {API_KEY && (
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={{ lat: 37.7749, lng: -122.4194 }}
            zoom={12}
            onLoad={loadMap}
          />
        </LoadScript>
      )}
    </>
  );
};

export default PathMap;
