import { useQuery } from "react-query";
import { IGetPlaceDetailResult, IPlaceDetail, getPlaceDetailResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { destinationState, journeyState, tripState, userState } from "../atoms";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const JourneyCard = ({ name, placeId, timestamp, destination }: IJourneyCardProps) => {
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const setJourney = useSetRecoilState(journeyState);
  const { data, isLoading } = useQuery<IGetPlaceDetailResult>(["getPlaceDetail", placeId], () =>
    getPlaceDetailResult(placeId)
  );

  const deleteJourney = () => {
    setUserInfo((current) => {
      const one = { ...current };
      const two = { ...one[currentTrip] };
      const three = [...two.trips];
      const index = three.findIndex((e) => e.destination?.name === destination?.name);
      const four = { ...three[index] };
      const five = { ...four.detail };
      const six = { ...five.attractions };
      const seven = [...six["NoName"]];

      const targetIndex = seven.findIndex((e) => e?.placeId === placeId);
      const newArray = [...seven.slice(0, targetIndex), ...seven.slice(targetIndex + 1)];

      const newSix = { ...six, ["NoName"]: newArray };
      const newFive = { ...five, ["attractions"]: newSix };
      const newFour = { ...four, ["detail"]: newFive };
      const newThree = [...three.slice(0, index), newFour, ...three.slice(index + 1)];
      const newTwo = { ...two, ["trips"]: newThree };
      const newOne = { ...current, [currentTrip]: newTwo };

      return newOne;
    });
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>loading...</Loader>
      ) : (
        <Container>
          <Photo
            bgPhoto={`url(${makeImagePath(
              data?.result.photos
                ? data?.result.photos[0].photo_reference
                : destination
                ? destination.photos[0].photo_reference
                : "",
              500
            )})`}
          />
          <Description>
            <Title>{name}</Title>
            <Subtitle>{data?.result.formatted_address}</Subtitle>
          </Description>
          <Button onClick={deleteJourney}>
            <FontAwesomeIcon icon={faX} />
          </Button>
        </Container>
      )}
    </Wrapper>
  );
};

export default JourneyCard;

const Wrapper = styled.div`
  width: 100%;
`;

const Loader = styled.div``;

const Container = styled.div`
  width: 100%;
  cursor: pointer;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  box-shadow: 4px 4px 20px 0 rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  align-items: center;
`;

const Photo = styled.div<{ bgPhoto: string }>`
  background-image: ${(props) => props.bgPhoto};
  background-size: cover;
  background-position: center center;
  border-radius: 10px;
  width: 50px;
  height: 50px;
  margin-right: 15px;
`;

const Description = styled.div``;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 500;
`;

const Subtitle = styled.h2`
  color: ${(props) => props.theme.gray.semiblur};
  font-size: 12px;
  font-weight: 400;
`;

const Button = styled.h2`
  margin-left: auto;
  font-size: 12px;
  color: ${(props) => props.theme.gray.blur};
`;

interface IJourneyCardProps {
  name: string | undefined;
  placeId: string | undefined;
  timestamp: number | undefined;
  destination: IPlaceDetail | undefined;
}
