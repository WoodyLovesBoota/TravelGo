import { useQuery } from "react-query";
import { IGetPlaceDetailResult, IPlaceDetail, getPlaceDetailResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { destinationState, journeyState, tripState, userState } from "../atoms";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const HotelCard = ({ name, placeId, timestamp, destination }: IJourneyCardProps) => {
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
      const six = [...five.hotels];

      const targetIndex = six.findIndex((e) => e?.placeId === placeId);
      const newArray = [...six.slice(0, targetIndex), ...six.slice(targetIndex + 1)];

      const newFive = { ...five, ["hotels"]: newArray };
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
          <Title>{name}</Title>
          <Button onClick={deleteJourney}>
            <FontAwesomeIcon icon={faX} />
          </Button>
        </Container>
      )}
    </Wrapper>
  );
};

export default HotelCard;

const Wrapper = styled.div`
  width: 100%;
`;

const Loader = styled.div`
  padding: 13px 0;
  font-size: 14px;
  color: ${(props) => props.theme.gray.blur};
`;

const Container = styled.div`
  width: 100%;
  cursor: pointer;
  padding: 13px 0;
  display: flex;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 400;
`;

const Button = styled.h2`
  margin-left: auto;
  font-size: 8px;
  color: ${(props) => props.theme.gray.blur};
`;

interface IJourneyCardProps {
  name: string | undefined;
  placeId: string | undefined;
  timestamp: number | undefined;
  destination: IPlaceDetail | undefined;
}
