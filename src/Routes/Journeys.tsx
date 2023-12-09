import { useRecoilState } from "recoil";
import { destinationState, userState, playerState, tripState } from "../atoms";
import styled from "styled-components";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import JourneyBoard from "../Components/BoardJourney";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../Components/NavigationBar";
import BoardNoName from "../Components/BoardNoName";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownLong, faLeftLong } from "@fortawesome/free-solid-svg-icons";

const Journeys = () => {
  const { register, setValue, handleSubmit } = useForm<IBoardForm>();
  const navigate = useNavigate();
  const [currentDestination, setCurrentDestination] = useRecoilState(destinationState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [player, setPlayer] = useRecoilState(playerState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const destination = currentDestination?.name;

  const onGoBackClicked = () => {
    navigate(`/travel/${currentTrip}/${destination}`);
  };

  const onGoForwardClicked = () => {
    navigate(`/path/${currentTrip}/${destination}`);
  };

  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    else if (destination.droppableId === source.droppableId) {
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
        const tmp = [...temp[source.droppableId]];
        const sTarget = tmp[source.index];
        tmp.splice(source.index, 1);
        tmp.splice(destination.index, 0, sTarget);
        const newTmp = { ...temp, [source.droppableId]: tmp };
        const newOne = { ...detailCopy, ["attractions"]: newTmp };
        const newDestination = { ...arrayCopy, ["detail"]: newOne };
        const newTarget = [...target.slice(0, index), newDestination, ...target.slice(index + 1)];
        const newTrip = { ...copy, [currentTrip]: newTarget };
        const newUser = { ...userCopy, ["trips"]: newTrip };
        return { ...current, [player.email]: newUser };
      });
    } else {
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
        const oldCopy = [...temp[source.droppableId]];
        const dest = [...temp[destination.droppableId]];
        const oldTarget = oldCopy[source.index];
        oldCopy.splice(source.index, 1);
        dest.splice(destination.index, 0, oldTarget);
        const newTmp = {
          ...temp,
          [source.droppableId]: oldCopy,
          [destination.droppableId]: dest,
        };
        const newOne = { ...detailCopy, ["attractions"]: newTmp };
        const newDestination = { ...arrayCopy, ["detail"]: newOne };
        const newTarget = [...target.slice(0, index), newDestination, ...target.slice(index + 1)];
        const newTrip = { ...copy, [currentTrip]: newTarget };
        const newUser = { ...userCopy, ["trips"]: newTrip };
        return { ...current, [player.email]: newUser };
      });
    }
  };

  const onValid = ({ board }: IBoardForm) => {
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
      const newAttraction = { ...temp, [board]: [] };
      const newOne = { ...detailCopy, ["attractions"]: newAttraction };
      const newDestination = { ...arrayCopy, ["detail"]: newOne };
      const newTarget = [...target.slice(0, index), newDestination, ...target.slice(index + 1)];
      const newTrip = { ...copy, [currentTrip]: newTarget };
      const newUser = { ...userCopy, ["trips"]: newTrip };

      return { ...current, [player.email]: newUser };
    });
    setValue("board", "");
  };

  return (
    <Wrapper variants={loadingVar} initial="initial" animate="animate">
      <NavigationBar />
      <Container>
        <Main>
          <MainTitle>Manage your schedule</MainTitle>
          <MainDescription>
            Create categories of your travel (ex. {destination} city tour) and manage your schedule by dragging and
            dropping the place card.
          </MainDescription>
          <FormWrapper>
            <Form onSubmit={handleSubmit(onValid)}>
              <Input
                {...register("board", { required: true })}
                type="text"
                placeholder={`Enter name of category (ex. ${destination} city tour)`}
                autoComplete="off"
              />
              <SubmitButton type="submit">Create</SubmitButton>
            </Form>
          </FormWrapper>
        </Main>
        <DragDropContext onDragEnd={onDragEnd}>
          <NoName>
            <NoNameHeader>
              <div>
                <SubTitle>Drag & Drop</SubTitle>
                <Title>Your travel schedules in {currentDestination?.name}</Title>
              </div>
            </NoNameHeader>
            <NoNameBoard>
              <BoardNoName
                journey={
                  userInfo[player.email].trips[currentTrip][
                    userInfo[player.email].trips[currentTrip].findIndex(
                      (e) => e.destination?.name === currentDestination?.name
                    )
                  ].detail.attractions["NoName"]
                }
                boardId={"NoName"}
                key={"NoName"}
              />
            </NoNameBoard>
          </NoName>
          <Arrow>
            <FontAwesomeIcon icon={faDownLong}></FontAwesomeIcon>
          </Arrow>
          <NamedJourney>
            <BoardTitle>{currentDestination?.name}</BoardTitle>
            <Boards>
              {Object.keys(
                userInfo[player.email].trips[currentTrip][
                  userInfo[player.email].trips[currentTrip].findIndex(
                    (e) => e.destination?.name === currentDestination?.name
                  )
                ].detail.attractions
              ).map((boardName) => {
                return (
                  boardName !== "NoName" && (
                    <JourneyBoard
                      journey={
                        userInfo[player.email].trips[currentTrip][
                          userInfo[player.email].trips[currentTrip].findIndex(
                            (e) => e.destination?.name === currentDestination?.name
                          )
                        ].detail.attractions[boardName]
                      }
                      key={boardName}
                      boardId={boardName}
                    />
                  )
                );
              })}
            </Boards>
          </NamedJourney>
        </DragDropContext>
        <Row>
          <Title>Did you add all your Journeys?</Title>
          <Buttons>
            <Button variants={buttonVar} whileHover={"hover"} onClick={onGoBackClicked}>
              <span>No</span>
              <span>find more attractions</span>
            </Button>
            <Button variants={buttonVar} whileHover={"hover"} onClick={onGoForwardClicked}>
              <span>Yes</span>
              <span>check your route</span>
            </Button>
          </Buttons>
        </Row>
      </Container>
    </Wrapper>
  );
};

export default Journeys;

const Wrapper = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
`;

const Container = styled.div`
  padding-bottom: 8%;
`;

const NoName = styled.div`
  padding: 0 8%;
  width: 100%;
`;

const NoNameHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: flex-end;
  margin-top: 30px;
`;

const NoNameBoard = styled.div`
  position: sticky;
  top: 30px;
  z-index: 110;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0 8%;
  &:last-child {
    align-items: center;
    margin-top: 100px;
    min-height: 20vh;
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 150px 8%;
  @media screen and (max-width: 500px) {
    min-height: 100vh;
  }
`;

const NamedJourney = styled.div`
  background-color: ${(props) => props.theme.main.accent};
  padding: 50px 8%;
`;

const Boards = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  min-height: 200px;
  &::-webkit-scrollbar {
    height: 5px;
  }
`;

const MainDescription = styled.h2`
  font-size: 16px;
  font-weight: 500;
`;

const SubTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  @media screen and (max-width: 800px) {
    display: none;
  }
`;

const BoardTitle = styled.h2`
  font-size: 21px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 1.3125rem;
  font-weight: 600;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  width: 80%;
`;

const MainTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 50px;
  width: 100%;
`;

const FormWrapper = styled.div`
  margin-top: 50px;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

const Input = styled(motion.input)<{ isHotel: boolean }>`
  width: 500px;
  padding: 20px;
  font-size: 16px;
  border: none;
  box-shadow: 1px 2px 2px 2px lightgray;
  border-radius: 7px;
  font-weight: 600;
  &:focus {
    outline: none;
    box-shadow: 1px 2px 2px 2px ${(props) => props.theme.main.accent};
  }
  @media screen and (max-width: 1000px) {
    width: 400px;
  }
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

const SubmitButton = styled.button`
  margin-left: 30px;
  border: none;
  background-color: ${(props) => props.theme.main.accent};
  padding: 20px 25px;
  font-size: 16px;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.main.accent + "aa"};
  }
  @media screen and (max-width: 800px) {
    width: 100%;
    border-radius: 7px;
    margin-left: 0;
    margin-top: 15px;
  }
`;

const Button = styled(motion.button)`
  cursor: pointer;
  width: 160px;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: none;
  margin: 0 10px;
  margin-top: 30px;

  &:first-child {
    background-color: ${(props) => props.theme.red.accent};
  }
  &:last-child {
    background-color: ${(props) => props.theme.green.accent};
  }
  span {
    &:first-child {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 5px;
    }
    &:last-child {
      font-size: 12px;
      font-weight: 500;
      @media screen and (max-width: 500px) {
        display: none;
      }
    }
  }
`;

const Arrow = styled.p`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.25rem auto;
  font-size: 3rem;
`;

const buttonVar = {
  hover: { scale: 1.1 },
};

const loadingVar = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.3 } },
};

interface IBoardForm {
  board: string;
}
