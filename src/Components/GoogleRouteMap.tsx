import styled from "styled-components";

const GoogleRouteMap = ({ origin, waypoints, destination, width, height, zoom }: IGoogleRouteMapProps) => {
  const API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

  let waypoint = "";
  waypoints.pop();
  waypoints.shift();
  for (let i = 0; i < waypoints.length; i++) {
    waypoint += `place_id:${waypoints[i]}`;
    if (i !== waypoints.length - 1) waypoint += "|";
  }

  return (
    <Wrapper width={width} height={height}>
      {destination === "" ? (
        <iframe
          width={"100%"}
          height={"100%"}
          src={`https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${origin}&zoom=${zoom}`}
        />
      ) : waypoints.length === 0 ? (
        <iframe
          width={"100%"}
          height={"100%"}
          src={`https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=${origin}&destination=${destination}&zoom=${zoom}`}
        />
      ) : (
        <iframe
          width={"100%"}
          height={"100%"}
          src={`https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=${origin}&waypoints=${waypoint}&destination=${destination}&mode=walking&zoom=${zoom}`}
        />
      )}
    </Wrapper>
  );
};

export default GoogleRouteMap;

const Wrapper = styled.div<{ width: string; height: string }>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  iframe {
    border-bottom: 10px;
    border-radius: 15px;
  }
  border-radius: 15px;
`;

interface IGoogleRouteMapProps {
  origin: string | undefined | null;
  waypoints: (string | undefined | null)[];
  destination: string | undefined | null;
  width: string;
  height: string;
  zoom: number;
}
