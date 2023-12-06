import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { destinationState, userState, playerState, tripState } from "../atoms";
import { useState } from "react";
import BigPath from "../Components/BigPath";
import { DragDropContext, DropResult, Droppable, Draggable } from "react-beautiful-dnd";
import NavigationBar from "../Components/NavigationBar";
import { motion } from "framer-motion";

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
        const newObject = Object.fromEntries(newObj);
        const newOne = { ...detailCopy, ["attractions"]: newObject };
        const newDestination = { ...arrayCopy, ["detail"]: newOne };
        const newTarget = [...target.slice(0, index), newDestination, ...target.slice(index + 1)];
        const newTrip = { ...copy, [currentTrip]: newTarget };
        const newUser = { ...userCopy, ["trips"]: newTrip };
        return { ...current, [player.email]: newUser };
      });
    }
  };

  return (
    <Wrapper variants={loadingVar} initial="initial" animate="animate">
      <NavigationBar />
      <Container>
        <Main>
          <InformationColumn>
            <MainTitle>Make path your journey</MainTitle>
            <Description>
              Make order your travel and check the details.Check your journey detail by clicking the card. Visualize
              your itinerary on the map.
            </Description>
            <Question>To modify your schedule..</Question>
            <Buttons>
              <Button variants={buttonVar} whileHover={"hover"} onClick={onJourneyClicked} plus={Boolean(false)}>
                <span>Go Back</span>
                fix your schedule
              </Button>
              <Button variants={buttonVar} whileHover={"hover"} onClick={onForwardlicked} plus={Boolean(true)}>
                <span>Yes</span>
                view your journey
              </Button>
            </Buttons>
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
            <Header>
              <HeaderColumn>
                <SubTitle>to change the order </SubTitle>
                <Title>Drag & Drop</Title>
              </HeaderColumn>
              <HeaderColumn>
                <SubTitle>to check your journey</SubTitle>
                <Title>Click</Title>
              </HeaderColumn>
            </Header>
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
        <Row></Row>
      </Container>
      <BigPath boardName={clickedCard} />
    </Wrapper>
  );
};

export default Path;

const Wrapper = styled(motion.div)`
  width: 100vw;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Loader = styled.div`
  font-size: 1rem;
  font-weight: 500;
  margin-top: 1.875rem;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Main = styled.div`
  padding: 15% 12%;
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 899px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MainTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.875rem;
`;

const Description = styled.h2`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 6.25rem;
`;

const Question = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
`;

const SubTitle = styled.h2`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1%;
`;

const Title = styled.h2`
  font-size: 1.3125rem;
  font-weight: 500;
  margin-bottom: 0.625rem;
`;

const Area = styled.div<IDragging>`
  background-color: transparent;
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 1.875rem;
`;

const HeaderColumn = styled.div`
  &:last-child {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
`;

const JourneyDeck = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 25rem;
  @media screen and (max-width: 899px) {
    width: 100%;
    margin-top: 3.125rem;
  }
`;

const HiddenListColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  @media screen and (max-width: 899px) {
    display: none;
  }
`;

const InformationColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 45%;
  @media screen and (max-width: 899px) {
    width: 100%;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.9375rem 1.25rem;
  margin-bottom: 0.3125rem;
  width: 25rem;
  border-radius: 0.3125rem;
  background-color: transparent;
  transform-origin: center left;
  cursor: pointer;
  background-color: ${(props) => props.theme.main.accent};
  color: white;
  @media screen and (max-width: 899px) {
    width: 100%;
  }
`;

const CardTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.625rem;
`;

const CardSubTitle = styled.h2`
  font-size: 0.75rem;
  font-weight: 400;
`;

const List = styled.div`
  margin-top: 3.75rem;
`;

const Element = styled.h2`
  margin-bottom: 0.625rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Buttons = styled.div`
  display: flex;
`;

const Button = styled(motion.button)<{ plus: boolean }>`
  cursor: pointer;
  padding: 1.125rem 1.875rem;
  border-radius: 0.3125rem;
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: none;
  margin-top: 1.875rem;
  margin-right: 0.9375rem;
  span {
    &:first-child {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.3125rem;
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
