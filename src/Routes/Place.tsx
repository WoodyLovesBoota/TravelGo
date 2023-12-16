import { useRecoilState } from "recoil";
import { destinationState, userState, playerState, tripState } from "../atoms";
import styled from "styled-components";
import { IGeAutoCompletePlacesResult, getAutoCompletePlacesResult } from "../api";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import PlaceCard from "../Components/PlaceCard";
import JourneyCard from "../Components/JourneyCard";
import NavigationBar from "../Components/NavigationBar";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHotel } from "@fortawesome/free-solid-svg-icons";
import { faFortAwesome } from "@fortawesome/free-brands-svg-icons";
import HotelCard from "../Components/HotelCard";
import { makeImagePath } from "../utils";

const Place = () => {
  const [currentDestination, setCurrentDestination] = useRecoilState(destinationState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [player, setPlayer] = useRecoilState(playerState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [isHotel, setIsHotel] = useState(false);

  const currentTarget =
    userInfo[player.email].trips[currentTrip][
      userInfo[player.email].trips[currentTrip].findIndex((e) => e.destination?.name === currentDestination?.name)
    ];

  const attractionList = currentTarget.detail.attractions;
  const hotelList = currentTarget.detail.hotels;

  const destinationMatch: PathMatch<string> | null = useMatch("/travel/:title/:destination");

  const [value, setValue] = useState("");
  const { register, handleSubmit, setValue: setInputValue } = useForm<IForm>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<IGeAutoCompletePlacesResult>(
    ["multiPlace", value],
    () =>
      getAutoCompletePlacesResult(
        value,
        currentDestination
          ? currentDestination.geometry.location.lat + "%2C" + currentDestination.geometry.location.lng
          : "37.579617%2C126.977041",
        500
      ),
    { enabled: !!value }
  );

  const goBack = () => {
    setCurrentDestination({
      formatted_address: "string",
      international_phone_number: "string",
      rating: 0,
      photos: [{ photo_reference: "string" }],
      geometry: {
        location: {
          lat: 0,
          lng: 0,
        },
      },
      name: "string",
      editorial_summary: { overview: "string" },
      reviews: {
        rating: 0,
        text: "string",
        relative_time_description: "string",
        author_name: "string",
      },
      place_id: "string",
    });
    navigate(`/destination/${destinationMatch?.params.title}`);
  };

  const goForward = () => {
    navigate(`/journey/${destinationMatch?.params.title}/${destinationMatch?.params.destination}`);
  };

  const onValid = (data: IForm) => {
    setValue(data.keyword);
    setInputValue("keyword", "");
  };

  const onToggleClicked = () => {
    setIsHotel((current) => !current);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AnimatePresence>
      <Container>
        <Wrapper
          bgphoto={`url(${makeImagePath(
            currentDestination?.photos ? currentDestination?.photos[0].photo_reference : "",
            800
          )})`}
        >
          <NavigationBar />

          <Main variants={loadingVar} initial="initial" animate="animate">
            <Header>
              <Title isHotel={isHotel} variants={titleVar} initial="initial" animate="animate">
                {isHotel ? `Hotels` : `Attractions`}
                <DateInfo>in {currentDestination?.name}</DateInfo>
              </Title>
              <Description>
                {currentDestination?.name}에서의 일정을 추가해 보세요. 방문하고싶은 관광 명소나 식당, 머물 예정인 호텔
                등을 추가하여 세부적인 여행 계획을 세우세요. 먼저 관광지나 호텔의 이름을 검색한 후, 정확한 장소를
                선택하세요.
              </Description>
              <Toggle isHotel={isHotel} onClick={onToggleClicked}>
                <Blank>
                  {isHotel && (
                    <Circle layoutId="circle">
                      <FontAwesomeIcon icon={faHotel}></FontAwesomeIcon>
                    </Circle>
                  )}
                </Blank>
                <Blank>
                  {!isHotel && (
                    <Circle layoutId="circle">
                      <FontAwesomeIcon icon={faFortAwesome}></FontAwesomeIcon>
                    </Circle>
                  )}
                </Blank>
              </Toggle>
              <Form onSubmit={handleSubmit(onValid)}>
                <Input
                  {...register("keyword", { required: true })}
                  autoComplete="off"
                  placeholder={`Enter name of place`}
                  isHotel={isHotel}
                />
                <SubmitButton isHotel={isHotel} type="submit">
                  Search
                </SubmitButton>
              </Form>
            </Header>
            <Results>
              {data ? (
                isLoading ? (
                  <Loader> ...Loading</Loader>
                ) : (
                  <ResultList>
                    {data.predictions.map((place) => (
                      <PlaceCard key={place.place_id + "card"} place={place} isHotel={isHotel} />
                    ))}
                  </ResultList>
                )
              ) : null}
            </Results>
          </Main>
        </Wrapper>
        <Column variants={loadingVar} initial="initial" animate="animate">
          <SubTitle>{currentDestination?.name}</SubTitle>
          <Row>
            <RowTitle>Attractions ({attractionList["NoName"].length})</RowTitle>
            {attractionList["NoName"].length === 0 ? (
              <Loader>There is no selected place.. Please add your places.</Loader>
            ) : (
              <Selected>
                {attractionList["NoName"].map(
                  (jCard) =>
                    jCard && (
                      <JourneyCard
                        key={jCard.timestamp}
                        name={jCard.name}
                        placeId={jCard.placeId}
                        timestamp={jCard.timestamp}
                      />
                    )
                )}
              </Selected>
            )}
          </Row>
          <Row>
            <RowTitle>Hotels ({hotelList.length})</RowTitle>
            {hotelList.length === 0 ? (
              <Loader>There is no selected place.. Please add your places.</Loader>
            ) : (
              <Selected>
                {hotelList.map(
                  (jCard) =>
                    jCard && (
                      <HotelCard
                        key={jCard.timestamp}
                        name={jCard.name}
                        placeId={jCard.placeId}
                        timestamp={jCard.timestamp}
                      />
                    )
                )}
              </Selected>
            )}
          </Row>
        </Column>
        <Last variants={loadingVar} initial="initial" animate="animate">
          <Question>{currentDestination?.name}에서의 일정을 모두 추가하셨나요?</Question>
          <Buttons>
            <Button onClick={goBack}>
              <span>아니요</span>
              <span>목적지를 변경합니다.</span>
            </Button>
            <Button onClick={goForward}>
              <span>네</span>
              <span>다음 단계로 이동합니다.</span>
            </Button>
          </Buttons>
        </Last>
      </Container>
    </AnimatePresence>
  );
};

export default Place;

const Container = styled.div`
  width: 100vw;
`;

const Wrapper = styled(motion.div)<{ bgphoto: string }>`
  overflow-x: auto;
  width: 100%;
  min-height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), ${(props) => props.bgphoto};
  background-size: cover;
  background-position: center center;
`;

const Title = styled(motion.h2)<{ isHotel: boolean }>`
  font-size: 72px;
  font-weight: 600;
  margin-bottom: 50px;
  color: white;
  padding-top: 150px;
`;

const DateInfo = styled.span`
  color: white;
  font-weight: 600;
  margin-left: 40px;
  font-size: 24px;
`;

const Description = styled.h2`
  color: white;
  font-size: 16px;
  font-weight: 400;
  width: 70%;
  line-height: 2;
  margin-bottom: 50px;
`;

const Header = styled(motion.div)`
  width: 45%;
`;

const Results = styled(motion.div)`
  width: 45%;
  padding-top: 100px;
`;

const ResultList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
`;

const Main = styled(motion.div)`
  padding: 0 140px;
  padding-bottom: 200px;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Loader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 14px;
  font-weight: 500;
`;

const SubTitle = styled.h2`
  font-size: 21px;
  font-weight: 400;
  color: gray;
`;

const Column = styled(motion.div)`
  width: 100%;
  padding: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Circle = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
`;

const Blank = styled.div`
  width: 45%;
  height: 90%;
`;

const Toggle = styled(motion.div)<{ isHotel: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 25px;
  width: 100px;
  height: 50px;
  padding: 5px 12px;
  cursor: pointer;
  background-color: ${(props) => (props.isHotel ? props.theme.red.accent + "88" : props.theme.main.accent + "88")};
  margin-bottom: 50px;
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
const Buttons = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  margin-top: 50px;
`;

const Input = styled(motion.input)<{ isHotel: boolean }>`
  width: 400px;
  padding: 20px;
  font-size: 18px;
  border: none;
  border-radius: 7px;
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0.8);
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: white;
  }
`;

const SubmitButton = styled.button<{ isHotel: boolean }>`
  margin-left: 20px;
  border: none;
  background-color: ${(props) => (props.isHotel ? props.theme.red.accent : props.theme.main.accent)};
  padding: 20px 25px;
  font-size: 16px;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.isHotel ? props.theme.red.accent + "aa" : props.theme.main.accent + "aa")};
  }
`;

const Selected = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 10px;
`;

const Row = styled.div`
  margin-bottom: 30px;
  width: 100%;
`;

const RowTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 50px;
  margin-top: 20px;
  text-align: center;
  color: black;
`;

const Last = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 140px 0;
  background-color: ${(props) => props.theme.main.accent};
`;

const Question = styled.h2`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 20px;
  text-align: center;
`;

const titleVar = {
  initial: { y: "10vh", opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
};

const loadingVar = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.3 } },
};

interface IForm {
  keyword: string;
}
