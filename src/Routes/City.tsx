import styled from "styled-components";
import DestinationCard from "../Components/DestinationCard";
import { useRecoilState } from "recoil";
import { tripState, userState } from "../atoms";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import {
  IGetPlaceResult,
  getPlaceResult,
  IGetPlaceDetailResult,
  getPlaceDetailResult,
} from "../api";
import { useQuery } from "react-query";
import Header from "../Components/Header";
import { ReactComponent as Search } from "../assets/search.svg";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { daysSinceSpecificDate } from "../utils";

const City = () => {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<IForm>();
  const { register: nameRegister, handleSubmit: nameHadleSubmit } = useForm<INameForm>();

  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchData, setSearchData] = useState("");
  const [isInputOpen, setIsInputOpen] = useState(false);

  const { ref, ...rest } = register("destination");

  const { data: destinationData, isLoading: isDestinationLoading } = useQuery<IGetPlaceResult>(
    ["getDestination", searchData],
    () => getPlaceResult(searchData + " 도시" || ""),
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
      setUserInfo((current) => {
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
    setUserInfo((current) => {
      let index = [...current[currentTrip].trips].findIndex((e) => e.destination?.name === name);
      let temp = [
        ...current[currentTrip].trips.slice(0, index),
        ...current[currentTrip].trips.slice(index + 1),
      ];
      let copy = { ...current[currentTrip] };

      return { ...current, [currentTrip]: { ...copy, ["trips"]: temp } };
    });
  };

  const onBackClick = () => {
    navigate("/");
  };

  const onNextClick = () => {
    navigate(`/place/${userInfo[currentTrip].trips[0].destination?.name}`);
  };

  const onValid = (data: IForm) => {
    setSearchData(data.destination);
  };

  const onNameValid = (data: INameForm) => {
    setIsInputOpen(false);
    const newName = data.name;
    newName &&
      setUserInfo((current) => {
        const copy = { ...current[currentTrip] };
        const temp = { ...current };
        delete temp[currentTrip];
        return { ...temp, [newName]: copy };
      });
    newName && setCurrentTrip(data.name);
  };

  useEffect(() => {
    setCurrentTrip(Object.keys(userInfo)[0]);
  }, []);

  return (
    <Wrapper>
      <Header now={1} />
      <Overview>
        <TitleBox>
          {isInputOpen ? (
            <TitleForm onSubmit={nameHadleSubmit(onNameValid)}>
              <TitleInput
                {...nameRegister("name")}
                autoComplete="off"
                autoFocus
                placeholder={currentTrip === "Trip1" ? "새로운 여행" : currentTrip}
              />
            </TitleForm>
          ) : (
            <Title>{currentTrip === "Trip1" ? "새로운 여행" : currentTrip}</Title>
          )}
          <PencilIcon
            onClick={() => {
              isInputOpen ? setIsInputOpen(false) : setIsInputOpen(true);
            }}
          />
        </TitleBox>
        <OverviewDuration>
          {userInfo[currentTrip].date
            .split("|")[0]
            .slice(0, userInfo[currentTrip].date.split("|")[0].length - 2)}
          (
          {
            ["일", "월", "화", "수", "목", "금", "토"][
              Number(userInfo[currentTrip].date.split("|")[0].split(".")[3])
            ]
          }
          ){" ~ "}
          {userInfo[currentTrip].date
            .split("|")[1]
            .slice(0, userInfo[currentTrip].date.split("|")[1].length - 2)}
          (
          {
            ["일", "월", "화", "수", "목", "금", "토"][
              Number(userInfo[currentTrip].date.split("|")[1].split(".")[3])
            ]
          }
          )
        </OverviewDuration>
        <OverviewNight>
          {daysSinceSpecificDate(
            [
              Number(userInfo[currentTrip].date.split("|")[0].split(".")[0]),
              Number(userInfo[currentTrip].date.split("|")[0].split(".")[1]),
              Number(userInfo[currentTrip].date.split("|")[0].split(".")[2]),
            ],
            [
              Number(userInfo[currentTrip].date.split("|")[1].split(".")[0]),
              Number(userInfo[currentTrip].date.split("|")[1].split(".")[1]),
              Number(userInfo[currentTrip].date.split("|")[1].split(".")[2]),
            ]
          )}
          박{" "}
          {daysSinceSpecificDate(
            [
              Number(userInfo[currentTrip].date.split("|")[0].split(".")[0]),
              Number(userInfo[currentTrip].date.split("|")[0].split(".")[1]),
              Number(userInfo[currentTrip].date.split("|")[0].split(".")[2]),
            ],
            [
              Number(userInfo[currentTrip].date.split("|")[1].split(".")[0]),
              Number(userInfo[currentTrip].date.split("|")[1].split(".")[1]),
              Number(userInfo[currentTrip].date.split("|")[1].split(".")[2]),
            ]
          ) + 1}
          일
        </OverviewNight>
        <OverviewCitys>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={"Destinations"}>
              {(provided, snapshot) => (
                <Area
                  isDraggingOver={snapshot.isDraggingOver}
                  isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {userInfo[currentTrip].trips.map((card, index) => (
                    <Draggable
                      key={card.destination?.name}
                      draggableId={card.destination?.name ? card.destination?.name : ""}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <OverviewCard
                          isDragging={snapshot.isDragging}
                          key={
                            card.destination?.name && card.destination?.name + index + "overview"
                          }
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <OverviewCardName>{card.destination?.name}</OverviewCardName>
                          <OverviewCardButton
                            onClick={() => {
                              onDeleteClick(card.destination?.name);
                            }}
                          >
                            <FontAwesomeIcon icon={faX} />
                          </OverviewCardButton>
                        </OverviewCard>
                      )}
                    </Draggable>
                  ))}
                </Area>
              )}
            </Droppable>
          </DragDropContext>
        </OverviewCitys>
        <Buttons>
          <Goback onClick={onBackClick}>이전 단계로</Goback>
          {userInfo[currentTrip].trips.length > 0 ? (
            <Button onClick={onNextClick}>완료</Button>
          ) : (
            <NoButton>완료</NoButton>
          )}
        </Buttons>
      </Overview>
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
            <Search width={18} />
          </Icon>
        </Form>
        {isDestinationLoading || isDetailLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          detailData && (
            <Cards>
              <DestinationCard key={detailData?.result.place_id} destination={detailData?.result} />
            </Cards>
          )
        )}
      </Container>
    </Wrapper>
  );
};

export default City;

const Wrapper = styled(motion.div)`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
`;

const Container = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 100px;
  padding-left: 400px;
`;

const Selected = styled.div`
  width: 100%;
  padding: 50px 100px;
  padding-left: 400px;
`;

const DropArea = styled.div`
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

const Cards = styled.div`
  padding: 60px 0;
  width: 100%;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: lightgray;
  width: 100%;
  height: 50px;
`;

const Form = styled(motion.form)`
  width: 500px;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  height: 50px;
  position: relative;
`;

const Input = styled(motion.input)`
  border-radius: 10px;
  width: 100%;
  height: 50px;
  padding: 15px 60px;
  font-size: 16px;
  font-weight: 400;
  &:focus {
    outline: none;
  }
  &::placeholder {
  }
`;

const TitleBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 28px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  min-width: 100px;
`;

const PencilIcon = styled.div`
  background: url("./pencil.png");
  background-position: center center;
  background-size: cover;
  width: 14px;
  height: 14px;
  margin-left: 20px;
`;

const TitleForm = styled.form`
  min-width: 100px;
`;

const TitleInput = styled.input`
  width: 100px;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: -2px;
  border-bottom: 2px solid ${(props) => props.theme.gray.blur};
  padding: 3px 5px;
  background-color: transparent;
  &:focus {
    outline: none;
    border-bottom: 2px solid black;
  }
`;

const Overview = styled.div`
  background-color: ${(props) => props.theme.gray.bg};
  width: 300px;
  height: 100vh;
  padding-top: 130px;
  padding-bottom: 28px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  display: flex;
  flex-direction: column;
`;

const OverviewDuration = styled.h2`
  color: ${(props) => props.theme.gray.accent};
  font-size: 14px;
  line-height: 24px;
  font-weight: 400;
  padding: 0 28px;
`;

const OverviewCitys = styled.div`
  width: 100%;
  height: 500px;
  overflow-y: auto;
  margin-top: 50px;
`;

const OverviewCard = styled.div<{ isDragging: boolean }>`
  width: 100%;
  padding: 16px 28px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => (props.isDragging ? "white" : "transparent")};
  &:hover {
    background-color: white;
  }
`;

const OverviewCardName = styled.h2`
  font-size: 14px;
  font-weight: 400;
  color: black;
`;

const OverviewCardButton = styled.button`
  font-size: 10px;
  background-color: transparent;
  color: ${(props) => props.theme.gray.semiblur};
  cursor: pointer;
  z-index: 4;
`;

const OverviewNight = styled.h2`
  color: ${(props) => props.theme.gray.accent};
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  padding: 0 28px;
`;

const Buttons = styled.div`
  margin-top: auto;
  z-index: 2;
  padding: 0 28px;
`;

const Goback = styled.button`
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  z-index: 2;
  background-color: transparent;
  color: ${(props) => props.theme.gray.button};
`;

const Button = styled.button`
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.blue.accent};
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  z-index: 2;
`;

const NoButton = styled.button`
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.gray.button};
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  z-index: 2;
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

interface INameForm {
  name: string;
}

interface IDragging {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
