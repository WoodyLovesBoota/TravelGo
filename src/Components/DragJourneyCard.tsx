import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPaintBrush, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRecoilValue, useRecoilState } from "recoil";
import { destinationState, userState, tripState } from "../atoms";
import { useNavigate } from "react-router-dom";
import BigPlaceCard from "./BigPlaceCard";
import { useQuery } from "react-query";
import { IGetPlaceDetailResult, getPlaceDetailResult } from "../api";
import { makeImagePath } from "../utils";

const DragJourneyCard = ({
  journeyId,
  journeyName,
  index,
  journeyAddress,
  boardId,
  placeId,
}: IDragJourneyCardProps) => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [bgColor, setBgColor] = useState<Colors>(Colors.BLACK);
  const navigate = useNavigate();
  const destinationData = useRecoilValue(destinationState);
  const destination = destinationData?.name;
  const [currentDestination, setCurrentDestination] = useRecoilState(destinationState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  // const [player, setPlayer] = useRecoilState(playerState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);

  const { data, isLoading } = useQuery<IGetPlaceDetailResult>(["getPlaceDetail", placeId], () =>
    getPlaceDetailResult(placeId)
  );

  const changeColor = (color: Colors) => {
    setBgColor(color);
  };

  const onDetailClick = () => {
    navigate(`/journey/${currentTrip}/${destination}/${placeId}`);
  };

  const deleteJourney = () => {
    // boardId &&
    //   setUserInfo((current) => {
    //     const userCopy = { ...current[player.email] };
    //     const copy = { ...current[player.email].trips };
    //     const target = [...copy[currentTrip]];
    //     const index = target.findIndex((e) => e.destination?.name === currentDestination?.name);
    //     const arrayCopy = { ...target[index] };
    //     const detailCopy = { ...target[index].detail };
    //     const temp = {
    //       ...detailCopy.attractions,
    //     };
    //     const newArr = [
    //       ...temp[boardId].slice(
    //         0,
    //         temp[boardId].findIndex((e) => e && e.timestamp === Number(journeyId))
    //       ),
    //       ...temp[boardId].slice(
    //         temp[boardId].findIndex((e) => e && e.timestamp === Number(journeyId)) + 1,
    //         temp[boardId].length
    //       ),
    //     ];
    //     const newBoard = { ...temp, [boardId]: newArr };
    //     const newOne = { ...detailCopy, ["attractions"]: newBoard };
    //     const newDestination = { ...arrayCopy, ["detail"]: newOne };
    //     const newTarget = [...target.slice(0, index), newDestination, ...target.slice(index + 1)];
    //     const newTrip = { ...copy, [currentTrip]: newTarget };
    //     const newUser = { ...userCopy, ["trips"]: newTrip };
    //     return { ...current, [player.email]: newUser };
    //   });
  };

  return (
    <AnimatePresence>
      {journeyId && !isLoading ? (
        <>
          <Draggable key={journeyName} draggableId={journeyId} index={index}>
            {(provided, snapshot) => (
              <Card
                bgPhoto={`url(${makeImagePath(
                  data?.result.photos && data?.result.photos[0].photo_reference
                    ? data?.result.photos[0].photo_reference
                    : destinationData
                    ? destinationData.photos[0].photo_reference
                    : "",
                  800
                )})`}
                isDragging={snapshot.isDragging}
                mainColor={bgColor}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={() => {
                  isToggleOpen && setIsToggleOpen(false);
                }}
              >
                <Header>
                  <Bar mainColor={bgColor} isDragging={snapshot.isDragging} />
                  <HeaderButtons>
                    <Detail onClick={onDetailClick}>
                      <Icon>
                        <FontAwesomeIcon icon={faSearch} style={{ color: "rgba(0,0,0,0.8)" }} />
                      </Icon>
                    </Detail>
                    <Delete onClick={deleteJourney}>
                      <Icon>
                        <FontAwesomeIcon icon={faTrashCan} style={{ color: "rgba(0,0,0,0.8)" }} />
                      </Icon>
                    </Delete>
                  </HeaderButtons>
                </Header>
                <Name>{journeyName}</Name>
                <Address>{journeyAddress}</Address>
              </Card>
            )}
          </Draggable>
          {/* <BigPlaceCard key={journeyId} place={data} placeId={placeId} isHotel={false} /> */}
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default DragJourneyCard;

const Card = styled.div<{
  isDragging: boolean;
  mainColor: string;
  bgPhoto: string;
}>`
  border-radius: 5px;
  padding: 10px;
  padding-top: 5px;
  margin-bottom: 10px;
  position: relative;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4), transparent),
    ${(props) => props.bgPhoto};
  background-size: cover;
  background-position: center center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Detail = styled.div`
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Delete = styled.div`
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const HeaderButtons = styled.div`
  display: flex;
`;

const Bar = styled.div<{ isDragging: boolean; mainColor: string }>`
  width: 15%;
  height: 8px;
  background-color: ${(props) => {
    const mainC = props.mainColor;
    return props.theme[mainC].accent;
  }};
  opacity: ${(props) => (props.isDragging ? 1 : 0.4)};
  margin-top: 5px;
  margin-bottom: 7px;
  border-radius: 5px;
`;

const Name = styled.h2`
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 7px;
`;

const Address = styled.h3`
  font-size: 12px;
  font-weight: 600;
`;

const Icon = styled.span`
  font-size: 13px;
  color: white;
`;

interface IDragJourneyCardProps {
  journeyId: string | undefined;
  index: number;
  journeyName: string | undefined;
  journeyAddress: string | undefined;
  boardId: string | undefined;
  placeId: string | undefined;
}

export enum Colors {
  YELLOW = "yellow",
  PURPLE = "purple",
  BLUE = "blue",
  ORANGE = "orange",
  RED = "red",
  GREEN = "green",
  BLACK = "black",
}
