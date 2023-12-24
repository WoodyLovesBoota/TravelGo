import styled from "styled-components";
import DestinationCard from "../Components/DestinationCard";
import { useRecoilState, useRecoilValue } from "recoil";
import { isSecondPhaseState, tripState, userState } from "../atoms";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import NavigationBar from "../Components/NavigationBar";
import {
  IGetPlaceResult,
  getPlaceResult,
  IGetPlaceDetailResult,
  getPlaceDetailResult,
} from "../api";
import { useQuery } from "react-query";
import Header from "../Components/Header";
import { ReactComponent as Search } from "../assets/search.svg";
import { makeImagePath } from "../utils";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const City = () => {
  const [users, setUsers] = useRecoilState(userState);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchData, setSearchData] = useState("");
  const [isSecond, setIsSecond] = useRecoilState(isSecondPhaseState);

  const { ref, ...rest } = register("destination");

  const { data: destinationData, isLoading: isDestinationLoading } = useQuery<IGetPlaceResult>(
    ["getDestination", searchData],
    () => getPlaceResult(searchData + "도시" || ""),
    { enabled: !!searchData }
  );

  const { data: detailData, isLoading: isDetailLoading } = useQuery<IGetPlaceDetailResult>(
    ["getPlaceDetail", destinationData],
    () => getPlaceDetailResult(destinationData?.candidates[0].place_id),
    { enabled: !!destinationData }
  );

  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    else {
      setUsers((current) => {
        const copy = [...current[currentTrip].trips];
        const target = copy[source.index];
        copy.splice(source.index, 1);
        copy.splice(destination.index, 0, target);
        let temp = { ...current[currentTrip] };

        return { ...current, [currentTrip]: { ...temp, ["trips"]: copy } };
      });
    }
  };

  const onDeleteClick = (name: string | undefined) => {
    setUsers((current) => {
      let index = [...current[currentTrip].trips].findIndex((e) => e.destination?.name === name);
      let temp = [
        ...current[currentTrip].trips.slice(0, index),
        ...current[currentTrip].trips.slice(index + 1),
      ];
      let copy = { ...current[currentTrip] };

      return { ...current, [currentTrip]: { ...copy, ["trips"]: temp } };
    });
  };

  const onNextClick = () => {
    navigate("/place");
  };

  const onValid = (data: IForm) => {
    setSearchData(data.destination);
    setValue("destination", "");
  };

  useEffect(() => {
    setCurrentTrip(Object.keys(users)[0]);
  }, []);

  return (
    <Wrapper>
      <Header />
      <NavigationBar now={1} />
      <Container variants={inputVar} initial="initial" animate="animate">
        <Form onSubmit={handleSubmit(onValid)}>
          <Input
            {...rest}
            name="destination"
            ref={(e) => {
              ref(e);
              inputRef.current = e;
            }}
            placeholder="어디로 여행을 떠나시나요?"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            required
          />
          <Icon>
            <Search width={23} />
          </Icon>
        </Form>
      </Container>
      <Main>
        {isDestinationLoading || isDetailLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          detailData && (
            <Cards>
              <DestinationCard
                key={detailData?.result.place_id}
                title={detailData?.result.name}
                destination={detailData?.result}
              />
            </Cards>
          )
        )}
      </Main>
      {users[currentTrip] && users[currentTrip].trips && users[currentTrip].trips.length > 0 && (
        <SideBar>
          <DropArea>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId={"Destinations"}>
                {(provided, snapshot) => (
                  <Area
                    isDraggingOver={snapshot.isDraggingOver}
                    isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {users[currentTrip].trips.map((card, index) => (
                      <Draggable
                        key={card.destination?.name}
                        draggableId={card.destination?.name ? card.destination?.name : ""}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <CityCard
                            isDragging={snapshot.isDragging}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <CardPhoto
                              bgphoto={`url(${makeImagePath(
                                card.destination?.photos
                                  ? card?.destination.photos[0].photo_reference
                                  : "",
                                500
                              )})`}
                            />
                            <CardContent>
                              <CardTitle>{card.destination?.name}</CardTitle>
                              <CardSubtitle>{card.destination?.formatted_address}</CardSubtitle>
                            </CardContent>
                            <Delete
                              onClick={() => {
                                onDeleteClick(card.destination?.name);
                              }}
                            >
                              <FontAwesomeIcon icon={faX} />
                            </Delete>
                          </CityCard>
                        )}
                      </Draggable>
                    ))}
                  </Area>
                )}
              </Droppable>
            </DragDropContext>
          </DropArea>

          <Button onClick={onNextClick}>
            {users[currentTrip].trips[0].destination?.name} 외 {users[currentTrip].trips.length - 1}
            개 선택 완료
          </Button>
        </SideBar>
      )}
    </Wrapper>
  );
};

export default City;

const Wrapper = styled(motion.div)`
  width: 100vw;
  color: ${(props) => props.theme.main.word};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SideBar = styled.div`
  position: fixed;
  width: 500px;
  height: 100vh;
  top: 0;
  right: 0;
  background-color: white;
  box-shadow: -20px 0 30px 10px rgba(0, 0, 0, 0.3);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const DropArea = styled.div`
  height: calc(100vh - 100px);
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Area = styled.div<IDragging>`
  background-color: transparent;
  flex-grow: 1;
  min-height: 50vh;
`;

const CityCard = styled.div<{ isDragging: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  background-color: ${(props) => props.isDragging && props.theme.gray.blur};
  position: relative;
  width: 90%;
`;

const Delete = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  font-size: 10px;
  color: ${(props) => props.theme.gray.blur};
  cursor: pointer;
`;

const CardPhoto = styled.div<{ bgphoto: string }>`
  background-image: ${(props) => props.bgphoto};
  background-size: cover;
  background-position: center center;
  width: 80px;
  height: 80px;
  border-radius: 100px;
`;

const CardTitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
`;

const CardSubtitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.gray.semiblur};
`;

const CardContent = styled.div`
  margin-left: 10px;
`;

const Button = styled.button`
  width: 90%;
  padding: 20px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.blue.accent};
  color: white;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
`;

const Container = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Main = styled(motion.div)`
  width: 100%;
  padding: 0 72px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Cards = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 77px;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  padding: 77px;
`;

const Form = styled(motion.form)`
  display: flex;
  justify-content: center;
  margin: 80px 0 0 0;
  width: 506px;
  height: 50px;
  position: relative;
`;

const Input = styled(motion.input)`
  border-radius: 10px;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  padding: 15px 60px;
  font-size: 16px;
  font-weight: 400;
  &:focus {
    outline: none;
  }
  &::placeholder {
  }
`;

const Icon = styled.div`
  position: absolute;
  top: 13px;
  left: 15px;
`;

const inputVar = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.3 } },
};

interface IForm {
  destination: string;
}

interface IDragging {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
