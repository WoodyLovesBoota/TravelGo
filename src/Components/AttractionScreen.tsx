import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";

import { ITripDetails, isCalendarState, isSecondPhaseState, tripState, userState } from "../atoms";
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

  useEffect(() => {
    setCurrentDestination(
      userInfo[currentTrip].trips[
        userInfo[currentTrip].trips.findIndex((e) => e.destination?.name === destination?.name)
      ]
    );
  }, []);

  const { data, isLoading } = useQuery<IGeAutoCompletePlacesResult>(
    ["multiPlace", value],
    () =>
      getAutoCompletePlacesResult(
        value + destination?.name,
        destination
          ? destination.geometry.location.lat + "%2C" + destination.geometry.location.lng
          : "37.579617%2C126.977041",
        500
      ),
    { enabled: !!value }
  );

  const onValid = (data: IForm) => {
    setValue(data.keyword);
  };

  const onNextClick = () => {
    navigate(`/schedule/${destination?.name}`);
  };

  const onPrevClick = () => {
    navigate("/place");
  };

  return (
    <AnimatePresence>
      {attractionMatch && attractionMatch?.params.city === destination?.name && (
        <Wrapper>
          <NavColumn>
            <NavBox isnow={!isHotel} onClick={() => setIsHotel(false)}>
              <NavTitle>장소 선택</NavTitle>
            </NavBox>
            <NavBox isnow={isHotel} onClick={() => setIsHotel(true)}>
              <NavTitle>숙소 선택</NavTitle>
            </NavBox>
            <NavButtons>
              <NavPrevButton onClick={onPrevClick}>이전</NavPrevButton>
              <NavButton onClick={onNextClick}>다음</NavButton>
            </NavButtons>
          </NavColumn>
          <SearchColumn>
            <Title>{destination?.name}</Title>
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
            <Form onSubmit={handleSubmit(onValid)}>
              <Input
                {...register("keyword", { required: true })}
                autoComplete="off"
                placeholder="장소를 입력하세요"
              />
              <Icon>
                <Search width={23} />
              </Icon>
            </Form>
            <SearchResult>
              {isLoading ? (
                <Loader></Loader>
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
          <AttractionColumn>
            <Title>
              장소
              {
                Object.values(
                  userInfo[currentTrip].trips[
                    userInfo[currentTrip].trips.findIndex(
                      (e) => e.destination?.name === destination?.name
                    )
                  ].detail.attractions
                ).flat().length
              }
            </Title>
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
                          timestamp={attraction.timestamp}
                          destination={destination}
                        />
                      </Card>
                    )
                )}
            </Attractions>
            <Title>
              숙소
              {
                userInfo[currentTrip].trips[
                  userInfo[currentTrip].trips.findIndex(
                    (e) => e.destination?.name === destination?.name
                  )
                ].detail.hotels.length
              }
            </Title>
            <Hotels>
              {userInfo[currentTrip].trips[
                userInfo[currentTrip].trips.findIndex(
                  (e) => e.destination?.name === destination?.name
                )
              ].detail.hotels.map(
                (hotel, index) =>
                  hotel && (
                    <Card>
                      <JourneyCard
                        key={hotel.timestamp}
                        name={hotel.name}
                        placeId={hotel.placeId}
                        timestamp={hotel.timestamp}
                        destination={destination}
                      />
                    </Card>
                  )
              )}
            </Hotels>
          </AttractionColumn>
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
                  lat: destination?.geometry.location.lat ? destination?.geometry.location.lat : 0,
                  lng: destination?.geometry.location.lng ? destination?.geometry.location.lng : 0,
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

const NavColumn = styled.div`
  width: 150px;
  height: 100%;
  padding: 32px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid ${(props) => props.theme.gray.blur};
`;

const SearchColumn = styled.div`
  width: 400px;
  height: 100%;
  padding: 32px;
`;

const AttractionColumn = styled.div`
  width: 400px;
  height: 100%;
  padding: 32px;
`;

const HotelColumn = styled.div`
  width: calc(100% - 950px);
  height: 100%;
`;

const NavBox = styled.div<{ isnow: boolean }>`
  padding: 25px;
  width: 100%;
  display: flex;
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
  margin-top: auto;
  padding: 25px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.2);
  border-radius: 14px;
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

const Form = styled.form`
  width: 100%;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  padding: 15px;
  font-size: 16px;
  font-weight: 400;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${(props) => props.theme.gray.blur};
  }
`;

const Icon = styled.div`
  position: absolute;
  top: 13px;
  right: 15px;
`;

const SearchResult = styled.div``;

const Loader = styled.h2`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.gray.blur};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
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
  width: 20px;
  height: 20px;
  border-radius: 100px;
  margin-right: 15px;
  font-weight: 500;
  font-size: 12px;
  color: white;
  background-color: ${(props) => props.theme.blue.accent};
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface IAttractionScreenProps {
  destination: IPlaceDetail | undefined;
}

interface IForm {
  keyword: string;
}
