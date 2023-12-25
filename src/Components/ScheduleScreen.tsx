import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Link, PathMatch, useMatch, useNavigate } from "react-router-dom";

import { isCalendarState, tripState, userState } from "../atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { IPlaceDetail } from "../api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IGeAutoCompletePlacesResult, getAutoCompletePlacesResult } from "../api";
import { useQuery } from "react-query";
import PlaceCard from "./PlaceCard";
import { ReactComponent as Search } from "../assets/search.svg";
import JourneyCard from "./JourneyCard";
import GoogleMapMarker from "./GoogleMapMarker";
import SmallCalender from "./SmallCalendar";
import BoardNoName from "./BoardNoName";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import JourneyBoard from "../Components/BoardJourney";
import DragJourneyCard from "./DragJourneyCard";
import GoogleRouteMap from "./GoogleRouteMap";

const ScheduleScreen = ({ destination }: IScheduleScreenProps) => {
  const navigate = useNavigate();
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const scheduleMatch: PathMatch<string> | null = useMatch("/schedule/:city");
  const [isCalendarOpen, setIsCalendarOpen] = useRecoilState(isCalendarState);
  const [stage, setStage] = useState(0);

  const onNextClick = () => {
    navigate(`/place`);
    setIsCalendarOpen(false);
  };

  const onPrevClick = () => {
    navigate(`/place/${destination?.name}`);
    setIsCalendarOpen(false);
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

  return (
    <>
      {scheduleMatch && scheduleMatch?.params.city === destination?.name && (
        <Wrapper>
          <NavColumn>
            <NavBox isnow={stage === 0} onClick={() => setStage(0)}>
              <NavTitle>전체</NavTitle>
            </NavBox>
            {Object.keys(
              userInfo[currentTrip].trips[
                userInfo[currentTrip].trips.findIndex(
                  (e) => e.destination?.name === destination?.name
                )
              ].detail.attractions
            ).map(
              (title, ind) =>
                ind !== 0 && (
                  <NavBox
                    isnow={stage === ind}
                    onClick={() => {
                      setStage(ind);
                    }}
                  >
                    <NavTitle>{title}</NavTitle>
                    <NavSubtitle>
                      {calcDate(
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
                        ind - 1
                      ).getMonth() + 1}
                      .
                      {calcDate(
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
                        ind - 1
                      ).getDate()}
                      (
                      {
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
                            ind - 1
                          ).getDay()
                        ]
                      }
                      )
                    </NavSubtitle>
                  </NavBox>
                )
            )}
            <NavButtons>
              <NavPrevButton onClick={onPrevClick}>이전</NavPrevButton>

              <NavButton onClick={onNextClick}>다음</NavButton>
            </NavButtons>
          </NavColumn>
          {stage === 0 ? (
            <BoardColumn>
              <DragDropContext onDragEnd={onDragEnd}>
                <NamedJourney>
                  <Title>{destination?.name}</Title>
                  <Duration>
                    {userInfo[currentTrip].trips[
                      userInfo[currentTrip].trips.findIndex(
                        (e) => e.destination?.name === destination?.name
                      )
                    ].detail.date === "0|0" ? (
                      "날짜를 선택해 주세요."
                    ) : (
                      <>
                        {userInfo[currentTrip].trips[
                          userInfo[currentTrip].trips.findIndex(
                            (e) => e.destination?.name === destination?.name
                          )
                        ].detail.date
                          .split("|")[0]
                          .slice(
                            0,
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.date.split("|")[0].length - 2
                          )}
                        (
                        {
                          ["일", "월", "화", "수", "목", "금", "토"][
                            Number(
                              userInfo[currentTrip].trips[
                                userInfo[currentTrip].trips.findIndex(
                                  (e) => e.destination?.name === destination?.name
                                )
                              ].detail.date
                                .split("|")[0]
                                .split(".")[3]
                            )
                          ]
                        }
                        ){" ~ "}
                        {userInfo[currentTrip].trips[
                          userInfo[currentTrip].trips.findIndex(
                            (e) => e.destination?.name === destination?.name
                          )
                        ].detail.date
                          .split("|")[1]
                          .slice(
                            0,
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.date.split("|")[1].length - 2
                          )}
                        (
                        {
                          ["일", "월", "화", "수", "목", "금", "토"][
                            Number(
                              userInfo[currentTrip].trips[
                                userInfo[currentTrip].trips.findIndex(
                                  (e) => e.destination?.name === destination?.name
                                )
                              ].detail.date
                                .split("|")[1]
                                .split(".")[3]
                            )
                          ]
                        }
                        )
                      </>
                    )}
                  </Duration>
                  <Boards>
                    <DroppableBoards>
                      {Object.keys(
                        userInfo[currentTrip].trips[
                          userInfo[currentTrip].trips.findIndex(
                            (e) => e.destination?.name === destination?.name
                          )
                        ].detail.attractions
                      ).map((boardName, index) => {
                        return (
                          boardName !== "NoName" && (
                            <JourneyBoard
                              journey={
                                userInfo[currentTrip].trips[
                                  userInfo[currentTrip].trips.findIndex(
                                    (e) => e.destination?.name === destination?.name
                                  )
                                ].detail.attractions[boardName]
                              }
                              key={boardName}
                              boardId={boardName}
                              destination={destination}
                              index={index}
                            />
                          )
                        );
                      })}
                    </DroppableBoards>
                  </Boards>
                </NamedJourney>
                <NoName>
                  <NoNameBoard>
                    <BoardNoName
                      journey={
                        userInfo[currentTrip].trips[
                          userInfo[currentTrip].trips.findIndex(
                            (e) => e.destination?.name === destination?.name
                          )
                        ].detail.attractions["NoName"]
                      }
                      boardId={"NoName"}
                      key={"NoName"}
                      destination={destination}
                    />
                  </NoNameBoard>
                </NoName>
              </DragDropContext>
            </BoardColumn>
          ) : (
            <BigColumn>
              <SingleBoardColumn>
                <Header>
                  <HeaderTitle>{destination?.name}</HeaderTitle>
                  <HeaderDuration>
                    {userInfo[currentTrip].trips[
                      userInfo[currentTrip].trips.findIndex(
                        (e) => e.destination?.name === destination?.name
                      )
                    ].detail.date === "" ? (
                      "날짜를 선택해 주세요."
                    ) : (
                      <>
                        {userInfo[currentTrip].trips[
                          userInfo[currentTrip].trips.findIndex(
                            (e) => e.destination?.name === destination?.name
                          )
                        ].detail.date
                          .split("|")[0]
                          .slice(
                            0,
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.date.split("|")[0].length - 2
                          )}
                        (
                        {
                          ["일", "월", "화", "수", "목", "금", "토"][
                            Number(
                              userInfo[currentTrip].trips[
                                userInfo[currentTrip].trips.findIndex(
                                  (e) => e.destination?.name === destination?.name
                                )
                              ].detail.date
                                .split("|")[0]
                                .split(".")[3]
                            )
                          ]
                        }
                        ){" ~ "}
                        {userInfo[currentTrip].trips[
                          userInfo[currentTrip].trips.findIndex(
                            (e) => e.destination?.name === destination?.name
                          )
                        ].detail.date
                          .split("|")[1]
                          .slice(
                            0,
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.date.split("|")[0].length - 2
                          )}
                        (
                        {
                          ["일", "월", "화", "수", "목", "금", "토"][
                            Number(
                              userInfo[currentTrip].trips[
                                userInfo[currentTrip].trips.findIndex(
                                  (e) => e.destination?.name === destination?.name
                                )
                              ].detail.date
                                .split("|")[1]
                                .split(".")[3]
                            )
                          ]
                        }
                        )
                      </>
                    )}
                  </HeaderDuration>
                </Header>
                <BoardHeader>
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
                    {calcDate(
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
                    ).getFullYear()}
                    .
                    {calcDate(
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
                    ).getMonth() + 1}
                    .
                    {calcDate(
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
                    ).getDate()}
                    (
                    {
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
                      ]
                    }
                    )
                  </BoardDate>
                </BoardHeader>

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable
                    droppableId={
                      Object.keys(
                        userInfo[currentTrip].trips[
                          userInfo[currentTrip].trips.findIndex(
                            (e) => e.destination?.name === destination?.name
                          )
                        ].detail.attractions
                      )[stage]
                    }
                  >
                    {(provided, snapshot) => (
                      <Area
                        isDraggingOver={snapshot.isDraggingOver}
                        isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {Object.values(
                          userInfo[currentTrip].trips[
                            userInfo[currentTrip].trips.findIndex(
                              (e) => e.destination?.name === destination?.name
                            )
                          ].detail.attractions
                        )[stage].map(
                          (j, i) =>
                            j && (
                              <DragJourneyCard
                                key={j.timestamp + ""}
                                index={i}
                                journeyId={j.timestamp + ""}
                                journeyName={j.name}
                                journeyAddress={j.address}
                                journeyPhoto={j.image[0]}
                                destination={destination}
                              />
                            )
                        )}
                        {provided.placeholder}
                      </Area>
                    )}
                  </Droppable>
                </DragDropContext>
              </SingleBoardColumn>
              <MapColumn>
                {Object.values(
                  userInfo[currentTrip].trips[
                    userInfo[currentTrip].trips.findIndex(
                      (e) => e.destination?.name === destination?.name
                    )
                  ].detail.attractions
                )[stage].length > 0 ? (
                  Object.values(
                    userInfo[currentTrip].trips[
                      userInfo[currentTrip].trips.findIndex(
                        (e) => e.destination?.name === destination?.name
                      )
                    ].detail.attractions
                  )[stage].length > 1 ? (
                    Object.values(
                      userInfo[currentTrip].trips[
                        userInfo[currentTrip].trips.findIndex(
                          (e) => e.destination?.name === destination?.name
                        )
                      ].detail.attractions
                    )[stage].length > 2 ? (
                      <GoogleRouteMap
                        origin={`place_id:${
                          Object.values(
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.attractions
                          )[stage][0]?.placeId
                        }`}
                        destination={`place_id:${
                          Object.values(
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.attractions
                          )[stage][
                            Object.values(
                              userInfo[currentTrip].trips[
                                userInfo[currentTrip].trips.findIndex(
                                  (e) => e.destination?.name === destination?.name
                                )
                              ].detail.attractions
                            )[stage].length - 1
                          ]?.placeId
                        }`}
                        waypoints={Object.values(
                          userInfo[currentTrip].trips[
                            userInfo[currentTrip].trips.findIndex(
                              (e) => e.destination?.name === destination?.name
                            )
                          ].detail.attractions
                        )[stage].map((e, i) => {
                          if (
                            e &&
                            i > 0 &&
                            i <
                              Object.values(
                                userInfo[currentTrip].trips[
                                  userInfo[currentTrip].trips.findIndex(
                                    (e) => e.destination?.name === destination?.name
                                  )
                                ].detail.attractions
                              )[stage].length -
                                1
                          )
                            return e.placeId;
                          else return;
                        })}
                        width="100%"
                        height="100%"
                        zoom={13}
                      />
                    ) : (
                      <GoogleRouteMap
                        origin={`place_id:${
                          Object.values(
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.attractions
                          )[stage][0]?.placeId
                        }`}
                        destination={`place_id:${
                          Object.values(
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.attractions
                          )[stage][
                            Object.values(
                              userInfo[currentTrip].trips[
                                userInfo[currentTrip].trips.findIndex(
                                  (e) => e.destination?.name === destination?.name
                                )
                              ].detail.attractions
                            )[stage].length - 1
                          ]?.placeId
                        }`}
                        waypoints={[]}
                        width="100%"
                        height="100%"
                        zoom={13}
                      />
                    )
                  ) : (
                    <GoogleRouteMap
                      origin={`place_id:${
                        Object.values(
                          userInfo[currentTrip].trips[
                            userInfo[currentTrip].trips.findIndex(
                              (e) => e.destination?.name === destination?.name
                            )
                          ].detail.attractions
                        )[stage][0]?.placeId
                      }`}
                      destination={""}
                      waypoints={[]}
                      width="100%"
                      height="100%"
                      zoom={14}
                    />
                  )
                ) : (
                  <Loader>경로를 표시할 장소가 존재하지 않습니다.</Loader>
                )}
              </MapColumn>
            </BigColumn>
          )}
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

const Loader = styled.h2``;

const NavColumn = styled.div`
  width: 150px;
  height: 100%;
  padding: 32px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid ${(props) => props.theme.gray.blur};
  overflow-y: auto;
`;

const BoardColumn = styled.div`
  width: 92%;
  height: 100%;
  display: flex;
  overflow: auto;
`;

const BigColumn = styled.div`
  width: 92%;
  height: 100%;
  display: flex;
`;

const SingleBoardColumn = styled.div`
  width: 500px;
  padding: 16px 32px;
`;

const MapColumn = styled.div`
  width: calc(100vw - 400px);
  height: 100vh;
`;

const NoName = styled.div`
  width: 330px;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  background-color: white;
  z-index: 3;
`;

const NoNameBoard = styled.div`
  width: 100%;
  height: 100%;
`;

const NamedJourney = styled.div`
  height: 100%;
  padding: 32px;
  width: calc(100vw - 500px);
`;

const Boards = styled.div`
  flex-wrap: nowrap;
  overflow-x: auto;
  height: calc(100% - 50px);
  width: 100%;
`;

const DroppableBoards = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  height: 100%;
`;

const NavBox = styled.div<{ isnow: boolean }>`
  padding: 25px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.2);
  border-radius: 14px;
  margin-bottom: 25px;
  cursor: pointer;
  background-color: ${(props) => (props.isnow ? props.theme.blue.accent : "transparent")};
  h2 {
    color: ${(props) => props.isnow && "white"};
  }
`;

const NavTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
`;

const NavSubtitle = styled.h2`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.gray.blur};
`;

const NavButtons = styled.div`
  margin-top: auto;
  width: 100%;
`;

const NavPrevButton = styled.button`
  padding: 25px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.2);
  border-radius: 14px;
  margin-bottom: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
`;

const NavButton = styled.button`
  padding: 25px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.2);
  border-radius: 14px;
  margin-bottom: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  background-color: black;
  color: white;
`;

const Title = styled.h2`
  font-size: 21px;
  font-weight: 600;
`;

const Duration = styled.h2`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.gray.blur};
  margin-bottom: 15px;
  cursor: pointer;
`;

const HeaderTitle = styled.h2`
  font-size: 21px;
  font-weight: 500;
  margin-right: 15px;
`;

const HeaderDuration = styled.h2`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.gray.blur};
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const BoardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BoardTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
`;

const BoardDate = styled.h2`
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.theme.gray.blur};
`;

const Area = styled.div<IDragging>`
  background-color: transparent;
  flex-grow: 1;
  height: 100%;
`;

interface IScheduleScreenProps {
  destination: IPlaceDetail | undefined;
}

interface IForm {
  keyword: string;
}

interface IDragging {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
