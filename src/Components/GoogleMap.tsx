import styled from "styled-components";

const GoogleMap = ({ destination, width, height, zoom }: IGoogleMapProps) => {
  const API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

  return (
    <Wrapper width={width} height={height}>
      <iframe
        width={"100%"}
        height={"100%"}
        src={`https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${destination}&zoom=${zoom}`}
      />
    </Wrapper>
  );
};

export default GoogleMap;

const Wrapper = styled.div<{ width: string; height: string }>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

interface IGoogleMapProps {
  destination: string | undefined | null;
  width: string;
  height: string;
  zoom: number;
}
