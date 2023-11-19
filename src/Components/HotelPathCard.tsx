import { useQuery } from "react-query";
import { IGetPlaceDetailResult, getPlaceDetailResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import {
  destinationState,
  journeyState,
  tripState,
  userState,
  playerState,
} from "../atoms";
import { motion } from "framer-motion";
import StarRate from "./StarRate";

const HotelPathCard = ({ name, placeId, timestamp }: IJourneyCardProps) => {
  const destinationData = useRecoilValue(destinationState);
  const destination = destinationData?.name;
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [player, setPlayer] = useRecoilState(playerState);

  const { data, isLoading } = useQuery<IGetPlaceDetailResult>(
    ["getPlaceDetail", placeId],
    () => getPlaceDetailResult(placeId)
  );

  const onHotelClicked = () => {};

  return (
    <Wrapper variants={shadowVar} whileHover={"hover"} onClick={onHotelClicked}>
      {isLoading ? (
        <Loader>loading...</Loader>
      ) : (
        <Container>
          <HotelPhoto
            bgPhoto={`url(${makeImagePath(
              data?.result.photos
                ? data?.result.photos[0].photo_reference
                : destinationData
                ? destinationData.photos[0].photo_reference
                : "",
              500
            )})`}
          ></HotelPhoto>
          <Title>{name}</Title>
          <SubTitle>{data?.result.formatted_address}</SubTitle>
          <SubTitle>{data?.result.international_phone_number}</SubTitle>
          <StarRate
            dataRating={data && data.result ? data?.result.rating : 0}
            size="12"
          />
        </Container>
      )}
    </Wrapper>
  );
};

export default HotelPathCard;

const Wrapper = styled(motion.div)`
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 2px 4px 2px lightgray;
  cursor: pointer;
  background-color: white;
`;

const Loader = styled.div``;

const HotelPhoto = styled.div<{ bgPhoto: string }>`
  background-image: ${(props) => props.bgPhoto};
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 24px;
  padding-bottom: 15px;
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 500;
  color: black;
  margin: 7px auto;
`;

const SubTitle = styled.h2`
  font-size: 12px;
  font-weight: 400;
  color: gray;
`;

const Button = styled(motion.button)`
  border: none;
  width: 60px;
  height: 30px;
  cursor: pointer;
  color: gray;
  font-size: 12px;
  border-radius: 5px;
  background-color: white;
  font-weight: 600;
`;

const buttonVar = {
  hover: { color: "#000000", scale: 1.2 },
};

const shadowVar = {
  hover: { boxShadow: "2px 2px 4px 4px #686868b9" },
};

interface IJourneyCardProps {
  name: string | undefined;
  placeId: string | undefined;
  timestamp: number | undefined;
}
