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
import { makeImagePath } from "../utils";

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
    navigate(`/summary/${currentTrip}/${destination}`);
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
    <>
      <Wrapper
        bgphoto={`url(${makeImagePath(
          currentDestination?.photos ? currentDestination?.photos[1].photo_reference : "",
          800
        )})`}
      >
        <NavigationBar />
        <DragDropContext onDragEnd={onDragEnd}>
          <Main variants={loadingVar} initial="initial" animate="animate">
            <Column>
              <MainTitle>
                Manage your
                <br />
                schedule
              </MainTitle>
              <MainDescription>
                여러분의 여행의 카테고리를 만들어 보세요 (ex. {destination} city tour). 장소 카드를 drag & drop 하여
                카테고리에 장소와 스케줄을 추가하세요. 카테고리 별로 경로를 확인하여 보다 더 효울적인 동선을 계획하세요.
              </MainDescription>
            </Column>
            <NoName>
              <NoNameHeader>
                <div>
                  <SubTitle>Drag & Drop</SubTitle>
                  <Title>{currentDestination?.name}에서의 스케줄을 관리하세요.</Title>
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
          </Main>
          <Container variants={loadingVar} initial="initial" animate="animate">
            <Arrow>
              <FontAwesomeIcon icon={faDownLong}></FontAwesomeIcon>
            </Arrow>
            <NamedJourney>
              <Boards>
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
                <DroppableBoards>
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
                </DroppableBoards>
              </Boards>
            </NamedJourney>
          </Container>
        </DragDropContext>
      </Wrapper>

      <Row variants={loadingVar} initial="initial" animate="animate">
        <Rowtitle>모든 장소를 배치하셨나요?</Rowtitle>
        <Buttons>
          <Button onClick={onGoBackClicked}>
            <span>아니요</span>
            <span>더 많은 장소를 찾는다.</span>
          </Button>
          <Button onClick={onGoForwardClicked}>
            <span>네</span>
            <span>여행을 확인한다.</span>
          </Button>
        </Buttons>
      </Row>
    </>
  );
};

export default Journeys;

const Wrapper = styled(motion.div)<{ bgphoto: string }>`
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), ${(props) => props.bgphoto};
  background-position: center center;
  background-size: cover;
  padding-bottom: 150px;
`;

const Container = styled(motion.div)`
  padding: 0px 72px;
`;

const NoName = styled.div`
  width: 55%;
`;

const NoNameHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: flex-end;
`;

const NoNameBoard = styled.div`
  z-index: 110;
  width: 100%;
`;

const Row = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  width: 100%;
  padding: 100px 0;
`;

const Main = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  padding: 150px 72px;
  padding-bottom: 50px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 50%;
`;

const NamedJourney = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 50px 24px;
`;

const Boards = styled.div`
  flex-wrap: nowrap;
  overflow-x: auto;
  min-height: 200px;
`;

const DroppableBoards = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  min-height: 200px;
`;

const MainDescription = styled.h2`
  font-size: 16px;
  font-weight: 500;
  width: 60%;
  line-height: 2;
`;

const SubTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  @media screen and (max-width: 800px) {
    display: none;
  }
`;

const Rowtitle = styled.h2`
  font-size: 21px;
  font-weight: 400;
  color: black;
`;

const Title = styled.h2`
  font-size: 21px;
  font-weight: 600;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  width: 80%;
`;

const MainTitle = styled.h2`
  font-size: 80px;
  font-weight: 800;
  width: 100%;
  line-height: 1.2;
  margin-bottom: 30px;
`;

const FormWrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
`;

const Input = styled(motion.input)<{ isHotel: boolean }>`
  width: 500px;
  padding: 12px 20px;
  font-size: 18px;
  border: 2px solid white;
  border-radius: 7px;
  font-weight: 600;
  background-color: transparent;
  color: white;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: white;
  }
`;

const SubmitButton = styled.button`
  margin-left: 20px;
  border: none;
  background-color: ${(props) => props.theme.main.accent};
  padding: 14px 20px;
  font-size: 18px;
  border-radius: 10px;
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

const Button = styled.button`
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
    &:hover {
      background-color: ${(props) => props.theme.red.accent + "aa"};
    }
  }
  &:last-child {
    background-color: ${(props) => props.theme.green.accent};
    &:hover {
      background-color: ${(props) => props.theme.green.accent + "aa"};
    }
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
  margin-bottom: 50px;
  font-size: 48px;
`;

const loadingVar = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.3 } },
};

interface IBoardForm {
  board: string;
}
