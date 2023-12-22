import { useQuery } from "react-query";
import { IGetPlaceDetailResult, getPlaceDetailResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { useRecoilValue, useRecoilState } from "recoil";
import { destinationState, tripState, userState } from "../atoms";
import { motion } from "framer-motion";

const HotelCard = ({ name, placeId, timestamp }: IJourneyCardProps) => {
  const destinationData = useRecoilValue(destinationState);
  const destination = destinationData?.name;
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  // const [player, setPlayer] = useRecoilState(playerState);
  const { data, isLoading } = useQuery<IGetPlaceDetailResult>(["getPlaceDetail", placeId], () =>
    getPlaceDetailResult(placeId)
  );

  const deleteJourney = () => {
    // setUserInfo((current) => {
    //   const userCopy = { ...current[player.email] };
    //   const copy = { ...current[player.email].trips };
    //   const target = [...copy[currentTrip]];
    //   const index = target.findIndex((e) => e.destination?.name === destination);
    //   const arrayCopy = { ...target[index] };
    //   const detailCopy = { ...target[index].detail };
    //   const temp = [...arrayCopy.detail?.hotels];
    //   const newArr = [
    //     ...temp.slice(
    //       0,
    //       temp.findIndex((e) => e && e.timestamp === timestamp)
    //     ),
    //     ...temp.slice(temp.findIndex((e) => e && e.timestamp === timestamp) + 1, temp.length),
    //   ];
    //   const newTemp = { ...detailCopy, ["hotels"]: newArr };
    //   const newDestination = { ...arrayCopy, ["detail"]: newTemp };
    //   const newTarget = [...target.slice(0, index), newDestination, ...target.slice(index + 1)];
    //   const newTrip = { ...copy, [currentTrip]: newTarget };
    //   const newUser = { ...userCopy, ["trips"]: newTrip };
    //   return { ...current, [player.email]: newUser };
    // });
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
                : destinationData
                ? destinationData.photos[0].photo_reference
                : "",
              500
            )})`}
          />
          <Description>
            <Title>{name}</Title>
            <Button onClick={deleteJourney}>삭제하기</Button>
          </Description>
        </Container>
      )}
    </Wrapper>
  );
};

export default HotelCard;

const Wrapper = styled.div``;

const Loader = styled.div``;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 5px;
  border-radius: 20px;
  box-shadow: 0 0 10px 0px gray;
`;

const Photo = styled.div<{ bgPhoto: string }>`
  background-image: ${(props) => props.bgPhoto};
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 10vw;
  border-radius: 20px;
`;

const Description = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10px;
  padding-top: 10px;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: black;
  margin-top: 10px;
`;

const Button = styled(motion.button)`
  border: none;
  width: 60px;
  height: 80%;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  font-weight: 500;
  margin-top: auto;
  z-index: 50;
  color: black;
  background-color: lightgray;
  &:hover {
    background-color: #e9e9e9;
  }
`;

interface IJourneyCardProps {
  name: string | undefined;
  placeId: string | undefined;
  timestamp: number | undefined;
}
