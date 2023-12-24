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
  width: 200px;
  border-radius: 16px;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  padding: 14px 11px;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
`;

const Destination = styled.div<{ bgPhoto: string }>`
  background-image: ${(props) => props.bgPhoto};
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 200px;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  cursor: pointer;
`;

const DestinationTitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: black;
`;

const DestinationSubTitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: gray;
`;

interface IBigTripCardProps {
  destination: IPlaceDetail | undefined;
}
