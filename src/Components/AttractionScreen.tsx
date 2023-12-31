import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import { ITripDetails, isCalendarState, tripState, userState } from "../atoms";
import { useRecoilState } from "recoil";
import { IPlaceDetail } from "../api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IGeAutoCompletePlacesResult, getAutoCompletePlacesResult } from "../api";
import { useQuery } from "react-query";
import PlaceCard from "./PlaceCard";
import { ReactComponent as Search } from "../assets/search.svg";
import JourneyCard from "./JourneyCard";
import GoogleMapMarker from "./GoogleMapMarker";
import SmallCalender from "./SmallCalendar";
import { daysSinceSpecificDate } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import HotelCard from "./HotelCard";

const AttractionScreen = ({ destination }: IAttractionScreenProps) => {
  const navigate = useNavigate();
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const attractionMatch: PathMatch<string> | null = useMatch("/place/:city");
  const [isCalendarOpen, setIsCalendarOpen] = useRecoilState(isCalendarState);
  const [value, setValue] = useState("");
  const [isHotel, setIsHotel] = useState(false);
  const [currentDestination, setCurrentDestination] = useState<ITripDetails>();
  const { register, handleSubmit, setValue: setInputValue } = useForm<IForm>();
  const [isToggleOpen, setIsToggleOpen] = useState(true);

  const onCardClick = (name: string | undefined) => {
    navigate(`/place/${name}`);
    window.location.reload();
  };

  const onBackClick = () => {
    navigate("/city");
  };

  const onNextClick = () => {
    navigate(`/schedule/${userInfo[currentTrip].trips[0].destination?.name}`);
  };

  useEffect(() => {
    setCurrentDestination(
      userInfo[currentTrip].trips[
        userInfo[currentTrip].trips.findIndex((e) => e.destination?.name === destination?.name)
      ]
    );
  }, []);

  const { data, isLoading } = useQuery<IGeAutoCompletePlacesResult>(
    ["attraction", value],
    () =>
      getAutoCompletePlacesResult(
        destination?.name + value,
        destination
          ? destination?.geometry.location.lat + "%2C" + destination?.geometry.location.lng
          : "37.579617%2C126.977041",
        100
      ),
    { enabled: !!value }
  );

  const onValid = (data: IForm) => {
    setValue(data.keyword);
  };

  useEffect(() => {}, []);

  return (
    <AnimatePresence>
      {attractionMatch && attractionMatch?.params.city === destination?.name && (
        <Wrapper>
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
                    </OverviewCardIcon>
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
                      <JourneyList>
                        <Attractions>
                          {Object.values(
                            userInfo[currentTrip].trips[
                              userInfo[currentTrip].trips.findIndex(
                                (e) => e.destination?.name === destination?.name
                              )
                            ].detail.attractions
                          )
                            .flat()
                            .map(
                              (attraction, index) =>
                                attraction && (
                                  <Card>
                                    <Num>{index + 1}</Num>
                                    <JourneyCard
                                      key={attraction.timestamp}
                                      name={attraction.name}
                                      placeId={attraction.placeId}
                                      destination={destination}
                                    />
                                  </Card>
                                )
                            )}
                        </Attractions>
                        <Hotels>
                          {userInfo[currentTrip].trips[
                            userInfo[currentTrip].trips.findIndex(
                              (e) => e.destination?.name === destination?.name
                            )
                          ].detail.hotels.map(
                            (hotel) =>
                              hotel && (
                                <Card>
                                  <HotelCard
                                    key={hotel.timestamp}
                                    name={hotel.name}
                                    placeId={hotel.placeId}
                                    destination={destination}
                                  />
                                </Card>
                              )
                          )}
                        </Hotels>
                      </JourneyList>
                    )}
                </OverviewCard>
              ))}
            </OverviewCitys>
            <Buttons>
              <Goback onClick={onBackClick}>이전 단계로</Goback>
              {userInfo[currentTrip].trips.length > 0 &&
              userInfo[currentTrip].trips[
                userInfo[currentTrip].trips.findIndex(
                  (e) => e.destination?.name === destination?.name
                )
              ].detail.hotels.length > 0 &&
              Object.values(
                userInfo[currentTrip].trips[
                  userInfo[currentTrip].trips.findIndex(
                    (e) => e.destination?.name === destination?.name
                  )
                ].detail.attractions
              ).flat().length > 0 ? (
                <Button onClick={onNextClick}>완료</Button>
              ) : (
                <NoButton>완료</NoButton>
              )}
            </Buttons>
          </Overview>

          <Container>
            <SearchColumn>
              <Duration
                onClick={() => {
                  setIsCalendarOpen(true);
                }}
              >
                {userInfo[currentTrip].trips[
                  userInfo[currentTrip].trips.findIndex(
                    (e) => e.destination?.name === destination?.name
                  )
                ].detail.date === "0|0" ? (
                  "날짜를 선택해 주세요"
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
              <NavRow>
                <NavBox isnow={!isHotel} onClick={() => setIsHotel(false)}>
                  <NavTitle>장소</NavTitle>
                </NavBox>
                <NavBox isnow={isHotel} onClick={() => setIsHotel(true)}>
                  <NavTitle>숙소</NavTitle>
                </NavBox>
              </NavRow>

              <Form onSubmit={handleSubmit(onValid)}>
                <Input
                  {...register("keyword", { required: true })}
                  autoComplete="off"
                  placeholder="장소를 입력하세요"
                />
                <Icon>
                  <Search width={16} />
                </Icon>
              </Form>
              <SearchResult>
                {isLoading ? (
                  <Loader>loading...</Loader>
                ) : (
                  data &&
                  data.predictions.map((place) => (
                    <PlaceCard
                      key={place.place_id + "card"}
                      place={place}
                      isHotel={isHotel}
                      destination={destination}
                    />
                  ))
                )}
              </SearchResult>
              {isCalendarOpen && <SmallCalender destination={destination} />}
            </SearchColumn>

            <HotelColumn>
              {Object.values(
                userInfo[currentTrip].trips[
                  userInfo[currentTrip].trips.findIndex(
                    (e) => e.destination?.name === destination?.name
                  )
                ].detail.attractions
              )
                .map((e) => {
                  return e.map((ele) => {
                    return {
                      lat: ele?.geo.lat ? ele?.geo.lat : 0,
                      lng: ele?.geo.lng ? ele?.geo.lng : 0,
                    };
                  });
                })
                .flat().length === 0 ? (
                <GoogleMapMarker
                  markers={[]}
                  hotels={[]}
                  center={{
                    lat: destination?.geometry.location.lat
                      ? destination?.geometry.location.lat
                      : 0,
                    lng: destination?.geometry.location.lng
                      ? destination?.geometry.location.lng
                      : 0,
                  }}
                />
              ) : (
                <GoogleMapMarker
                  markers={Object.values(
                    userInfo[currentTrip].trips[
                      userInfo[currentTrip].trips.findIndex(
                        (e) => e.destination?.name === destination?.name
                      )
                    ].detail.attractions
                  )
                    .map((e) => {
                      return e.map((ele) => {
                        return {
                          lat: ele?.geo.lat ? ele?.geo.lat : 0,
                          lng: ele?.geo.lng ? ele?.geo.lng : 0,
                        };
                      });
                    })
                    .flat()}
                  hotels={userInfo[currentTrip].trips[
                    userInfo[currentTrip].trips.findIndex(
                      (e) => e.destination?.name === destination?.name
                    )
                  ].detail.hotels.map((e) => {
                    return {
                      lat: e?.geo.lat ? e?.geo.lat : 0,
                      lng: e?.geo.lng ? e?.geo.lng : 0,
                    };
                  })}
                  center={
                    Object.values(
                      userInfo[currentTrip].trips[
                        userInfo[currentTrip].trips.findIndex(
                          (e) => e.destination?.name === destination?.name
                        )
                      ].detail.attractions
                    )
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
              )}
            </HotelColumn>
          </Container>
        </Wrapper>
      )}
    </AnimatePresence>
  );
};

export default AttractionScreen;

const Wrapper = styled.div`
  background-color: white;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  overflow-y: hidden;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding-left: 300px;
  padding-top: 80px;
`;

const SearchColumn = styled.div`
  width: 450px;
  height: 100%;
  padding-top: 50px;
  padding-left: 28px;
  padding-right: 28px;
  padding-bottom: 28px;
`;

const HotelColumn = styled.div`
  width: calc(100vw - 750px);
  height: 100%;
`;

const NavBox = styled.div<{ isnow: boolean }>`
  padding: 11px;
  width: 50%;
  &:first-child {
    margin-right: 16px;
  }

  display: flex;
  justify-content: center;
  align-items: center;

  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.isnow ? props.theme.blue.mild : "transparent")};
  h2 {
    color: ${(props) => props.isnow && "white"};
  }
`;

const NavRow = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 20px;
`;

const NavTitle = styled.h2`
  font-size: 14px;
  font-weight: 400;
`;

const Title = styled.h2`
  font-size: 21px;
  font-weight: 600;
`;

const Duration = styled.h2`
  font-size: 14px;
  font-weight: 400;
  color: ${(props) => props.theme.gray.normal};
  cursor: pointer;
  margin-bottom: 15px;
`;

const Form = styled.form`
  width: 100%;
  position: relative;
  height: 50px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  padding-left: 52px;
  font-size: 16px;
  font-weight: 400;
  display: flex;
  align-items: center;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${(props) => props.theme.gray.blur};
  }
`;

const Icon = styled.div`
  position: absolute;
  top: 16px;
  left: 20px;
`;

const SearchResult = styled.div`
  display: flex;
  flex-direction: column;
`;

const Loader = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.gray.normal};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-top: 20px;
`;

const Attractions = styled.div`
  width: 100%;
  height: 60%;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const Hotels = styled.div`
  width: 100%;
  height: 30%;
  overflow-y: auto;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
`;

const Num = styled.h2`
  width: 16px;
  height: 16px;
  border-radius: 100px;
  margin-right: 16px;
  font-weight: 500;
  font-size: 10px;
  color: ${(props) => props.theme.blue.accent};
  background-color: #d9eaff;
  display: flex;
  justify-content: center;
  align-items: center;
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

const JourneyList = styled.div`
  width: 100%;
  border-top: 1px solid #f2f2f2;
  max-height: 320px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    background-color: transparent;
    width: 5px;
    height: 5px;
    display: none;
  }
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

interface IAttractionScreenProps {
  destination: IPlaceDetail | undefined;
}

interface IForm {
  keyword: string;
}
