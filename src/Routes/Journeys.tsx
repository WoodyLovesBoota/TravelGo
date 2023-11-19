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
  const [currentDestination, setCurrentDestination] =
    useRecoilState(destinationState);
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
        const index = target.findIndex(
          (e) => e.destination?.name === currentDestination?.name
        );
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
        const newTarget = [
          ...target.slice(0, index),
          newDestination,
          ...target.slice(index + 1),
        ];
        const newTrip = { ...copy, [currentTrip]: newTarget };
        const newUser = { ...userCopy, ["trips"]: newTrip };
        return { ...current, [player.email]: newUser };
      });
    } else {
      setUserInfo((current) => {
        const userCopy = { ...current[player.email] };
        const copy = { ...current[player.email].trips };
        const target = [...copy[currentTrip]];
        const index = target.findIndex(
          (e) => e.destination?.name === currentDestination?.name
        );
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
        const newTarget = [
          ...target.slice(0, index),
          newDestination,
          ...target.slice(index + 1),
        ];
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
      const index = target.findIndex(
        (e) => e.destination?.name === currentDestination?.name
      );
      const arrayCopy = { ...target[index] };
      const detailCopy = { ...target[index].detail };
      const temp = {
        ...detailCopy.attractions,
      };
      const newAttraction = { ...temp, [board]: [] };
      const newOne = { ...detailCopy, ["attractions"]: newAttraction };
      const newDestination = { ...arrayCopy, ["detail"]: newOne };
      const newTarget = [
        ...target.slice(0, index),
        newDestination,
        ...target.slice(index + 1),
      ];
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
          <GoBackButton
            variants={buttonVar}
            whileHover={"hover"}
            onClick={onGoBackClicked}
          >
            <FontAwesomeIcon icon={faLeftLong}></FontAwesomeIcon>
          </GoBackButton>
          <MainTitle>
            Make your trip Concrete and manage your schedule
          </MainTitle>
          <MainDescription>
            Create categories of your travel (ex. {destination} city tour) and
            manage your schedule by dragging and dropping the place card.
          </MainDescription>
          <FormWrapper>
            <Form onSubmit={handleSubmit(onValid)}>
              <Input
                {...register("board", { required: true })}
                type="text"
                placeholder={`Enter name of category (ex. ${destination} city tour)`}
                autoComplete="off"
              />
              <SubmitButton type="submit">Add a category</SubmitButton>
            </Form>
          </FormWrapper>
        </Main>
        <DragDropContext onDragEnd={onDragEnd}>
          <NoName>
            <NoNameHeader>
              <div>
                <SubTitle>Drag & Drop</SubTitle>
                <Title>
                  Your travel schedules in {currentDestination?.name}
                </Title>
              </div>
              <Button
                variants={buttonVar}
                whileHover={"hover"}
                isPositive={Boolean(false)}
                onClick={onGoBackClicked}
              >
                <span>Go Back</span>find more attractions
              </Button>
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
          </Arrow>{" "}
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
                            (e) =>
                              e.destination?.name === currentDestination?.name
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
          <Button
            variants={buttonVar}
            whileHover={"hover"}
            isPositive={Boolean(true)}
            onClick={onGoForwardClicked}
          >
            <span>Yes</span>Go to Next Step
          </Button>
        </Row>
      </Container>
    </Wrapper>
  );
};

export default Journeys;

const Wrapper = styled(motion.div)`
  height: 100vh;
`;

const Container = styled.div`
  padding: 120px 0;
`;

const NoName = styled.div`
  padding: 0 12%;
  width: 100%;
  min-height: 25vh;
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
  padding: 0 12%;
  min-height: 30vh;

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
  padding: 0 15%;
  margin-bottom: 100px;
`;

const NamedJourney = styled.div`
  background-color: ${(props) => props.theme.main.bg};
  padding: 50px 12%;
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
  font-size: 18px;
  font-weight: 500;
`;

const SubTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
`;

const BoardTitle = styled.h2`
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
`;

const MainTitle = styled.h2`
  font-size: 64px;
  font-weight: 800;
  margin-bottom: 50px;
  width: 50%;
  margin-top: 20px;
`;

const FormWrapper = styled.div`
  margin-top: 50px;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  margin-top: 50px;
`;

const Input = styled(motion.input)<{ isHotel: boolean }>`
  width: 500px;
  height: 66px;
  padding: 20px;
  font-size: 18px;
  border: none;
  box-shadow: 1px 2px 2px 2px lightgray;
  border-radius: 7px;
  font-weight: 600;
  &::placeholder {
    position: absolute;
    top: 20px;
  }
  &:focus {
    outline: none;
    box-shadow: 1px 2px 2px 2px ${(props) => props.theme.main.accent};
    &::placeholder {
      position: absolute;
      top: 5px;
    }
  }
`;

const SubmitButton = styled.button`
  margin-left: 30px;
  border: none;
  background-color: ${(props) => props.theme.main.accent};
  color: white;
  padding: 20px 25px;
  font-size: 16px;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.main.accent + "aa"};
  }
`;

const Button = styled(motion.button)<{ isPositive: boolean }>`
  cursor: pointer;
  width: ${(props) => (props.isPositive ? "200px" : "160px")};
  padding: ${(props) => (props.isPositive ? "20px" : "10px")};
  border-radius: 5px;
  font-weight: 600;
  color: ${(props) => props.theme.white.normal};
  font-size: ${(props) => (props.isPositive ? "14px" : "12px")};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: none;
  margin-top: 30px;
  span {
    &:first-child {
      font-size: ${(props) => (props.isPositive ? "24px" : "18px")};
      margin-bottom: 5px;
    }
  }
  background-color: ${(props) =>
    props.isPositive ? props.theme.green.accent : props.theme.red.accent};
`;

const GoBackButton = styled(motion.button)`
  border: none;
  background-color: ${(props) => props.theme.main.accent};
  color: white;
  border-radius: 25px;
  width: 50px;
  height: 50px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
  margin-top: 100px;
`;

const Arrow = styled.p`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
  font-size: 48px;
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
