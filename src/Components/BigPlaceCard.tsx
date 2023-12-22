import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { Link, PathMatch, useMatch, useNavigate } from "react-router-dom";
import { IGetPlaceDetailResult } from "../api";
import StarRate from "./StarRate";
import { destinationState, tripState, userState } from "../atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import Overview from "../Routes/Overview";
import Review from "../Routes/Review";
import Map from "../Routes/Map";
import { useEffect } from "react";

const BigPlaceCard = ({ place, placeId, isHotel }: IBigPlaceProps) => {
  const navigate = useNavigate();
  const destinationData = useRecoilValue(destinationState);
  const destination = destinationData?.name;
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  // const [player, setPlayer] = useRecoilState(playerState);

  const bigPlaceMatch: PathMatch<string> | null = useMatch("/travel/:title/:destination/:place");
  const overviewMatch: PathMatch<string> | null = useMatch(
    "/travel/:title/:destination/:place/overview"
  );
  const reviewMatch: PathMatch<string> | null = useMatch(
    "/travel/:title/:destination/:place/review"
  );
  const mapMatch: PathMatch<string> | null = useMatch("/travel/:title/:destination/:place/map");
  const journeyMatch: PathMatch<string> | null = useMatch("/journey/:title/:destination/:place");
  const overviewJourneyMatch: PathMatch<string> | null = useMatch(
    "/journey/:title/:destination/:place/overview"
  );
  const reviewJourneyMatch: PathMatch<string> | null = useMatch(
    "/journey/:title/:destination/:place/review"
  );
  const mapJourneyMatch: PathMatch<string> | null = useMatch(
    "/journey/:title/:destination/:place/map"
  );

  const onOverlayClick = () => {
    journeyMatch || mapJourneyMatch || overviewJourneyMatch || reviewJourneyMatch
      ? navigate(`/journey/${currentTrip}/${destination}`)
      : navigate(`/travel/${currentTrip}/${destination}`);
  };

  const handleAddButtonClicked = () => {
    // isHotel
    //   ? setUserInfo((current) => {
    //       const index = [...{ ...current[player.email].trips }[currentTrip]].findIndex(
    //         (e) => e.destination?.name === destination
    //       );

    //       const hotelTarget = [...current[player.email].trips[currentTrip][index].detail.hotels];

    //       const newHotel = [
    //         ...hotelTarget,
    //         {
    //           name: place?.result.name,
    //           placeId: placeId,
    //           address: place?.result.formatted_address ? place?.result.formatted_address : "",
    //           geo: place?.result.geometry.location ? place?.result.geometry.location : { lat: 0, lng: 0 },
    //           image: place?.result.photos ? place?.result.photos.map((photo) => photo.photo_reference) : [""],
    //           overview: place?.result.editorial_summary ? place?.result.editorial_summary.overview : "",
    //           timestamp: new Date().getTime(),
    //         },
    //       ];

    //       return {
    //         ...current,
    //         [player.email]: {
    //           ...current[player.email],
    //           ["trips"]: {
    //             ...current[player.email].trips,
    //             [currentTrip]: [
    //               ...current[player.email].trips[currentTrip].slice(0, index),
    //               {
    //                 ...current[player.email].trips[currentTrip][index],
    //                 ["detail"]: {
    //                   ...current[player.email].trips[currentTrip][index].detail,
    //                   ["hotels"]: newHotel,
    //                 },
    //               },
    //               ...current[player.email].trips[currentTrip].slice(index + 1),
    //             ],
    //           },
    //         },
    //       };
    //     })
    //   : setUserInfo((current) => {
    //       const index = [...{ ...current[player.email].trips }[currentTrip]].findIndex(
    //         (e) => e.destination?.name === destination
    //       );

    //       const attractionTarget = [...current[player.email].trips[currentTrip][index].detail?.attractions["NoName"]];

    //       const newAttraction = [
    //         ...attractionTarget,
    //         {
    //           name: place?.result.name,
    //           placeId: placeId,
    //           address: place?.result.formatted_address ? place?.result.formatted_address : "",
    //           geo: place?.result.geometry.location ? place?.result.geometry.location : { lat: 0, lng: 0 },
    //           image: place?.result.photos ? place?.result.photos.map((photo) => photo.photo_reference) : [""],
    //           overview: place?.result.editorial_summary ? place?.result.editorial_summary.overview : "",
    //           timestamp: new Date().getTime(),
    //         },
    //       ];

    //       return {
    //         ...current,
    //         [player.email]: {
    //           ...current[player.email],
    //           ["trips"]: {
    //             ...current[player.email].trips,
    //             [currentTrip]: [
    //               ...current[player.email].trips[currentTrip].slice(0, index),
    //               {
    //                 ...current[player.email].trips[currentTrip][index],
    //                 ["detail"]: {
    //                   ...current[player.email].trips[currentTrip][index].detail,
    //                   ["attractions"]: {
    //                     ...current[player.email].trips[currentTrip][index].detail?.attractions,
    //                     ["NoName"]: newAttraction,
    //                   },
    //                 },
    //               },
    //               ...current[player.email].trips[currentTrip].slice(index + 1),
    //             ],
    //           },
    //         },
    //       };
    //     });

    navigate(`/travel/${currentTrip}/${destination}`);
  };

  return (
    <AnimatePresence>
      {(bigPlaceMatch ||
        overviewMatch ||
        reviewMatch ||
        mapMatch ||
        journeyMatch ||
        overviewJourneyMatch ||
        reviewJourneyMatch ||
        mapJourneyMatch) &&
        (bigPlaceMatch?.params.place === placeId ||
          overviewMatch?.params.place === placeId ||
          reviewMatch?.params.place === placeId ||
          mapMatch?.params.place === placeId ||
          journeyMatch?.params.place === placeId ||
          overviewJourneyMatch?.params.place === placeId ||
          reviewJourneyMatch?.params.place === placeId ||
          mapJourneyMatch?.params.place === placeId) && (
          <>
            <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
            <BigPlace layoutId={placeId}>
              <BigContainer>
                <BigCover
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0), transparent), url(${
                      place?.result.photos
                        ? makeImagePath(place?.result.photos[0].photo_reference, 600)
                        : destinationData
                        ? makeImagePath(destinationData.photos[0].photo_reference, 600)
                        : ""
                    })`,
                  }}
                />
                <BigOverview
                  variants={bigOverviewVar}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <BigTitle>
                    <p>{place?.result.name}</p>
                  </BigTitle>
                  <Content>
                    <StarRate dataRating={place?.result.rating} size="14"></StarRate>
                  </Content>
                  <Content>
                    <Icon>
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        style={{
                          color: "#0C0B31",
                        }}
                      />{" "}
                    </Icon>
                    {place?.result.formatted_address}
                  </Content>
                  <Content>
                    <Icon>
                      <FontAwesomeIcon
                        icon={faPhone}
                        style={{
                          color: "#0C0B31",
                        }}
                      />
                    </Icon>
                    {place?.result.international_phone_number}
                  </Content>

                  <Tabs>
                    <Link
                      to={
                        journeyMatch ||
                        mapJourneyMatch ||
                        overviewJourneyMatch ||
                        reviewJourneyMatch
                          ? `/journey/${currentTrip}/${destination}/${placeId}/overview`
                          : `/travel/${currentTrip}/${destination}/${placeId}/overview`
                      }
                      state={{
                        overview: place?.result.editorial_summary
                          ? place?.result.editorial_summary
                          : {
                              overview: "해당 장소에 대한 Overview가 존재하지 않습니다.",
                            },
                      }}
                    >
                      <Tab
                        isActive={(overviewMatch || overviewJourneyMatch) !== null}
                        isHotel={isHotel}
                      >
                        Overview
                        {(overviewMatch || overviewJourneyMatch) && (
                          <Circle isHotel={isHotel} layoutId="circle2" />
                        )}
                      </Tab>
                    </Link>
                    <Link
                      to={
                        journeyMatch ||
                        mapJourneyMatch ||
                        overviewJourneyMatch ||
                        reviewJourneyMatch
                          ? `/journey/${currentTrip}/${destination}/${placeId}/review`
                          : `/travel/${currentTrip}/${destination}/${placeId}/review`
                      }
                      state={{
                        review: place?.result.reviews,
                      }}
                    >
                      <Tab
                        isHotel={isHotel}
                        isActive={(reviewMatch || reviewJourneyMatch) !== null}
                      >
                        Review
                        {(reviewJourneyMatch || reviewMatch) && (
                          <Circle isHotel={isHotel} layoutId="circle2" />
                        )}
                      </Tab>
                    </Link>
                    <Link
                      to={
                        journeyMatch ||
                        mapJourneyMatch ||
                        overviewJourneyMatch ||
                        reviewJourneyMatch
                          ? `/journey/${currentTrip}/${destination}/${placeId}/map`
                          : `/travel/${currentTrip}/${destination}/${placeId}/map`
                      }
                      state={{ placeId: placeId }}
                    >
                      <Tab isHotel={isHotel} isActive={(mapMatch || mapJourneyMatch) !== null}>
                        Map
                        {(mapMatch || mapJourneyMatch) && (
                          <Circle isHotel={isHotel} layoutId="circle2" />
                        )}
                      </Tab>
                    </Link>
                  </Tabs>
                  <Nested>
                    {overviewMatch || overviewJourneyMatch ? (
                      <Overview />
                    ) : reviewMatch || reviewJourneyMatch ? (
                      <Review />
                    ) : mapMatch || mapJourneyMatch ? (
                      <Map />
                    ) : null}
                  </Nested>
                </BigOverview>
                {journeyMatch ||
                overviewJourneyMatch ||
                reviewJourneyMatch ||
                mapJourneyMatch ? null : (
                  <Button isHotel={isHotel} onClick={handleAddButtonClicked}>
                    추가하기
                  </Button>
                )}
              </BigContainer>
            </BigPlace>
          </>
        )}
    </AnimatePresence>
  );
};

export default BigPlaceCard;

const BigContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  cursor: default;
  z-index: 200;
  color: black;
`;

const BigPlace = styled(motion.div)`
  position: fixed;
  width: 800px;
  height: 90vh;
  top: 5vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.main.bg};
  border-radius: 30px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  z-index: 131;
  @media screen and (max-width: 1000px) {
    width: 600px;
  }
  @media screen and (max-width: 800px) {
    width: 450px;
  }
  @media screen and (max-width: 500px) {
    width: 90%;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 130;
  cursor: default;
`;

const Content = styled.h2`
  margin-bottom: 7px;
  font-weight: 600;
  font-size: 14px;
  color: black;
`;

const Nested = styled.div`
  width: 100%;
  min-height: 110px;
  margin-bottom: 20px;
`;

const BigCover = styled.div`
  width: 100%;
  height: 55%;
  background-position: center center;
  background-size: cover;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`;

const BigTitle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  color: black;

  p {
    font-size: 21px;
    font-weight: 600;
    margin-right: 20px;
    color: black;
  }
`;

const BigOverview = styled(motion.div)`
  padding: 30px;
  font-size: 12px;
  width: 100%;
  height: 60%;
  z-index: 103;
  background-color: ${(props) => props.theme.main.bg};
  color: ${(props) => props.theme.main.word};
  border-radius: 30px;
  position: absolute;
  bottom: -10%;
  box-sizing: border-box;
  font-weight: 350;
  overflow: auto;
`;

const Icon = styled.span`
  margin-right: 10px;
`;

const Button = styled.div<{ isHotel: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  font-size: 16px;
  font-weight: 600;
  background-color: ${(props) =>
    props.isHotel ? props.theme.red.accent : props.theme.main.accent};
  border-radius: 30px;
  height: 50px;
  position: absolute;
  bottom: 8px;
  z-index: 104;
  cursor: pointer;
`;

const Tabs = styled.div`
  display: flex;
  align-items: center;
  margin: 30px 0;
`;

const Tab = styled.div<{ isActive: boolean; isHotel: boolean }>`
  margin-right: 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: relative;
  color: ${(props) =>
    props.isActive
      ? props.isHotel
        ? props.theme.red.accent
        : props.theme.main.accent
      : "lightgray"};
  font-size: 16px;
  transition: color 0.5s ease-in-out;
  font-weight: 600;
`;

const Circle = styled(motion.span)<{ isHotel: boolean }>`
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: ${(props) =>
    props.isHotel ? props.theme.red.accent : props.theme.main.accent};
  border-radius: 2.5008px;
  bottom: -10px;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const bigOverviewVar = {
  initial: { y: 250 },
  animate: {
    y: 0,
    transition: { delay: 0.1, duration: 0.5 },
  },
  hover: {
    y: -150,
    transition: { type: "tween" },
  },
};

interface IBigPlaceProps {
  place: IGetPlaceDetailResult | undefined;
  placeId: string | undefined;
  isHotel: boolean;
}
