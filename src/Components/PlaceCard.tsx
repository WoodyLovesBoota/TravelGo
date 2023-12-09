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
                variants={boxVariants}
                initial={"initial"}
                whileHover={isHotel ? "hoverHotel" : "hover"}
                onClick={() => handleCardClicked(place?.place_id)}
              >
                <HexInner>
                  <Content
                    bgPhoto={`url(${makeImagePath(
                      data?.result.photos
                        ? data?.result.photos[0].photo_reference
                        : destination
                        ? destination.photos[0].photo_reference
                        : "",
                      500
                    )})`}
                  >
                    <Name> {data.result ? data?.result.name : ""}</Name>
                  </Content>
                </HexInner>
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
  font-size: 1rem;
  font-weight: 600;
`;

const Container = styled(motion.div)<{ bgPhoto: string }>`
  width: 25%;
  margin-bottom: 1.8%;
  position: relative;
  visibility: hidden;
  cursor: pointer;
  &:nth-of-type(5n + 4) {
    margin-left: 12.5%;
  }
  &:after {
    content: "";
    display: block;
    padding-bottom: 80%;
  }
`;

const Name = styled.h2`
  font-size: 18px;
  font-weight: 600;
  @media screen and (max-width: 500px) {
    font-size: 16px;
  }
`;

const HexInner = styled(motion.div)`
  position: absolute;
  width: 99%;
  padding-bottom: 114.6%;
  overflow: hidden;
  visibility: hidden;
  transform: rotate3d(0, 0, 1, -60deg) skewY(30deg);
  * {
    position: absolute;
    visibility: visible;
    box-shadow: 10px 10px 32px 0 rgba(0, 0, 0, 0.1);
  }
`;

const Content = styled.div<{ bgPhoto: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform: skewY(-30deg) rotate3d(0, 0, 1, 60deg);
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), ${(props) => props.bgPhoto};
  background-position: center center;
  background-size: cover;
  &:hover {
    background-image: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), ${(props) => props.bgPhoto};
  }
`;

const boxVariants = {
  initial: { opacity: 1 },
  hover: {
    boxShadow: "0rem 0rem .25rem .125rem #FECA44",
  },
  hoverHotel: {
    boxShadow: "0rem 0rem .25rem .125rem #f49a23",
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
