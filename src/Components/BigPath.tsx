import { AnimatePresence, motion } from "framer-motion";
import { useMatch, PathMatch, useNavigate } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";
import styled from "styled-components";
import { destinationState, userState, playerState, tripState } from "../atoms";
import GoogleRouteMap from "./GoogleRouteMap";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { makeImagePath } from "../utils";
import HotelPathCard from "./HotelPathCard";
import { useState } from "react";

const BigPath = ({ boardName }: IBigPathProps) => {
  const navigate = useNavigate();
  const currentDestination = useRecoilValue(destinationState);
  const destination = currentDestination?.name;
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [player, setPlayer] = useRecoilState(playerState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [hotelClicked, setHotelClicked] = useState(false);

  const attractionList =
    userInfo[player.email].trips[currentTrip][
      userInfo[player.email].trips[currentTrip].findIndex(
        (e) => e.destination?.name === currentDestination?.name
      )
    ].detail.attractions[boardName];

  const bigPathMatch: PathMatch<string> | null = useMatch(
    "/path/:title/:destination/:boardName"
  );

  const handleOverlayClicked = () => {
    navigate(`/path/${currentTrip}/${destination}`);
  };

  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    else {
      setUserInfo((current) => {
        const index = [
          ...{ ...current[player.email].trips }[currentTrip],
        ].findIndex((e) => e.destination?.name === currentDestination?.name);

        const newCopy = [
          ...current[player.email].trips[currentTrip][index].detail.attractions[
            source.droppableId
          ],
        ];
        const newBoard = newCopy[source.index];
        newCopy.splice(source.index, 1);
        newCopy.splice(destination.index, 0, newBoard);

        return {
          ...current,
          [player.email]: {
            ...current[player.email],
            ["trips"]: {
              ...current[player.email].trips,
              [currentTrip]: [
                ...current[player.email].trips[currentTrip].slice(0, index),
                {
                  ...current[player.email].trips[currentTrip][index],
                  ["detail"]: {
                    ...current[player.email].trips[currentTrip][index].detail,
                    ["attractions"]: {
                      ...current[player.email].trips[currentTrip][index].detail
                        .attractions,
                      [source.droppableId]: newCopy,
                    },
                  },
                },
                ...current[player.email].trips[currentTrip].slice(index + 1),
              ],
            },
          },
        };
      });
    }
  };

  return (
    <AnimatePresence>
      {bigPathMatch && bigPathMatch.params.boardName === boardName && (
        <>
          <Overlay onClick={handleOverlayClicked} />
          <Card layoutId={boardName}>
            <Title>Route of {boardName}</Title>
            <SubTitle>
              {attractionList.map((place) => (
                <Vortex>{place?.name}</Vortex>
              ))}
            </SubTitle>
            <Main>
              <Column>
                {attractionList.length > 0 ? (
                  attractionList.length > 1 ? (
                    attractionList.length > 2 ? (
                      <GoogleRouteMap
                        origin={`place_id:${attractionList[0]?.placeId}`}
                        destination={`place_id:${
                          attractionList[attractionList.length - 1]?.placeId
                        }`}
                        waypoints={attractionList.map((e, i) => {
                          if (e && i > 0 && i < attractionList.length - 1)
                            return e.placeId;
                          else return;
                        })}
                        width="100%"
                        height="100%"
                        zoom={13}
                      />
                    ) : (
                      <GoogleRouteMap
                        origin={`place_id:${attractionList[0]?.placeId}`}
                        destination={`place_id:${
                          attractionList[attractionList.length - 1]?.placeId
                        }`}
                        waypoints={[]}
                        width="100%"
                        height="100%"
                        zoom={13}
                      />
                    )
                  ) : (
                    <GoogleRouteMap
                      origin={`place_id:${attractionList[0]?.placeId}`}
                      destination={""}
                      waypoints={[]}
                      width="100%"
                      height="100%"
                      zoom={14}
                    />
                  )
                ) : (
                  <Loader>경로를 표시할 장소가 존재하지 않습니다.</Loader>
                )}
              </Column>
              <Column>
                <DragColumn>
                  <Header>{boardName}</Header>
                  {/* <Button>Add Hotel to Route</Button> */}
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={boardName}>
                      {(provided, snapshot) => (
                        <Area
                          isDraggingOver={snapshot.isDraggingOver}
                          isDraggingFromThis={Boolean(
                            snapshot.draggingFromThisWith
                          )}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {attractionList.map(
                            (place, index) =>
                              place && (
                                <Draggable
                                  key={place.placeId}
                                  draggableId={
                                    place.placeId ? place.placeId : ""
                                  }
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <DragCard
                                      bgPhoto={`url(${makeImagePath(
                                        place.image.length !== 1
                                          ? place.image[0]
                                          : currentDestination
                                          ? currentDestination.photos[0]
                                              .photo_reference
                                          : "",
                                        800
                                      )})`}
                                      isDragging={snapshot.isDragging}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      {place.name}
                                    </DragCard>
                                  )}
                                </Draggable>
                              )
                          )}
                        </Area>
                      )}
                    </Droppable>
                  </DragDropContext>
                </DragColumn>
              </Column>
            </Main>
          </Card>
          {hotelClicked && (
            <Hidden>
              <HiddenOverlay></HiddenOverlay>
              <HiddenHotel>
                <HiddenTitle>Hotels of {currentDestination?.name}</HiddenTitle>
                <HotelList>
                  {userInfo[player.email].trips[currentTrip][
                    userInfo[player.email].trips[currentTrip].findIndex(
                      (e) => e.destination?.name === currentDestination?.name
                    )
                  ].detail.hotels.map((hotel) => (
                    <HotelPathCard
                      name={hotel?.name}
                      placeId={hotel?.placeId}
                      timestamp={hotel?.timestamp}
                    ></HotelPathCard>
                  ))}
                </HotelList>
              </HiddenHotel>
            </Hidden>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default BigPath;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(51, 47, 56, 0.9);
  z-index: 98;
`;

const Hidden = styled.div``;

const HiddenTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const HotelList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  grid-gap: 10px;
`;

const HiddenHotel = styled.div`
  padding: 30px 10%;

  position: fixed;
  top: 10vh;
  left: 0;
  width: 100vw;
  height: 80vh;
  background-color: ${(props) => props.theme.main.hlbg};
  z-index: 101;
`;

const HiddenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.8);
`;

const Card = styled(motion.div)`
  position: fixed;
  width: 100vw;
  height: 90vh;
  top: 5vh;
  left: 0vh;
  background-color: white;
  z-index: 99;
  color: ${(props) => props.theme.main.word};
  padding: 0 12%;
`;

const Main = styled.div`
  width: 100%;
  height: 85%;
  display: flex;
  align-items: flex-start;
`;

const Column = styled.div`
  height: 100%;
  &:first-child {
    width: 70%;
  }
  &:last-child {
    margin-left: 2vw;
    width: 25%;
  }
`;

const Vortex = styled.h2`
  font-size: 16px;
  font-weight: 500;
  margin-right: 12px;
  color: gray;
`;

const SubTitle = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Header = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin: 20px 0;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin: 20px 0;
`;

const DragColumn = styled.div`
  padding: 30px;
  height: 100%;
  padding-top: 10px;
  width: 100%;
  background-color: ${(props) => props.theme.main.bg};
  border-radius: 10px;
`;

const DragCard = styled.div<{ isDragging: boolean; bgPhoto: string }>`
  padding: 20px 15px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  margin-bottom: 7px;
  color: ${(props) => props.theme.white.normal};
  background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0.3),
      transparent,
      transparent
    ),
    ${(props) => props.bgPhoto};
  background-position: center center;
  background-size: cover;
`;

const Area = styled.div<IDragging>`
  background-color: transparent;
  flex-grow: 1;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  width: 100%;
  height: 100%;
  font-weight: 600;
`;

const Button = styled.button``;

interface IBigPathProps {
  boardName: string;
}

interface IDragging {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
