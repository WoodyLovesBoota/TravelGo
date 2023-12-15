import styled from "styled-components";
import { IAutoCompletePlaceDetail, getPlaceDetailResult, IGetPlaceDetailResult } from "../api";
import { useRecoilState, useRecoilValue } from "recoil";
import { destinationState, tripState } from "../atoms";
import { makeImagePath } from "../utils";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import StarRate from "./StarRate";
import BigPlaceCard from "./BigPlaceCard";
import { AnimatePresence, motion } from "framer-motion";

const PlaceCard = ({ place, isHotel }: IPlaceCardProps) => {
  const navigate = useNavigate();
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const destination = useRecoilValue(destinationState);

  const { data, isLoading } = useQuery<IGetPlaceDetailResult>(["getPlaceDetail", place?.place_id], () =>
    getPlaceDetailResult(place?.place_id)
  );

  const handleCardClicked = (placeId: string | undefined) => {
    navigate(`/travel/${currentTrip}/${destination?.name}/${placeId}/overview`);
  };
  return (
    <AnimatePresence>
      <>
        {data && place ? (
          isLoading ? (
            <Loader>Loading...</Loader>
          ) : data.result ? (
            <>
              <Container
                bgPhoto={`url(${makeImagePath(
                  data?.result.photos
                    ? data?.result.photos[0].photo_reference
                    : destination
                    ? destination.photos[0].photo_reference
                    : "",
                  500
                )})`}
                layoutId={place.place_id}
                onClick={() => handleCardClicked(place?.place_id)}
              >
                <Name> {data.result ? data?.result.name : ""}</Name>
                <Address> {data.result ? data?.result.formatted_address : ""}</Address>
                <Description>{data.result ? data?.result.international_phone_number : ""}</Description>
                <StarRate dataRating={data?.result.rating} size="14"></StarRate>
              </Container>
              <BigPlaceCard
                key={data.result ? data?.result.name : ""}
                place={data}
                placeId={place?.place_id}
                isHotel={isHotel}
              />
            </>
          ) : null
        ) : null}
      </>
    </AnimatePresence>
  );
};

export default PlaceCard;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
`;

const Container = styled(motion.div)<{ bgPhoto: string }>`
  width: 100%;
  cursor: pointer;
  height: 10vw;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), ${(props) => props.bgPhoto};
  background-size: cover;
  background-position: center center;
  border-radius: 10px;
  padding: 20px;
`;

const Name = styled.h2`
  font-size: 21px;
  font-weight: 700;
`;

const Address = styled.h2`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const Description = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: lightgray;
  margin-bottom: 10px;
`;

interface IPlaceCardProps {
  place: IAutoCompletePlaceDetail | undefined;
  isHotel: boolean;
}
