import { useRecoilState } from "recoil";
import { destinationState, userState, tripState } from "../atoms";
import styled from "styled-components";
import { IGeAutoCompletePlacesResult, getAutoCompletePlacesResult } from "../api";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import PlaceCard from "../Components/PlaceCard";
import JourneyCard from "../Components/JourneyCard";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHotel } from "@fortawesome/free-solid-svg-icons";
import { faFortAwesome } from "@fortawesome/free-brands-svg-icons";
import HotelCard from "../Components/HotelCard";
import { makeImagePath } from "../utils";
import NavigationBar from "../Components/NavigationBar";
import Header from "../Components/Header";
import DestinationCard from "../Components/DestinationCard";
import CityCard from "../Components/CityCard";
import { daysSinceSpecificDate } from "../utils";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";

const Place = () => {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [isHotel, setIsHotel] = useState(false);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [isInputOpen, setIsInputOpen] = useState(false);

  const { register, handleSubmit } = useForm<IForm>();

  const onValid = (data: IForm) => {
    setIsInputOpen(false);
    const newName = data.keyword;
    newName &&
      setUserInfo((current) => {
        const copy = { ...current[currentTrip] };
        const temp = { ...current };
        delete temp[currentTrip];
        return { ...temp, [newName]: copy };
      });
    newName && setCurrentTrip(data.keyword);
  };

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

  return (
    <Wrapper>
      <Header now={2} />
      <Overview>
        <TitleBox>
          {isInputOpen ? (
            <TitleForm onSubmit={handleSubmit(onValid)}>
              <TitleInput
                {...register("keyword")}
                autoComplete="off"
                autoFocus
                placeholder={currentTrip}
              />
            </TitleForm>
          ) : (
            <Title>{currentTrip}</Title>
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
                          key={
                            card.destination?.name && card.destination?.name + index + "overview"
                          }
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <OverviewCardName>{card.destination?.name}</OverviewCardName>
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
          {userInfo[currentTrip].trips.length > 0 ? (
            <Button>완료</Button>
          ) : (
            <NoButton>완료</NoButton>
          )}
        </Buttons>
      </Overview>
      <Main>
        <Citys>
          {userInfo[currentTrip].trips.map((city, index) => (
            <CityCard
              key={city.destination?.name && city.destination?.name + index}
              destination={city.destination}
            />
          ))}
        </Citys>
      </Main>
    </Wrapper>
  );
};

export default Place;

const Wrapper = styled(motion.div)`
  width: 100vw;
  min-height: 100vh;
  padding: 0 300px;
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

const OverviewCitys = styled.div`
  width: 100%;
`;

const OverviewCard = styled.div`
  width: 100%;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
`;

const OverviewCardName = styled.h2`
  font-size: 14px;
  font-weight: 400;
  color: black;
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

const TitleBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  min-width: 80px;
  padding: 3px 5px;
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
  /* margin-bottom: 8px; */
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

const TripDuration = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.gray.semiblur};
`;

const Citys = styled.div`
  margin-top: 36px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 15px;
  padding-bottom: 50px;
`;

const Main = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Area = styled.div<IDragging>`
  background-color: transparent;
  flex-grow: 1;
  min-height: 50vh;
`;

interface IForm {
  keyword: string;
}

interface IDragging {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
