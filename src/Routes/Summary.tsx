import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { tripState, userState } from "../atoms";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { daysSinceSpecificDate, makeImagePath } from "../utils";
import Header from "../Components/Header";
import GoogleMapMarker from "../Components/GoogleMapMarker";

const Summary = () => {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [opened, setOpened] = useState(0);
  const [isToggleOpen, setIsToggleOpen] = useState(true);

  const [width, setWidth] = useState(150);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);

  const navigate = useNavigate();

  const startResize = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsResizing(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing !== null) {
      const newWidth = width - (e.clientX - startX);
      setWidth(Math.max(100, newWidth));
      setStartX(e.clientX);
    }
  };

  const stopResize = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    const handleMouseMoveLocal = (e: MouseEvent) => handleMouseMove(e);
    const handleStopResizeLocal = () => stopResize();

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMoveLocal);
      document.addEventListener("mouseup", handleStopResizeLocal);
    } else {
      document.removeEventListener("mousemove", handleMouseMoveLocal);
      document.removeEventListener("mouseup", handleStopResizeLocal);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMoveLocal);
      document.removeEventListener("mouseup", handleStopResizeLocal);
    };
  }, [isResizing]);

  const onCardClick = (ind: number) => {
    ind === opened ? setOpened(-1) : setOpened(ind);
  };

  const onNextClick = () => {
    navigate("/");
    setCurrentTrip("");
  };

  const onBackClick = () => {
    navigate(`/schedule/${userInfo[currentTrip].trips[0].destination?.name}`);
  };

  const calcDate = (year: number, month: number, day: number, daysToAdd: number): Date => {
    const baseDate = new Date(year, month - 1, day);
    const resultDate = new Date(baseDate);
    resultDate.setDate(baseDate.getDate() + daysToAdd);
    return resultDate;
  };

  return (
    <Wrapper>
      <Header now={4} />
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
                onCardClick(index);
              }}
              isnow={opened === index}
              key={index + "overview"}
            >
              <OverviewCardTitle
                onClick={() => {
                  setIsToggleOpen((current) => !current);
                }}
              >
                <OverviewCardName>{card.destination?.name}</OverviewCardName>
                <OverviewCardIcon>
                  {opened === index ? (
                    <FontAwesomeIcon icon={faAngleDown} />
                  ) : (
                    <FontAwesomeIcon icon={faAngleUp} />
                  )}
                </OverviewCardIcon>{" "}
              </OverviewCardTitle>
              {opened === index &&
                Object.values(userInfo[currentTrip].trips[index].detail.attractions).flat().length >
                  0 && (
                  <OverviewList>
                    {Object.values(userInfo[currentTrip].trips[index].detail.attractions)
                      .flat()
                      .map((e) => (
                        <OverviewPlace>
                          <OverviewPlacetitle>{e?.name}</OverviewPlacetitle>
                          <OverviewPlaceCateogory>
                            {Object.keys(
                              userInfo[currentTrip].trips[index].detail.attractions
                            ).filter((element) =>
                              userInfo[currentTrip].trips[index].detail.attractions[element].some(
                                (ele) => ele?.placeId === e?.placeId
                              )
                            )}
                          </OverviewPlaceCateogory>
                        </OverviewPlace>
                      ))}
                  </OverviewList>
                )}
            </OverviewCard>
          ))}
        </OverviewCitys>
        <Buttons>
          <Goback onClick={onBackClick}>이전 단계로</Goback>
          <Button onClick={onNextClick}>완료</Button>
        </Buttons>
      </Overview>
      <Container>
        <Main>
          {opened !== -1 &&
            Object.entries(userInfo[currentTrip].trips[opened].detail.attractions)
              .slice(1)
              .map((trip, index) => (
                <Board>
                  <BoardTitle>{trip[0]}</BoardTitle>
                  <BoardDate>
                    {userInfo[currentTrip].trips[opened].detail.date === "0|0" ? (
                      <EmptyDate>이전 화면으로 돌아가 날짜를 선택해주세요</EmptyDate>
                    ) : (
                      calcDate(
                        Number(userInfo[currentTrip].trips[opened].detail.date.split(".")[0]),
                        Number(userInfo[currentTrip].trips[opened].detail.date.split(".")[1]),
                        Number(userInfo[currentTrip].trips[opened].detail.date.split(".")[2]),
                        index
                      ).getFullYear() +
                      "." +
                      (calcDate(
                        Number(userInfo[currentTrip].trips[opened].detail.date.split(".")[0]),
                        Number(userInfo[currentTrip].trips[opened].detail.date.split(".")[1]),
                        Number(userInfo[currentTrip].trips[opened].detail.date.split(".")[2]),
                        index
                      ).getMonth() +
                        1) +
                      "." +
                      calcDate(
                        Number(userInfo[currentTrip].trips[opened].detail.date.split(".")[0]),
                        Number(userInfo[currentTrip].trips[opened].detail.date.split(".")[1]),
                        Number(userInfo[currentTrip].trips[opened].detail.date.split(".")[2]),
                        index
                      ).getDate() +
                      " (" +
                      ["일", "월", "화", "수", "목", "금", "토"][
                        calcDate(
                          Number(userInfo[currentTrip].trips[opened].detail.date.split(".")[0]),
                          Number(userInfo[currentTrip].trips[opened].detail.date.split(".")[1]),
                          Number(userInfo[currentTrip].trips[opened].detail.date.split(".")[2]),
                          index
                        ).getDay()
                      ] +
                      ")"
                    )}
                  </BoardDate>
                  <PlaceList>
                    {trip[1].map((place, ind) => (
                      <Card>
                        <Num>{ind + 1}</Num>

                        <PlaceBox>
                          <PlacePhoto
                            bgphoto={`url(${makeImagePath(
                              place?.image ? place?.image[0] : "",
                              500
                            )})`}
                          />
                          <PlaceContent>
                            <PlaceTitle>{place?.name}</PlaceTitle>
                            <PlaceAddress>{place?.address}</PlaceAddress>
                          </PlaceContent>
                        </PlaceBox>
                      </Card>
                    ))}
                  </PlaceList>
                </Board>
              ))}
        </Main>
        <MapColumn width={width}>
          <MapBox>
            <GoogleMapMarker
              markers={Object.values(userInfo[currentTrip].trips[opened].detail.attractions)
                .map((e) => {
                  return e.map((ele) => {
                    return {
                      lat: ele?.geo.lat ? ele?.geo.lat : 0,
                      lng: ele?.geo.lng ? ele?.geo.lng : 0,
                    };
                  });
                })
                .flat()}
              hotels={userInfo[currentTrip].trips[opened].detail.hotels.map((e) => {
                return {
                  lat: e?.geo.lat ? e?.geo.lat : 0,
                  lng: e?.geo.lng ? e?.geo.lng : 0,
                };
              })}
              center={
                Object.values(userInfo[currentTrip].trips[opened].detail.attractions)
                  .map((e) => {
                    return e.map((ele) => {
                      return {
                        lat: ele?.geo.lat ? ele?.geo.lat : 0,
                        lng: ele?.geo.lng ? ele?.geo.lng : 0,
                      };
                    });
                  })
                  .flat()[0]
              }
            />
          </MapBox>
          <ResizeHandle onMouseDown={startResize} />
        </MapColumn>
      </Container>
    </Wrapper>
  );
};

export default Summary;

const Wrapper = styled.div`
  display: flex;
  overflow-x: auto;
  min-height: 100vh;
  &::-webkit-scrollbar {
    background-color: transparent;
    width: 5px;
    height: 5px;
    display: block;
    /* margin-bottom: 10px; */
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

const Container = styled.div`
  padding-left: 300px;
  padding-top: 80px;
  display: flex;
`;

const Title = styled.h2`
  font-size: 21px;
  font-weight: 600;
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
  padding: 0 28px;
  &:hover {
    background-color: white;
  }
`;

const OverviewCardTitle = styled.div`
  width: 100%;
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

const OverviewList = styled.div`
  border-top: 1px solid #f2f2f2;
`;

const OverviewPlace = styled.div`
  padding: 13px 0 13px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OverviewPlacetitle = styled.h2`
  font-size: 14px;
  font-weight: 400;
`;

const OverviewPlaceCateogory = styled.h2`
  font-size: 12px;
  font-weight: 300;
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

const Main = styled.div`
  display: flex;
  overflow-x: auto;
  padding-top: 50px;
`;

const Board = styled.div`
  width: 400px;
  border-right: 1px solid #f2f2f2;
  padding: 0 28px;
  min-height: 100%;
  overflow-y: auto;
`;

const BoardTitle = styled.h2`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 16px;
`;

const BoardDate = styled.h2`
  font-size: 14px;
  font-weight: 400;
  color: ${(props) => props.theme.gray.accent};
  margin-bottom: 30px;
`;

const EmptyDate = styled.h2``;

const PlaceList = styled.div``;

const PlaceBox = styled.div`
  display: flex;
  width: 308px;
  border-radius: 10px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
`;

const PlacePhoto = styled.div<{ bgphoto: string }>`
  background: ${(props) => props.bgphoto};
  background-position: center;
  background-size: cover;
  width: 80px;
  height: 80px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;

const PlaceContent = styled.div`
  padding: 12px;
`;

const PlaceTitle = styled.h2`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 7px;
`;

const PlaceAddress = styled.h2`
  font-size: 12px;
  font-weight: 300;
`;

const Num = styled.h2`
  width: 20px;
  height: 20px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${(props) => props.theme.blue.light};
  color: ${(props) => props.theme.blue.accent};
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const MapColumn = styled.div<{ width: number }>`
  width: ${(props) => props.width}px;
  max-width: 98vw;
  height: calc(100vh - 80px);
  position: fixed;
  top: 80px;
  right: 0;
`;

const MapBox = styled.div`
  width: 100%;
  height: 100%;
  resize: horizontal;
  overflow: auto;
  background-color: white;
`;

const ResizeHandle = styled.div`
  position: absolute;
  top: 0px;
  left: 0;
  width: 10px;
  height: 100%;
  z-index: 3;
  cursor: ew-resize;
`;
