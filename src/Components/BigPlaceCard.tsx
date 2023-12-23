import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { Link, PathMatch, useMatch, useNavigate } from "react-router-dom";
import { IGetPlaceDetailResult, IPlaceDetail } from "../api";
import StarRate from "./StarRate";
import { destinationState, tripState, userState, isClickedState } from "../atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import Overview from "../Routes/Overview";
import Review from "../Routes/Review";
import Map from "../Routes/Map";
import { useEffect } from "react";

const BigPlaceCard = ({ place, placeId, isHotel, destination }: IBigPlaceProps) => {
  const navigate = useNavigate();
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [isClicked, setIsClicked] = useRecoilState(isClickedState);

  const bigPlaceMatch: PathMatch<string> | null = useMatch("/place/:city/:placeid");
  const overviewMatch: PathMatch<string> | null = useMatch("/place/:city/:placeid/overview");
  const reviewMatch: PathMatch<string> | null = useMatch("/place/:city/:placeid/review");
  const mapMatch: PathMatch<string> | null = useMatch("/place/:city/:placeid/map");

  const onOverlayClick = () => {
    setIsClicked("");
  };

  const handleAddButtonClicked = () => {
    isHotel
      ? setUserInfo((current) => {
          const one = { ...current };
          const two = { ...one[currentTrip] };
          const three = [...two.trips];
          const index = three.findIndex((e) => e.destination?.name === destination?.name);
          const four = { ...three[index] };
          const five = { ...four.detail };
          const six = [...five.hotels];

          const newArray = [
            ...six,
            {
              name: place?.result.name,
              placeId: placeId,
              address: place?.result.formatted_address ? place?.result.formatted_address : "",
              geo: place?.result.geometry.location
                ? place?.result.geometry.location
                : { lat: 0, lng: 0 },
              image: place?.result.photos
                ? place?.result.photos.map((photo) => photo.photo_reference)
                : [""],
              overview: place?.result.editorial_summary
                ? place?.result.editorial_summary.overview
                : "",
              timestamp: new Date().getTime(),
            },
          ];

          const newFive = { ...five, ["hotels"]: newArray };
          const newFour = { ...four, ["detail"]: newFive };
          const newThree = [...three.slice(0, index), newFour, ...three.slice(index + 1)];
          const newTwo = { ...two, ["trips"]: newThree };
          const newOne = { ...current, [currentTrip]: newTwo };

          return newOne;
        })
      : setUserInfo((current) => {
          const one = { ...current };
          const two = { ...one[currentTrip] };
          const three = [...two.trips];
          const index = three.findIndex((e) => e.destination?.name === destination?.name);
          const four = { ...three[index] };
          const five = { ...four.detail };
          const six = { ...five.attractions };
          const seven = [...six["NoName"]];

          const newArray = [
            ...seven,
            {
              name: place?.result.name,
              placeId: placeId,
              address: place?.result.formatted_address ? place?.result.formatted_address : "",
              geo: place?.result.geometry.location
                ? place?.result.geometry.location
                : { lat: 0, lng: 0 },
              image: place?.result.photos
                ? place?.result.photos.map((photo) => photo.photo_reference)
                : [""],
              overview: place?.result.editorial_summary
                ? place?.result.editorial_summary.overview
                : "",
              timestamp: new Date().getTime(),
            },
          ];

          const newSix = { ...six, ["NoName"]: newArray };
          const newFive = { ...five, ["attractions"]: newSix };
          const newFour = { ...four, ["detail"]: newFive };
          const newThree = [...three.slice(0, index), newFour, ...three.slice(index + 1)];
          const newTwo = { ...two, ["trips"]: newThree };
          const newOne = { ...current, [currentTrip]: newTwo };

          return newOne;
        });

    setIsClicked("");
  };

  return (
    <AnimatePresence>
      <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <BigPlace layoutId={placeId}>
        <BigContainer>
          <BigCover
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0), transparent), url(${
                place?.result.photos
                  ? makeImagePath(place?.result.photos[0].photo_reference, 600)
                  : destination
                  ? makeImagePath(destination.photos[0].photo_reference, 600)
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
                to={`/place/${destination}/${placeId}/overview`}
                state={{
                  overview: place?.result.editorial_summary
                    ? place?.result.editorial_summary
                    : {
                        overview: "해당 장소에 대한 Overview가 존재하지 않습니다.",
                      },
                }}
              >
                <Tab isActive={overviewMatch !== null} isHotel={isHotel}>
                  Overview
                  {overviewMatch && <Circle isHotel={isHotel} layoutId="circle2" />}
                </Tab>
              </Link>
              <Link
                to={`/place/${destination}/${placeId}/review`}
                state={{
                  review: place?.result.reviews,
                }}
              >
                <Tab isHotel={isHotel} isActive={reviewMatch !== null}>
                  Review
                  {reviewMatch && <Circle isHotel={isHotel} layoutId="circle2" />}
                </Tab>
              </Link>
              <Link to={`/place/${destination}/${placeId}/map`} state={{ placeId: placeId }}>
                <Tab isHotel={isHotel} isActive={mapMatch !== null}>
                  Map
                  {mapMatch && <Circle isHotel={isHotel} layoutId="circle2" />}
                </Tab>
              </Link>
            </Tabs>
            <Nested>
              {overviewMatch ? <Overview /> : reviewMatch ? <Review /> : mapMatch ? <Map /> : null}
            </Nested>
          </BigOverview>

          <Button isHotel={isHotel} onClick={handleAddButtonClicked}>
            추가하기
          </Button>
        </BigContainer>
      </BigPlace>
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
  destination: IPlaceDetail | undefined;
}
