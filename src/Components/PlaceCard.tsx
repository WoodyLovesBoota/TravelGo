import styled from "styled-components";
import {
  IAutoCompletePlaceDetail,
  getPlaceDetailResult,
  IGetPlaceDetailResult,
  IPlaceDetail,
} from "../api";
import { useRecoilState, useRecoilValue } from "recoil";
import { destinationState, isClickedState, tripState } from "../atoms";
import { makeImagePath } from "../utils";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import StarRate from "./StarRate";
import BigPlaceCard from "./BigPlaceCard";
import { AnimatePresence, motion } from "framer-motion";

const PlaceCard = ({ place, isHotel, destination }: IPlaceCardProps) => {
  const navigate = useNavigate();
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [isClicked, setIsClicked] = useRecoilState(isClickedState);

  const { data, isLoading } = useQuery<IGetPlaceDetailResult>(
    ["getPlaceDetail", place?.place_id],
    () => getPlaceDetailResult(place?.place_id)
  );

  const handleCardClicked = (placeId: string | undefined) => {
    setIsClicked(placeId);
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
                layoutId={place.place_id}
                onClick={() => handleCardClicked(place?.place_id)}
              >
                <Photo
                  bgphoto={`url(${makeImagePath(
                    data?.result.photos
                      ? data?.result.photos[0].photo_reference
                      : destination
                      ? destination.photos[0].photo_reference
                      : "",
                    500
                  )})`}
                />
                <Contents>
                  <Name> {data.result ? data?.result.name : ""}</Name>
                  <Address> {data.result ? data?.result.formatted_address : ""}</Address>
                  <StarRate dataRating={data?.result.rating} size="12"></StarRate>
                </Contents>
              </Container>
              {isClicked === place?.place_id && (
                <BigPlaceCard
                  key={data.result ? data?.result.name : ""}
                  place={data}
                  placeId={place?.place_id}
                  isHotel={isHotel}
                  destination={destination}
                />
              )}
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
  width: 321px;
  height: 321px;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
`;

const Photo = styled.div<{ bgphoto: string }>`
  background: ${(props) => props.bgphoto};
  background-position: center center;
  background-size: cover;
  width: 100%;
  height: 241px;
  border-radius: 8px;
`;

const Contents = styled.div`
  width: 100%;
  height: 80px;
  padding: 20px;
`;

const Name = styled.h2`
  font-size: 18px;
  font-weight: 700;
`;

const Address = styled.h2`
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.theme.gray.semiblur};
`;

const Description = styled.h2`
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.theme.gray.semiblur};
`;

interface IPlaceCardProps {
  place: IAutoCompletePlaceDetail | undefined;
  isHotel: boolean;
  destination: IPlaceDetail | undefined;
}
