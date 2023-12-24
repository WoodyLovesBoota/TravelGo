import styled from "styled-components";
import { IJourney, destinationState, userState, tripState } from "../atoms";
import { Droppable } from "react-beautiful-dnd";
import DragJourneyCard from "./DragJourneyCard";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faPen, faRoute, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import BigPath from "../Components/BigPath";
import { useNavigate } from "react-router-dom";
import { IPlaceDetail } from "../api";

const BoardJourney = ({ journey, boardId, destination, index }: IJourneyBoardProps) => {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);

  const calcDate = (year: number, month: number, day: number, daysToAdd: number): Date => {
    const baseDate = new Date(year, month - 1, day); // month는 0부터 시작하므로 -1 해줍니다.
    const resultDate = new Date(baseDate);
    resultDate.setDate(baseDate.getDate() + daysToAdd);
    return resultDate;
  };

  return (
    <Wrapper>
      <Header>
        <Title>{boardId}</Title>
        <Subtitle>
          {calcDate(
            Number(
              userInfo[currentTrip].trips[
                userInfo[currentTrip].trips.findIndex(
                  (e) => e.destination?.name === destination?.name
                )
              ].detail.date.split(".")[0]
            ),
            Number(
              userInfo[currentTrip].trips[
                userInfo[currentTrip].trips.findIndex(
                  (e) => e.destination?.name === destination?.name
                )
              ].detail.date.split(".")[1]
            ),
            Number(
              userInfo[currentTrip].trips[
                userInfo[currentTrip].trips.findIndex(
                  (e) => e.destination?.name === destination?.name
                )
              ].detail.date.split(".")[2]
            ),
            index - 1
          ).getFullYear()}
          .
          {calcDate(
            Number(
              userInfo[currentTrip].trips[
                userInfo[currentTrip].trips.findIndex(
                  (e) => e.destination?.name === destination?.name
                )
              ].detail.date.split(".")[0]
            ),
            Number(
              userInfo[currentTrip].trips[
                userInfo[currentTrip].trips.findIndex(
                  (e) => e.destination?.name === destination?.name
                )
              ].detail.date.split(".")[1]
            ),
            Number(
              userInfo[currentTrip].trips[
                userInfo[currentTrip].trips.findIndex(
                  (e) => e.destination?.name === destination?.name
                )
              ].detail.date.split(".")[2]
            ),
            index - 1
          ).getMonth() + 1}
          .
          {calcDate(
            Number(
              userInfo[currentTrip].trips[
                userInfo[currentTrip].trips.findIndex(
                  (e) => e.destination?.name === destination?.name
                )
              ].detail.date.split(".")[0]
            ),
            Number(
              userInfo[currentTrip].trips[
                userInfo[currentTrip].trips.findIndex(
                  (e) => e.destination?.name === destination?.name
                )
              ].detail.date.split(".")[1]
            ),
            Number(
              userInfo[currentTrip].trips[
                userInfo[currentTrip].trips.findIndex(
                  (e) => e.destination?.name === destination?.name
                )
              ].detail.date.split(".")[2]
            ),
            index - 1
          ).getDate()}
          (
          {
            ["일", "월", "화", "수", "목", "금", "토"][
              calcDate(
                Number(
                  userInfo[currentTrip].trips[
                    userInfo[currentTrip].trips.findIndex(
                      (e) => e.destination?.name === destination?.name
                    )
                  ].detail.date.split(".")[0]
                ),
                Number(
                  userInfo[currentTrip].trips[
                    userInfo[currentTrip].trips.findIndex(
                      (e) => e.destination?.name === destination?.name
                    )
                  ].detail.date.split(".")[1]
                ),
                Number(
                  userInfo[currentTrip].trips[
                    userInfo[currentTrip].trips.findIndex(
                      (e) => e.destination?.name === destination?.name
                    )
                  ].detail.date.split(".")[2]
                ),
                index - 1
              ).getDay()
            ]
          }
          )
        </Subtitle>
      </Header>
      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {journey &&
              journey.map(
                (j, i) =>
                  j && (
                    <DragJourneyCard
                      key={j.timestamp + ""}
                      index={i}
                      journeyId={j.timestamp + ""}
                      journeyName={j.name}
                      journeyAddress={j.address}
                      journeyPhoto={j.image[0]}
                      destination={destination}
                    />
                  )
              )}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
      {/* <BigPath boardName={clickedCard} /> */}
    </Wrapper>
  );
};

export default BoardJourney;

const Wrapper = styled.div`
  border-radius: 4px;
  width: 330px;
  height: 100%;
  margin-right: 10px;
  padding: 20px 25px;
  display: flex;
  flex-direction: column;
  position: relative;
  color: ${(props) => props.theme.main.word};
  background-color: white;
  flex: 0 0 auto;
  box-shadow: 4px 12px 0 0 rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 18px;
`;

const Subtitle = styled.h2`
  font-size: 14px;
  font-weight: 400;
  color: ${(props) => props.theme.gray.blur};
`;

const Area = styled.div<IDragging>`
  background-color: transparent;
  flex-grow: 1;
  height: 100%;
`;

interface IJourneyBoardProps {
  boardId: string;
  journey: (IJourney | undefined)[];
  destination: IPlaceDetail | undefined;
  index: number;
}

interface IDragging {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
