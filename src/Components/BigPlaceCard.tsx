import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { IGetPlaceDetailResult, IPlaceDetail } from "../api";
import { tripState, userState, isClickedState } from "../atoms";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const BigPlaceCard = ({ place, placeId, isHotel, destination }: IBigPlaceProps) => {
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [isClicked, setIsClicked] = useRecoilState(isClickedState);

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
              backgroundImage: `url(${
                place?.result.photos
                  ? makeImagePath(place?.result.photos[0].photo_reference, 600)
                  : destination
                  ? makeImagePath(destination.photos[0].photo_reference, 600)
                  : ""
              })`,
            }}
          />
          <BigOverview>
            <BigTitle>{place?.result.name}</BigTitle>
            <Content>{place?.result.formatted_address}</Content>
            <Content>
              <Rate>
                <Star />
                <RateNumber>{place?.result.rating ? place?.result.rating : "0"}</RateNumber>{" "}
              </Rate>
            </Content>
            <OverviewContent>{place?.result.editorial_summary.overview}</OverviewContent>
            <Button isHotel={isHotel} onClick={handleAddButtonClicked}>
              추가하기
            </Button>
          </BigOverview>
          <GoBackButton onClick={onOverlayClick}>
            <FontAwesomeIcon icon={faX} />
          </GoBackButton>
        </BigContainer>
      </BigPlace>
    </AnimatePresence>
  );
};

export default BigPlaceCard;

const BigPlace = styled(motion.div)`
  position: fixed;
  width: 800px;
  height: 500px;
  border-radius: 20px;
  z-index: 12;
  background-color: white;
  padding: 36px;
  left: calc((100vw - 800px) / 2);
  top: cale((100vh - 500px) / 2);
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
`;

const BigContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  cursor: default;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 10;
  cursor: default;
`;

const BigCover = styled.div`
  width: 428px;
  height: 428px;
  background-position: center center;
  background-size: cover;
  border-radius: 8px;
`;

const BigOverview = styled(motion.div)`
  padding-left: 36px;
  padding-top: 44px;
  width: 300px;
  display: flex;
  flex-direction: column;
`;

const Content = styled.h2`
  font-weight: 400;
  font-size: 18px;
  color: ${(props) => props.theme.gray.normal};
  margin-bottom: 16px;
`;

const OverviewContent = styled.h2`
  font-weight: 300;
  font-size: 14px;
  line-height: 1.5;
  width: 100%;
  color: #343434;
`;

const BigTitle = styled.div`
  color: black;
  font-size: 28px;
  font-weight: 400;
  margin-bottom: 16px;
`;

const Button = styled.div<{ isHotel: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  height: 50px;
  cursor: pointer;
  margin-top: auto;
  padding: 10px 103px;
  background-color: ${(props) => props.theme.blue.accent};
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  color: white;
`;

const Rate = styled.div`
  display: flex;

  align-items: center;
`;

const RateNumber = styled.h2`
  font-size: 14px;
  font-weight: 300;
  margin-top: 4px;
`;

const Star = styled.div`
  background-image: url("/star.png");
  width: 16px;
  height: 16px;
  background-size: cover;
  background-position: center;
  margin-right: 6px;
`;

const GoBackButton = styled.div`
  position: absolute;
  top: 36px;
  right: 36px;
  color: ${(props) => props.theme.gray.blur};
  font-size: 16px;
  cursor: pointer;
`;

interface IBigPlaceProps {
  place: IGetPlaceDetailResult | undefined;
  placeId: string | undefined;
  isHotel: boolean;
  destination: IPlaceDetail | undefined;
}
