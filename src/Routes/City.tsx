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
  getCityOverview,
} from "../api";
import { useQuery } from "react-query";
import Header from "../Components/Header";
import { ReactComponent as Search } from "../assets/search.svg";
import { makeImagePath } from "../utils";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { daysSinceSpecificDate } from "../utils";

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
  };

  useEffect(() => {
    setCurrentTrip(Object.keys(users)[0]);
  }, []);

  return (
    <Wrapper>
      <Header now={1} />
      <Overview>
        <OverviewDuration>
          {users[currentTrip].date
            .split("|")[0]
            .slice(0, users[currentTrip].date.split("|")[0].length - 2)}
          (
          {
            ["일", "월", "화", "수", "목", "금", "토"][
              Number(users[currentTrip].date.split("|")[0].split(".")[3])
            ]
          }
          ){" ~ "}
          {users[currentTrip].date
            .split("|")[1]
            .slice(0, users[currentTrip].date.split("|")[1].length - 2)}
          (
          {
            ["일", "월", "화", "수", "목", "금", "토"][
              Number(users[currentTrip].date.split("|")[1].split(".")[3])
            ]
          }
          )
        </OverviewDuration>
        <OverviewNight>
          {daysSinceSpecificDate(
            [
              Number(users[currentTrip].date.split("|")[0].split(".")[0]),
              Number(users[currentTrip].date.split("|")[0].split(".")[1]),
              Number(users[currentTrip].date.split("|")[0].split(".")[2]),
            ],
            [
              Number(users[currentTrip].date.split("|")[1].split(".")[0]),
              Number(users[currentTrip].date.split("|")[1].split(".")[1]),
              Number(users[currentTrip].date.split("|")[1].split(".")[2]),
            ]
          )}
          박{" "}
          {daysSinceSpecificDate(
            [
              Number(users[currentTrip].date.split("|")[0].split(".")[0]),
              Number(users[currentTrip].date.split("|")[0].split(".")[1]),
              Number(users[currentTrip].date.split("|")[0].split(".")[2]),
            ],
            [
              Number(users[currentTrip].date.split("|")[1].split(".")[0]),
              Number(users[currentTrip].date.split("|")[1].split(".")[1]),
              Number(users[currentTrip].date.split("|")[1].split(".")[2]),
            ]
          ) + 1}
          일
        </OverviewNight>
        <Buttons>
          {users[currentTrip].trips.length > 0 ? (
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
            <Search width={23} />
          </Icon>
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
        </Form>
      </Container>
      {users[currentTrip] && users[currentTrip].trips && users[currentTrip].trips.length > 0 && (
        <Selected>
          <DropArea>
            <Area>
              {users[currentTrip].trips.map((card) => (
                <CityCard>
                  <CardPhoto
                    bgphoto={`url(${makeImagePath(
                      card.destination?.photos ? card?.destination.photos[0].photo_reference : "",
                      500
                    )})`}
                  />
                  <CardContent>
                    <CardTitle>{card.destination?.name}</CardTitle>
                    <CardSubtitle>{card.destination?.formatted_address.split(" ")[0]}</CardSubtitle>
                  </CardContent>
                  <Delete
                    onClick={() => {
                      onDeleteClick(card.destination?.name);
                    }}
                  >
                    <FontAwesomeIcon icon={faX} />
                  </Delete>
                </CityCard>
              ))}
            </Area>
          </DropArea>
        </Selected>
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
  padding-top: 80px;
`;

const Overview = styled.div`
  background-color: lightgray;
  width: 300px;
  height: 100vh;
  padding: 50px 30px;
  padding-top: 130px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  display: flex;
  flex-direction: column;
`;

const OverviewDuration = styled.h2`
  color: gray;
  font-size: 14px;
  font-weight: 400;
`;

const OverviewNight = styled.h2`
  color: gray;
  font-size: 14px;
  font-weight: 400;
`;

const Buttons = styled.div`
  margin-top: auto;
  z-index: 2;
`;

const Button = styled.button`
  width: 90%;
  padding: 20px;
  border-radius: 10px;
  background-color: blue;
  color: white;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  z-index: 2;
`;

const NoButton = styled.button`
  width: 90%;
  padding: 20px;
  border-radius: 10px;
  background-color: gray;
  color: white;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  z-index: 2;
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

const Area = styled.div`
  background-color: transparent;
  flex-grow: 1;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 24px;
  justify-content: center;
`;

const CityCard = styled.div`
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  position: relative;
  width: 100%;
  height: 22vw;
  border-radius: 8px;
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
  width: 100%;
  height: 75%;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
`;

const CardTitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
`;

const CardSubtitle = styled.h2`
  font-size: 14px;
  font-weight: 300;
  color: ${(props) => props.theme.gray.semiblur};
`;

const CardContent = styled.div`
  padding: 20px;
  height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Container = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 100px;
  padding-left: 400px;
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
  align-items: center;
  width: 500px;
  padding: 10px 0;
  border-top: 1px solid lightgray;
  margin-bottom: 10px;
  &:hover {
    background-color: lightgray;
  }
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
  min-height: 50px;
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
