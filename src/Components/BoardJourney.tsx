import styled from "styled-components";
import { IJourney, destinationState, userState, playerState, tripState } from "../atoms";
import { Droppable } from "react-beautiful-dnd";
import DragJourneyCard from "./DragJourneyCard";
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

const BoardJourney = ({ journey, boardId }: IJourneyBoardProps) => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [currentDestination, setCurrentDestination] = useRecoilState(destinationState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [player, setPlayer] = useRecoilState(playerState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);

  const deleteBoard = () => {
    setUserInfo((current) => {
      const userCopy = { ...current[player.email] };
      const copy = { ...current[player.email].trips };
      const target = [...copy[currentTrip]];
      const index = target.findIndex((e) => e.destination?.name === currentDestination?.name);
      const arrayCopy = { ...target[index] };
      const detailCopy = { ...target[index].detail };

      const temp = {
        ...detailCopy.attractions,
      };
      delete temp[boardId];

      const newOne = { ...detailCopy, ["attractions"]: temp };
      const newDestination = { ...arrayCopy, ["detail"]: newOne };
      const newTarget = [...target.slice(0, index), newDestination, ...target.slice(index + 1)];
      const newTrip = { ...copy, [currentTrip]: newTarget };
      const newUser = { ...userCopy, ["trips"]: newTrip };

      return { ...current, [player.email]: newUser };
    });
  };

  const renameBoard = () => {
    const newName = inputRef && inputRef.current && inputRef.current?.value;
    newName &&
      setUserInfo((current) => {
        const userCopy = { ...current[player.email] };
        const copy = { ...current[player.email].trips };
        const target = [...copy[currentTrip]];
        const index = target.findIndex((e) => e.destination?.name === currentDestination?.name);
        const arrayCopy = { ...target[index] };
        const detailCopy = { ...target[index].detail };
        const temp = {
          ...detailCopy.attractions,
        };
        const newData = [...temp[boardId]];
        delete temp[boardId];
        const newBoard = { ...temp, [newName]: newData };
        const newOne = { ...detailCopy, ["attractions"]: newBoard };
        const newDestination = { ...arrayCopy, ["detail"]: newOne };
        const newTarget = [...target.slice(0, index), newDestination, ...target.slice(index + 1)];
        const newTrip = { ...copy, [currentTrip]: newTarget };
        const newUser = { ...userCopy, ["trips"]: newTrip };

        return { ...current, [player.email]: newUser };
      });
  };

  return (
    <Wrapper>
      <Header
        onClick={() => {
          isToggleOpen && setIsToggleOpen(false);
        }}
      >
        <Title>{boardId}</Title>
        <Button onClick={() => setIsToggleOpen(true)}>
          {boardId !== "NoName" && <FontAwesomeIcon icon={faEllipsis} style={{ color: "gray" }} />}
        </Button>
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
                      boardId={boardId}
                      placeId={j.placeId}
                    />
                  )
              )}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
      {isToggleOpen ? (
        <ToggleBox variants={toggleVar} initial="initial" animate="animate" exit="exit">
          <RenameForm>
            <input placeholder={boardId} ref={inputRef} required autoComplete="off" />
            <ToggleButton onClick={renameBoard}>
              <span>
                <FontAwesomeIcon icon={faPen} style={{ color: "white" }} />
              </span>
            </ToggleButton>
          </RenameForm>
          <ToggleButton onClick={deleteBoard}>
            <FontAwesomeIcon icon={faTrashCan} style={{ color: "white" }} />
            <p>Delete</p>
          </ToggleButton>
        </ToggleBox>
      ) : null}
    </Wrapper>
  );
};

export default BoardJourney;

const Wrapper = styled.div`
  border-radius: 4px;
  width: min(330px, 100%);
  min-height: 180px;
  margin-right: 10px;
  padding: 20px 25px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  margin-left: 5px;
  position: relative;
  color: ${(props) => props.theme.main.word};
  background-color: white;
  flex: 0 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-left: 5px;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  font-size: 18px;
`;

const Area = styled.div<IDragging>`
  background-color: transparent;
  flex-grow: 1;
`;

const Button = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const ToggleBox = styled(motion.div)`
  position: absolute;
  width: 200px;
  height: 170px;
  top: 10px;
  right: 10px;
  background-color: ${(props) => props.theme.main.accent + "dd"};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transform-origin: top right;
  padding: 10px 15px;
  border-radius: 5px;
  z-index: 3;
`;

const RenameForm = styled.form`
  height: 40px;
  margin-bottom: 10px;
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  input {
    height: 80%;
    width: 100%;
    background-color: transparent;
    border: none;
    border-bottom: 1.5008px solid white;
    padding-left: 5px;
    font-size: 16px;
    &:focus {
      outline: none;
    }
    &::placeholder {
      color: lightgray;
    }
    color: white;
  }
`;

const ToggleButton = styled.div`
  height: 25px;
  margin-left: 5px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  &:last-child {
    display: flex;
    align-items: center;
  }
  p {
    margin-left: 10px;
    font-size: 16px;
    color: white;
  }
  span {
    font-size: 16px;
  }
`;

const toggleVar = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

interface IJourneyBoardProps {
  boardId: string;
  journey: (IJourney | undefined)[];
}

interface IDragging {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
