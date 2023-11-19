import { useLocation } from "react-router-dom";
import GoogleMap from "../Components/GoogleMap";

const Map = () => {
  const { state } = useLocation();

  return (
    <>
      {state ? (
        <GoogleMap
          destination={`place_id:${state.placeId}`}
          width="100%"
          height="400px"
          zoom={12}
        />
      ) : null}
    </>
  );
};

export default Map;
