import { useQuery } from "react-query";
import { IGetPlaceDetailResult, getPlaceDetailResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { useRecoilValue, useRecoilState } from "recoil";
import { destinationState, tripState, userState, playerState } from "../atoms";
import { motion } from "framer-motion";

const HotelCard = ({ name, placeId, timestamp }: IJourneyCardProps) => {
  const destinationData = useRecoilValue(destinationState);
  const destination = destinationData?.name;
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [player, setPlayer] = useRecoilState(playerState);
  const { data, isLoading } = useQuery<IGetPlaceDetailResult>(["getPlaceDetail", placeId], () =>
    getPlaceDetailResult(placeId)
  );

  const deleteJourney = () => {
    setUserInfo((current) => {
      const userCopy = { ...current[player.email] };
      const copy = { ...current[player.email].trips };
      const target = [...copy[currentTrip]];
      const index = target.findIndex((e) => e.destination?.name === destination);
      const arrayCopy = { ...target[index] };
      const detailCopy = { ...target[index].detail };
      const temp = [...arrayCopy.detail?.hotels];
      const newArr = [
        ...temp.slice(
          0,
          temp.findIndex((e) => e && e.timestamp === timestamp)
        ),
        ...temp.slice(temp.findIndex((e) => e && e.timestamp === timestamp) + 1, temp.length),
      ];
      const newTemp = { ...detailCopy, ["hotels"]: newArr };
      const newDestination = { ...arrayCopy, ["detail"]: newTemp };
      const newTarget = [...target.slice(0, index), newDestination, ...target.slice(index + 1)];
      const newTrip = { ...copy, [currentTrip]: newTarget };
      const newUser = { ...userCopy, ["trips"]: newTrip };

      return { ...current, [player.email]: newUser };
    });
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>loading...</Loader>
      ) : (
        <Container
          bgPhoto={`url(${makeImagePath(
            data?.result.photos
              ? data?.result.photos[0].photo_reference
              : destinationData
              ? destinationData.photos[0].photo_reference
              : "",
            500
          )})`}
        >
          <Title>{name}</Title>
          <Button variants={buttonVar} whileHover={"hover"} onClick={deleteJourney}>
            삭제하기
          </Button>
        </Container>
      )}
    </Wrapper>
  );
};

export default HotelCard;

const Wrapper = styled.div``;

const Loader = styled.div``;

const Container = styled.div<{ bgPhoto: string }>`
  background-image: linear-gradient(to bottom right, rgba(0, 0, 0, 0.8), transparent, transparent, transparent),
    ${(props) => props.bgPhoto};
  background-size: cover;
  background-position: center center;

  width: 11.25rem;
  height: 13.125rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.3125rem 1.125rem;
  padding-bottom: 0.9375rem;
  border-radius: 0.625rem;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
`;

const Button = styled(motion.button)`
  border: none;
  width: 3.75rem;
  height: 1.875rem;
  cursor: pointer;
  color: gray;
  font-size: 0.75rem;
  border-radius: 0.3125rem;
  background-color: white;
  font-weight: 600;
`;

const buttonVar = {
  hover: { color: "#000000", scale: 1.2 },
};

interface IJourneyCardProps {
  name: string | undefined;
  placeId: string | undefined;
  timestamp: number | undefined;
}
