import styled from "styled-components";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";

import { isCalendarState, tripState, userState } from "../atoms";
import { useRecoilState } from "recoil";
import { IPlaceDetail } from "../api";
import { useState } from "react";
import BoardNoName from "./BoardNoName";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import JourneyBoard from "../Components/BoardJourney";
import GoogleRouteMap from "./GoogleRouteMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faAngleUp,
} from "@fortawesome/free-solid-svg-icons";
import { daysSinceSpecificDate } from "../utils";

const ScheduleScreen = ({ destination }: IScheduleScreenProps) => {
  const navigate = useNavigate();
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const scheduleMatch: PathMatch<string> | null = useMatch("/schedule/:city");
  const [isCalendarOpen, setIsCalendarOpen] = useRecoilState(isCalendarState);
  const [stage, setStage] = useState(1);
  const [isToggleOpen, setIsToggleOpen] = useState(true);

  const onNextClick = () => {
    navigate(`/summary`);
    setIsCalendarOpen(false);
  };

  const onBackClick = () => {
    navigate(`/place/${destination?.name}`);
    setIsCalendarOpen(false);
  };

  const onCardClick = (name: string | undefined) => {
    navigate(`/schedule/${name}`);
  };

  const calcDate = (year: number, month: number, day: number, daysToAdd: number): Date => {
    const baseDate = new Date(year, month - 1, day);
    const resultDate = new Date(baseDate);
    resultDate.setDate(baseDate.getDate() + daysToAdd);
    return resultDate;
  };

  const onDragEnd = (info: DropResult) => {
    const { destination: dropDestination, source } = info;
    if (!dropDestination) return;
    else if (dropDestination.droppableId === source.droppableId) {
      setUserInfo((current) => {
        const one = { ...current };
        const two = { ...one[currentTrip] };
        const three = [...two.trips];
        const index = three.findIndex((e) => e.destination?.name === destination?.name);
        const four = { ...three[index] };
        const five = { ...four.detail };
        const six = { ...five.attractions };
        const seven = [...six[source.droppableId]];

        const target = [...seven][source.index];
        seven.splice(source.index, 1);
        seven.splice(dropDestination.index, 0, target);

        if (!target) return current;

        const newSix = { ...six, [source.droppableId]: seven };
        const newFive = { ...five, ["attractions"]: newSix };
        const newFour = { ...four, ["detail"]: newFive };
        const newThree = [...three.slice(0, index), newFour, ...three.slice(index + 1)];
        const newTwo = { ...two, ["trips"]: newThree };
        const newOne = { ...current, [currentTrip]: newTwo };

        return newOne;
      });
    } else {
      setUserInfo((current) => {
        const one = { ...current };
        const two = { ...one[currentTrip] };
        const three = [...two.trips];
        const index = three.findIndex((e) => e.destination?.name === destination?.name);
        const four = { ...three[index] };
        const five = { ...four.detail };
        const six = { ...five.attractions };
        const seven = [...six[source.droppableId]];

        const sevenTwin = [...six[dropDestination.droppableId]];
        const target = [...seven][source.index];
        seven.splice(source.index, 1);
        sevenTwin.splice(dropDestination.index, 0, target);

        if (!target) return current;

        const newSix = {
          ...six,
          [source.droppableId]: seven,
          [dropDestination.droppableId]: sevenTwin,
        };
        const newFive = { ...five, ["attractions"]: newSix };
        const newFour = { ...four, ["detail"]: newFive };
        const newThree = [...three.slice(0, index), newFour, ...three.slice(index + 1)];
        const newTwo = { ...two, ["trips"]: newThree };
        const newOne = { ...current, [currentTrip]: newTwo };

        return newOne;
      });
    }
  };

  const onRightClick = () => {
    stage <
      Object.keys(
        userInfo[currentTrip].trips[
          userInfo[currentTrip].trips.findIndex((e) => e.destination?.name === destination?.name)
        ].detail.attractions
      ).length -
        1 && setStage((current) => current + 1);
  };

  const onLeftClick = () => {
    stage !== 1 && setStage((current) => current - 1);
  };

  return (
    <>
      {scheduleMatch && scheduleMatch?.params.city === destination?.name && (
        <Wrapper>
          <DragDropContext onDragEnd={onDragEnd}>
            <Overview>
              <TitleBox>
                <Title>{currentTrip}</Title>
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
                {userInfo[currentTrip].trips.map((card, index) => (
                  <OverviewCard
                    onClick={() => {
                      card.destination?.name !== destination?.name &&
                        onCardClick(card.destination?.name);
                    }}
                    isnow={card.destination?.name === destination?.name}
                    key={card.destination?.name && card.destination?.name + index + "overview"}
                  >
                    <OverviewCardTitle
                      onClick={() => {
                        setIsToggleOpen((current) => !current);
                      }}
                    >
                      <OverviewCardName>{card.destination?.name}</OverviewCardName>
                      <OverviewCardIcon>
                        {card.destination?.name === destination?.name ? (
                          <FontAwesomeIcon icon={faAngleDown} />
                        ) : (
                          <FontAwesomeIcon icon={faAngleUp} />
                        )}
                      </OverviewCardIcon>{" "}
                    </OverviewCardTitle>
                    {card.destination?.name === destination?.name &&
                      Object.values(
                        userInfo[currentTrip].trips[
                          userInfo[currentTrip].trips.findIndex(
                            (e) => e.destination?.name === destination?.name
                          )
                        ].detail.attractions
                      ).flat().length > 0 &&
                      isToggleOpen && (
                        <BoardNoName
                          journey={Object.values(
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.attractions
                          ).flat()}
                          boardId={"NoName"}
                          key={"NoName"}
                          destination={destination}
                        />
                      )}
                  </OverviewCard>
                ))}
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

            <Container>
              <SingleBoardColumn>
                <BoardHeader>
                  <BoardContents>
                    <BoardTitle>
                      {
                        Object.keys(
                          userInfo[currentTrip].trips[
                            userInfo[currentTrip].trips.findIndex(
                              (e) => e.destination?.name === destination?.name
                            )
                          ].detail.attractions
                        )[stage]
                      }
                    </BoardTitle>
                    <BoardDate>
                      {userInfo[currentTrip].trips[
                        userInfo[currentTrip].trips.findIndex(
                          (e) => e.destination?.name === destination?.name
                        )
                      ].detail.date === "0|0" ? (
                        <EmptyDate>이전 화면으로 돌아가 날짜를 선택해주세요</EmptyDate>
                      ) : (
                        calcDate(
                          Number(
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.date.split(".")[0]
                          ),
                          Number(
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.date.split(".")[1]
                          ),
                          Number(
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.date.split(".")[2]
                          ),
                          stage - 1
                        ).getFullYear() +
                        "." +
                        calcDate(
                          Number(
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.date.split(".")[0]
                          ),
                          Number(
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.date.split(".")[1]
                          ),
                          Number(
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.date.split(".")[2]
                          ),
                          stage - 1
                        ).getMonth() +
                        1 +
                        "." +
                        calcDate(
                          Number(
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.date.split(".")[0]
                          ),
                          Number(
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.date.split(".")[1]
                          ),
                          Number(
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.date.split(".")[2]
                          ),
                          stage - 1
                        ).getDate() +
                        " (" +
                        ["일", "월", "화", "수", "목", "금", "토"][
                          calcDate(
                            Number(
                              userInfo[currentTrip].trips[
                                userInfo[currentTrip].trips.findIndex(
                                  (e) => e.destination?.name === destination?.name
                                )
                              ].detail.date.split(".")[0]
                            ),
                            Number(
                              userInfo[currentTrip].trips[
                                userInfo[currentTrip].trips.findIndex(
                                  (e) => e.destination?.name === destination?.name
                                )
                              ].detail.date.split(".")[1]
                            ),
                            Number(
                              userInfo[currentTrip].trips[
                                userInfo[currentTrip].trips.findIndex(
                                  (e) => e.destination?.name === destination?.name
                                )
                              ].detail.date.split(".")[2]
                            ),
                            stage - 1
                          ).getDay()
                        ] +
                        ")"
                      )}
                    </BoardDate>
                  </BoardContents>
                  <BoardPages>
                    {stage === 1 ? (
                      <NoIcon>
                        {" "}
                        <FontAwesomeIcon icon={faAngleLeft} />
                      </NoIcon>
                    ) : (
                      <BoardIcon onClick={onLeftClick}>
                        <FontAwesomeIcon icon={faAngleLeft} />
                      </BoardIcon>
                    )}
                    {stage ===
                    Object.keys(
                      userInfo[currentTrip].trips[
                        userInfo[currentTrip].trips.findIndex(
                          (e) => e.destination?.name === destination?.name
                        )
                      ].detail.attractions
                    ).length -
                      1 ? (
                      <NoIcon>
                        <FontAwesomeIcon icon={faAngleRight} />
                      </NoIcon>
                    ) : (
                      <BoardIcon onClick={onRightClick}>
                        <FontAwesomeIcon icon={faAngleRight} />
                      </BoardIcon>
                    )}
                  </BoardPages>
                </BoardHeader>
                <JourneyBoard
                  journey={
                    userInfo[currentTrip].trips[
                      userInfo[currentTrip].trips.findIndex(
                        (e) => e.destination?.name === destination?.name
                      )
                    ].detail.attractions[
                      Object.keys(
                        userInfo[currentTrip].trips[
                          userInfo[currentTrip].trips.findIndex(
                            (e) => e.destination?.name === destination?.name
                          )
                        ].detail.attractions
                      )[stage]
                    ]
                  }
                  key={
                    Object.keys(
                      userInfo[currentTrip].trips[
                        userInfo[currentTrip].trips.findIndex(
                          (e) => e.destination?.name === destination?.name
                        )
                      ].detail.attractions
                    )[stage]
                  }
                  boardId={
                    Object.keys(
                      userInfo[currentTrip].trips[
                        userInfo[currentTrip].trips.findIndex(
                          (e) => e.destination?.name === destination?.name
                        )
                      ].detail.attractions
                    )[stage]
                  }
                  destination={destination}
                />
              </SingleBoardColumn>
              <MapColumn>
                {Object.values(
                  userInfo[currentTrip].trips[
                    userInfo[currentTrip].trips.findIndex(
                      (e) => e.destination?.name === destination?.name
                    )
                  ].detail.attractions
                )[stage] ? (
                  Object.values(
                    userInfo[currentTrip].trips[
                      userInfo[currentTrip].trips.findIndex(
                        (e) => e.destination?.name === destination?.name
                      )
                    ].detail.attractions
                  )[stage].length > 0 ? (
                    <GoogleRouteMap
                      origin={`place_id:${
                        userInfo[currentTrip].trips[
                          userInfo[currentTrip].trips.findIndex(
                            (e) => e.destination?.name === destination?.name
                          )
                        ].detail.hotels[0]?.placeId
                      }`}
                      destination={`place_id:${
                        userInfo[currentTrip].trips[
                          userInfo[currentTrip].trips.findIndex(
                            (e) => e.destination?.name === destination?.name
                          )
                        ].detail.hotels[0]?.placeId
                      }`}
                      waypoints={Object.values(
                        userInfo[currentTrip].trips[
                          userInfo[currentTrip].trips.findIndex(
                            (e) => e.destination?.name === destination?.name
                          )
                        ].detail.attractions
                      )[stage].map((e, i) => {
                        if (e) return e.placeId;
                        else return;
                      })}
                      width="100%"
                      height="100%"
                      zoom={13}
                    />
                  ) : (
                    <Loader>경로를 표시할 장소가 존재하지 않습니다.</Loader>
                  )
                ) : (
                  <></>
                )}
              </MapColumn>
            </Container>
          </DragDropContext>
        </Wrapper>
      )}
    </>
  );
};

export default ScheduleScreen;

const Wrapper = styled.div`
  background-color: white;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
`;

const Container = styled.div`
  padding-left: 300px;
  padding-top: 80px;
  display: flex;
`;

const Loader = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 300;
  height: 100%;
  color: ${(props) => props.theme.gray.normal};
`;

const SingleBoardColumn = styled.div`
  width: 400px;
  padding: 28px;
  padding-top: 50px;
`;

const MapColumn = styled.div`
  width: calc(100vw - 700px);
  height: 100%;
`;

const Title = styled.h2`
  font-size: 21px;
  font-weight: 600;
`;

const BoardHeader = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BoardContents = styled.div``;

const BoardTitle = styled.h2`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 16px;
`;

const BoardPages = styled.div`
  display: flex;
`;

const BoardIcon = styled.h2`
  font-size: 16px;
  color: ${(props) => props.theme.gray.normal};
  cursor: pointer;
  margin: 0 6px;
`;

const NoIcon = styled.h2`
  font-size: 16px;
  color: ${(props) => props.theme.gray.blur};
  margin: 0 6px;
`;

const BoardDate = styled.h2`
  font-size: 14px;
  font-weight: 400;
  color: ${(props) => props.theme.gray.normal};
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

const OverviewNight = styled.h2`
  color: ${(props) => props.theme.gray.accent};
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  padding: 0 28px;
`;

const OverviewCitys = styled.div`
  width: 100%;
  height: 500px;
  overflow-y: auto;
  margin-top: 50px;
`;

const OverviewCard = styled.div<{ isnow: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.isnow && "white"};
  &:hover {
    background-color: white;
  }
`;

const OverviewCardTitle = styled.div`
  width: 100%;
  padding: 0 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const OverviewCardName = styled.h2`
  font-size: 14px;
  font-weight: 400;
  padding: 16px 0;
  display: flex;
  align-items: center;
`;

const OverviewCardIcon = styled.h2`
  font-size: 12px;
  color: ${(props) => props.theme.gray.normal};
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

const TitleBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 28px;
`;

const EmptyDate = styled.h2`
  font-size: 14px;
  font-weight: 300;
  color: ${(props) => props.theme.gray.normal};
  display: flex;
  align-items: center;
`;

interface IScheduleScreenProps {
  destination: IPlaceDetail | undefined;
}

interface IDragging {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
