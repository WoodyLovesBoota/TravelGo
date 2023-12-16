import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { destinationState, userState, playerState, tripState, IJourney } from "../atoms";
import { useState } from "react";
import BigPath from "../Components/BigPath";
import { DragDropContext, DropResult, Droppable, Draggable } from "react-beautiful-dnd";
import NavigationBar from "../Components/NavigationBar";
import { motion } from "framer-motion";
import { makeImagePath } from "../utils";

const Path = () => {
  const navigate = useNavigate();
  const [hoverTitle, setHoverTitle] = useState("");
  const [clickedCard, setClickedCard] = useState("");
  const [currentDestination, setCurrentDestination] = useRecoilState(destinationState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [player, setPlayer] = useRecoilState(playerState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const destination = currentDestination?.name;

  const onJourneyClicked = () => {
    navigate(`/journey/${currentTrip}/${destination}`);
  };

  const onForwardlicked = () => {
    navigate(`/destination/${currentTrip}`);
  };

  const onCardClicked = (boardName: string) => {
    setClickedCard(boardName);
    navigate(`/path/${currentTrip}/${destination}/${boardName}`);
  };

  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    else {
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
        const newObj = [...Object.entries(temp)];
        const newTemp = newObj[source.index];
        newObj.splice(source.index, 1);
        newObj.splice(destination.index, 0, newTemp);
        let nnObj: { [key: string]: (IJourney | undefined)[] } = {};
        newObj.forEach((e) => (nnObj[e[0]] = e[1]));
        const newOne = { ...detailCopy, ["attractions"]: nnObj };
        const newDestination = { ...arrayCopy, ["detail"]: newOne };
        const newTarget = [...target.slice(0, index), newDestination, ...target.slice(index + 1)];
        const newTrip = { ...copy, [currentTrip]: newTarget };
        const newUser = { ...userCopy, ["trips"]: newTrip };
        return { ...current, [player.email]: newUser };
      });
    }
  };
  return (
    <Wrapper
      variants={loadingVar}
      initial="initial"
      animate="animate"
      bgphoto={`url(${makeImagePath(
        currentDestination?.photos ? currentDestination?.photos[3].photo_reference : "",
        800
      )})`}
    >
      <NavigationBar />
      <Container>
        <Main>
          <InformationColumn>
            <MainTitle>
              Check your <br />
              journey
            </MainTitle>
            <Description>
              여행의 순서를 정하고 세부 사항을 확인하세요. 카드를 클릭하여 여정 세부 정보를 확인하고 지도에서 여행
              일정을 시각화하세요.
            </Description>
          </InformationColumn>
          <HiddenListColumn>
            {hoverTitle ? (
              <List>
                {userInfo[player.email].trips[currentTrip][
                  userInfo[player.email].trips[currentTrip].findIndex(
                    (e) => e.destination?.name === currentDestination?.name
                  )
                ].detail.attractions[hoverTitle].map((place) => place && <Element>{place.name}</Element>)}
              </List>
            ) : null}
          </HiddenListColumn>
          <JourneyDeck>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="Path">
                {(provided, snapshot) => (
                  <Area
                    isDraggingOver={snapshot.isDraggingOver}
                    isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {Object.keys(
                      userInfo[player.email].trips[currentTrip][
                        userInfo[player.email].trips[currentTrip].findIndex(
                          (e) => e.destination?.name === currentDestination?.name
                        )
                      ].detail.attractions
                    ).length === 1 ? (
                      <Loader>There is no journey. Please create your journey.</Loader>
                    ) : (
                      Object.keys(
                        userInfo[player.email].trips[currentTrip][
                          userInfo[player.email].trips[currentTrip].findIndex(
                            (e) => e.destination?.name === currentDestination?.name
                          )
                        ].detail.attractions
                      ).map(
                        (board, index) =>
                          board !== "NoName" && (
                            <Draggable key={board} draggableId={board} index={index}>
                              {(provided) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onMouseEnter={() => setHoverTitle(board)}
                                  onMouseLeave={() => setHoverTitle("")}
                                  onClick={() => {
                                    onCardClicked(board);
                                  }}
                                >
                                  <CardTitle>{board}</CardTitle>
                                  <CardSubTitle>
                                    포함된 장소{" "}
                                    {
                                      userInfo[player.email].trips[currentTrip][
                                        userInfo[player.email].trips[currentTrip].findIndex(
                                          (e) => e.destination?.name === currentDestination?.name
                                        )
                                      ].detail.attractions[board].length
                                    }
                                  </CardSubTitle>
                                </Card>
                              )}
                            </Draggable>
                          )
                      )
                    )}
                    {provided.placeholder}
                  </Area>
                )}
              </Droppable>
            </DragDropContext>
          </JourneyDeck>
        </Main>
        <Question>To modify your schedule..</Question>
        <Buttons>
          <Button variants={buttonVar} whileHover={"hover"} onClick={onJourneyClicked} plus={Boolean(false)}>
            <span>Go Back</span>
            <span>fix your schedule</span>
          </Button>
          <Button variants={buttonVar} whileHover={"hover"} onClick={onForwardlicked} plus={Boolean(true)}>
            <span>Go Next</span>
            <span>view your journey</span>
          </Button>
        </Buttons>
      </Container>
      <BigPath boardName={clickedCard} />
    </Wrapper>
  );
};

export default Path;

const Wrapper = styled(motion.div)<{ bgphoto: string }>`
  width: 100vw;
  padding-bottom: 150px;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), ${(props) => props.bgphoto};
  background-position: center center;
  background-size: cover;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Loader = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-top: 30px;
`;

const Main = styled.div`
  padding: 150px 144px;
  display: flex;
  justify-content: space-between;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MainTitle = styled.h2`
  font-size: 80px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 30px;
`;

const Description = styled.h2`
  font-size: 16px;
  font-weight: 500;
  width: 60%;
  line-height: 2;
`;

const Question = styled.h2`
  font-size: 18px;
  font-weight: 600;
  display: flex;
  justify-content: center;
`;

const SubTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 1%;
  @media screen and (max-width: 500px) {
    display: none;
  }
`;

const Title = styled.h2`
  font-size: 21px;
  font-weight: 500;
  margin-bottom: 10px;
  @media screen and (max-width: 500px) {
    display: none;
  }
`;

const Area = styled.div<IDragging>`
  background-color: transparent;
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

const JourneyDeck = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
`;

const HiddenListColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 8%;
`;

const InformationColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 50%;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px 20px;
  margin-bottom: 5px;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const CardSubTitle = styled.h2`
  font-size: 14px;
  font-weight: 400;
`;

const List = styled.div``;

const Element = styled.h2`
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 500;
`;

const Buttons = styled.div`
  display: flex;
  padding: 10px 144px;
  justify-content: center;
`;

const Button = styled(motion.button)<{ plus: boolean }>`
  cursor: pointer;
  padding: 18px 30px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: none;
  margin-top: 30px;
  margin-right: 15px;
  span {
    &:first-child {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 5px;
      @media screen and (max-width: 500px) {
        font-size: 16px;
      }
    }
    &:last-child {
      font-size: 14px;
      font-weight: 500;
      @media screen and (max-width: 500px) {
        display: none;
      }
    }
  }
  background-color: ${(props) => (props.plus ? props.theme.green.accent : props.theme.red.accent)};
`;

const buttonVar = {
  hover: { scale: 1.1 },
};

const loadingVar = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.3 } },
};

interface IDragging {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
