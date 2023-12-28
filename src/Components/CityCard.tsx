import styled from "styled-components";
import { makeImagePath } from "../utils";
import { IPlaceDetail } from "../api";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { destinationState } from "../atoms";
import AttractionScreen from "./AttractionScreen";
import ScheduleScreen from "./ScheduleScreen";

const CityCard = ({ destination }: IBigTripCardProps) => {
  const navigate = useNavigate();
  const [currentDestination, setCurrentDestination] = useRecoilState(destinationState);

  const onCardClick = () => {
    navigate(`/place/${destination?.name}`);
    setCurrentDestination(destination);
  };

  return (
    <>
      <Wrapper onClick={onCardClick}>
        {destination && (
          <Container>
            <Destination
              bgPhoto={`url(${makeImagePath(
                destination?.photos ? destination?.photos[0].photo_reference : "",
                500
              )})`}
            />
            <Description>
              <DestinationTitle>{destination?.name}</DestinationTitle>
              <DestinationSubTitle>
                {destination?.formatted_address.split(" ")[0]}
              </DestinationSubTitle>
            </Description>
          </Container>
        )}
      </Wrapper>
      <AttractionScreen destination={destination} />
      <ScheduleScreen destination={destination} />
    </>
  );
};

export default CityCard;

const Wrapper = styled.div`
  display: flex;
  cursor: pointer;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 22vw;
  border-radius: 8px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  height: 25%;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
`;

const Destination = styled.div<{ bgPhoto: string }>`
  background-image: ${(props) => props.bgPhoto};
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 75%;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  cursor: pointer;
`;

const DestinationTitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: black;
`;

const DestinationSubTitle = styled.h2`
  font-size: 14px;
  font-weight: 300;
  color: gray;
`;

interface IBigTripCardProps {
  destination: IPlaceDetail | undefined;
}
