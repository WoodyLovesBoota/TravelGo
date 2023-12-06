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
    navigate(`/travel/${currentTrip}/${destination?.name}/${placeId}`);
  };
  return (
    <AnimatePresence>
      <Wrapper>
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
                variants={boxVariants}
                initial={"initial"}
                whileHover={isHotel ? "hoverHotel" : "hover"}
                onClick={() => handleCardClicked(place?.place_id)}
              >
                <Photo
                  variants={photoVariants}
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
                  <Name> {data.result ? data?.result.name : ""}</Name>
                  <StarRate dataRating={data.result ? data?.result.rating : 0} size="14" />
                  <Address>{data.result ? data?.result.formatted_address : ""}</Address>
                </Description>
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
      </Wrapper>
    </AnimatePresence>
  );
};

export default PlaceCard;

const Wrapper = styled(motion.div)`
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
`;

const Container = styled(motion.div)<{ bgPhoto: string }>`
  display: flex;
  cursor: pointer;
  transform-origin: center left;
  padding: 0.9375rem;
  width: 100%;
  margin-bottom: 0.625rem;
  background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), ${(props) => props.bgPhoto};
  background-position: center center;
  background-size: cover;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
`;
const Photo = styled(motion.div)<{ bgPhoto: string }>`
  width: 20%;
  height: 4.375rem;
  background-image: ${(props) => props.bgPhoto};
  background-position: center center;
  background-size: cover;
  margin-right: 1.25rem;
`;

const Name = styled.h2`
  font-size: 1rem;
  font-weight: 600;
`;

const Address = styled.h2`
  font-size: 0.75rem;
  font-weight: 400;
  margin: auto 0;
`;

const boxVariants = {
  initial: { opacity: 1 },
  hover: {
    boxShadow: "0rem 0rem .25rem .125rem #FECA44",
  },
  hoverHotel: {
    boxShadow: "0rem 0rem .25rem .125rem #ED5744",
  },
};

const photoVariants = {
  initial: { opacity: 1 },
  hover: {
    scale: 1.2,
  },
};

interface IPlaceCardProps {
  place: IAutoCompletePlaceDetail | undefined;
  isHotel: boolean;
}
