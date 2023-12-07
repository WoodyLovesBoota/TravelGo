import { useRecoilState } from "recoil";
import { destinationState, userState, playerState, tripState } from "../atoms";
import styled from "styled-components";
import { IGeAutoCompletePlacesResult, getAutoCompletePlacesResult } from "../api";
import { useQuery } from "react-query";
import { useState } from "react";
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

  return (
    <AnimatePresence>
      <Wrapper variants={loadingVar} initial="initial" animate="animate">
        <NavigationBar />
        <Container>
          <Main>
            <Header>
              <Title isHotel={isHotel} variants={titleVar} initial="initial" animate="animate">
                <p>
                  Find <span>{isHotel ? `Hotels` : `Attractions`}</span>
                </p>
                to visit in {currentDestination?.name}
                <DateInfo>
                  {"(" +
                    currentTarget.detail.date.split("|")[0] +
                    " ~ " +
                    currentTarget.detail.date.split("|")[1] +
                    ")"}
                </DateInfo>
              </Title>

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
                  Search a place
                </SubmitButton>
              </Form>
            </Header>
            <Results>
              {data ? (
                isLoading ? (
                  <Loader> ...Loading</Loader>
                ) : (
                  <div>
                    <ResultTitle isHotel={isHotel}>
                      <span>"{value}"</span> 검색결과
                    </ResultTitle>
                    <ResultList>
                      {data.predictions.map((place) => (
                        <PlaceCard key={place.place_id + "card"} place={place} isHotel={isHotel} />
                      ))}
                    </ResultList>
                  </div>
                )
              ) : null}
            </Results>
          </Main>

          <Column>
            <SubTitle>
              {currentDestination?.name} ({attractionList["NoName"].length + hotelList.length})
            </SubTitle>
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
          <Question>Have you added all the attractions in {currentDestination?.name}?</Question>
          <Buttons>
            <Button variants={buttonVar} whileHover={"hover"} onClick={goBack}>
              <span>No</span>
              <span>Change my Destination</span>
            </Button>
            <Button variants={buttonVar} whileHover={"hover"} onClick={goForward}>
              <span>Yes</span>
              <span>Move to Next Step</span>
            </Button>
          </Buttons>
        </Container>
      </Wrapper>
    </AnimatePresence>
  );
};

export default Place;

const Wrapper = styled(motion.div)`
  overflow-x: auto;
  width: 100vw;
  padding-bottom: 3.125rem;
`;

const DateInfo = styled.span`
  color: lightgray;
  font-weight: 550;
  margin-left: 0.625rem;
`;

const Header = styled.div`
  width: 55%;
  @media screen and (max-width: 899px) {
    width: 100%;
  }
`;

const Main = styled.div`
  padding: 6.25rem 12%;
  padding-right: 5%;
  display: flex;
  justify-content: space-between;
  width: 100%;
  @media screen and (max-width: 899px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const Title = styled(motion.h2)<{ isHotel: boolean }>`
  font-size: 1.3125rem;
  font-weight: 600;
  margin-bottom: 3.125rem;
  & p {
    font-size: 3rem;
    font-weight: 600;
    & span {
      margin-left: 1.25rem;
      font-size: 3rem;
      font-weight: 600;
      color: ${(props) => (props.isHotel ? props.theme.red.normal : props.theme.main.normal)};
    }
  }
`;

const Loader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 1rem;
  font-weight: 500;
`;

const SubTitle = styled.h2`
  font-size: 1.3125rem;
  font-weight: 700;
  margin-bottom: 1.875rem;
  padding: 0 12%;
`;

const Container = styled.div`
  padding-top: 8%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Column = styled.div`
  padding: 3.125rem 0%;
  width: 100%;
  padding-bottom: 6.25rem;
  background-color: ${(props) => props.theme.main.accent};
`;

const Circle = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
`;

const Blank = styled.div`
  width: 45%;
  height: 90%;
`;

const Question = styled.h2`
  margin: 3.125rem auto;
  margin-top: 6.25rem;
  font-size: 1.125rem;
  font-weight: 700;
`;

const Toggle = styled(motion.div)<{ isHotel: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 1.5625rem;
  width: 6.25rem;
  height: 3.125rem;
  padding: 0.3125rem 0.625rem;
  color: ${(props) => (props.isHotel ? props.theme.red.normal : props.theme.main.normal)};
  cursor: pointer;
  background-color: ${(props) => (props.isHotel ? props.theme.red.normal : props.theme.main.normal)};
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Button = styled(motion.button)`
  cursor: pointer;
  width: 15%;
  padding: 0.9375rem 0.625rem;
  border-radius: 0.3125rem;
  font-weight: 600;
  color: ${(props) => props.theme.white.normal};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: none;
  margin: 0 0.625rem;
  @media screen and (max-width: 899px) {
    width: 35%;
  }
  span {
    &:first-child {
      font-size: 1.5rem;
      margin-bottom: 0.625rem;
      font-weight: 600;
    }
    &:last-child {
      font-size: 0.875rem;
      margin-bottom: 0.625rem;
      font-weight: 600;
    }
  }
  &:first-child {
    background-color: ${(props) => props.theme.red.accent};
  }
  &:last-child {
    background-color: ${(props) => props.theme.green.accent};
  }
`;

const ResultList = styled.div`
  /* display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%; */
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const ResultTitle = styled.h2<{ isHotel: boolean }>`
  font-size: 0.875rem;
  color: gray;
  font-weight: 400;
  margin-bottom: 0.625rem;
  span {
    font-size: 1.3125rem;
    font-weight: 700;
    color: ${(props) => (props.isHotel ? props.theme.red.accent : props.theme.main.accent)};
    margin-right: 0.625rem;
  }
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  margin-top: 3.125rem;
`;

const Input = styled(motion.input)<{ isHotel: boolean }>`
  width: 25rem;
  height: 4.125rem;
  padding: 1.25rem;
  font-size: 1.125rem;
  border: none;
  box-shadow: 0.0625rem 0.125rem 0.125rem 0.125rem lightgray;
  border-radius: 0.4375rem;
  font-weight: 600;

  &:focus {
    outline: none;
    box-shadow: 0.0625rem 0.125rem 0.125rem 0.125rem
      ${(props) => (props.isHotel ? props.theme.red.accent : props.theme.main.accent)};
  }
`;

const SubmitButton = styled.button<{ isHotel: boolean }>`
  margin-left: 1.875rem;
  border: none;
  background-color: ${(props) => (props.isHotel ? props.theme.red.accent : props.theme.main.accent)};
  padding: 1.25rem 1.5625rem;
  font-size: 1rem;
  border-radius: 3.125rem;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.isHotel ? props.theme.red.accent + "aa" : props.theme.main.accent + "aa")};
  }
`;
const Results = styled.div`
  width: 50%;
  margin-bottom: 6.25rem;
  margin-left: 3.125rem;
  @media screen and (max-width: 899px) {
    width: 100%;
    margin-top: 3.125rem;
    margin-left: 0;
  }
`;

const Selected = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11.25rem, 1fr));
  grid-row-gap: 0.9375rem;
  grid-column-gap: 0.3125rem;
`;

const Row = styled.div`
  margin-bottom: 1.875rem;
  padding: 0.625rem 12%;
`;

const RowTitle = styled.h2`
  font-size: 1.3125rem;
  font-weight: 700;
  margin: 0.625rem 0;
`;

const titleVar = {
  initial: { y: "10vh", opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
};

const buttonVar = {
  hover: { scale: 1.1 },
};

const loadingVar = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.3 } },
};

interface IForm {
  keyword: string;
}
