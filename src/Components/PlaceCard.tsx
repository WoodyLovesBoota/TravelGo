import styled from "styled-components";
import {
  IAutoCompletePlaceDetail,
  getPlaceDetailResult,
  IGetPlaceDetailResult,
  IPlaceDetail,
} from "../api";
import { useRecoilState, useRecoilValue } from "recoil";
import { destinationState, isClickedState, tripState, userState } from "../atoms";
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
  const [userInfo, setUserInfo] = useRecoilState(userState);

  const { data, isLoading } = useQuery<IGetPlaceDetailResult>(
    ["getPlaceDetail", place?.place_id],
    () => getPlaceDetailResult(place?.place_id)
  );

  const handleCardClicked = (placeId: string | undefined) => {
    setIsClicked(placeId);
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
              name: data?.result.name,
              placeId: place?.place_id,
              address: data?.result.formatted_address ? data?.result.formatted_address : "",
              geo: data?.result.geometry.location
                ? data?.result.geometry.location
                : { lat: 0, lng: 0 },
              image: data?.result.photos
                ? data?.result.photos.map((photo) => photo.photo_reference)
                : [""],
              overview: data?.result.editorial_summary
                ? data?.result.editorial_summary.overview
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
              name: data?.result.name,
              placeId: place?.place_id,
              address: data?.result.formatted_address ? data?.result.formatted_address : "",
              geo: data?.result.geometry.location
                ? data?.result.geometry.location
                : { lat: 0, lng: 0 },
              image: data?.result.photos
                ? data?.result.photos.map((photo) => photo.photo_reference)
                : [""],
              overview: data?.result.editorial_summary
                ? data?.result.editorial_summary.overview
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
  };

  return (
    <AnimatePresence>
      <>
        {data && place ? (
          isLoading ? (
            <Loader>Loading...</Loader>
          ) : data.result ? (
            <>
              <Container layoutId={place.place_id}>
                <Photo
                  onClick={() => handleCardClicked(place?.place_id)}
                  bgphoto={`url(${makeImagePath(
                    data?.result.photos
                      ? data?.result.photos[0].photo_reference
                      : destination
                      ? destination.photos[0].photo_reference
                      : "",
                    500
                  )})`}
                />
                <Contents onClick={() => handleCardClicked(place?.place_id)}>
                  <Name> {data.result ? data?.result.name : ""}</Name>
                  <Address> {data.result ? data?.result.formatted_address : ""}</Address>
                  <Rate>
                    <Star />
                    <RateNumber>{data.result ? data.result.rating : ""}</RateNumber>{" "}
                  </Rate>
                </Contents>
                {Object.values(
                  userInfo[currentTrip].trips[
                    userInfo[currentTrip].trips.findIndex(
                      (e) => e.destination?.name === destination?.name
                    )
                  ].detail.attractions
                )
                  .flat()
                  .some((e) => e?.placeId === place.place_id) ? (
                  <Checked />
                ) : (
                  <Plus onClick={handleAddButtonClicked} />
                )}
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
  width: 100%;
  padding: 20px;
  cursor: pointer;
  border-radius: 10px;
  display: flex;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  align-items: center;
`;

const Photo = styled.div<{ bgphoto: string }>`
  background: ${(props) => props.bgphoto};
  background-position: center center;
  background-size: cover;
  width: 78px;
  height: 78px;
  border-radius: 8px;
`;

const Contents = styled.div`
  padding-left: 20px;
  padding-top: 4px;
  min-width: 200px;
`;

const Name = styled.h2`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  line-height: 1;
`;

const Address = styled.h2`
  font-size: 12px;
  font-weight: 300;
  margin-bottom: 10px;
  color: ${(props) => props.theme.gray.accent};
`;

const Rate = styled.div`
  display: flex;

  align-items: center;
`;

const RateNumber = styled.h2`
  font-size: 12px;
  font-weight: 300;
  margin-top: 2px;
`;

const Star = styled.div`
  background-image: url("/star.png");
  width: 14px;
  height: 14px;
  background-size: cover;
  background-position: center;
  margin-right: 4px;
`;

const Plus = styled.div`
  background: url("/plus.png");
  width: 24px;
  height: 24px;
  background-position: center;
  background-size: cover;
  margin-left: auto;
  z-index: 4;
`;

const Checked = styled.div`
  background: url("/checked.png");
  width: 24px;
  height: 24px;
  background-position: center;
  background-size: cover;
  margin-left: auto;
  z-index: 4;
`;

interface IPlaceCardProps {
  place: IAutoCompletePlaceDetail | undefined;
  isHotel: boolean;
  destination: IPlaceDetail | undefined;
}
