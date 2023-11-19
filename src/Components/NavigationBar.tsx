import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import {
  playerState,
  destinationState,
  userState,
  tripState,
  navState,
  STATUS,
} from "../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IPlaceDetail } from "../api";

const NavigationBar = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useRecoilState(playerState);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [currentDestination, setCurrentDestination] =
    useRecoilState(destinationState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [openJourney, setOpenJourney] = useRecoilState(navState);
  const [openSingleJourney, setOpenSingleJourney] = useState(currentTrip);

  const handleHomeClicked = () => {
    const isHome = window.confirm("홈 화면으로 돌아가시겠습니까?");
    isHome && navigate("/trip");
  };

  const openUserInfo = () => {
    setIsUserInfoOpen((current) => !current);
  };

  const onJourneyClicked = () => {
    setOpenJourney((current) =>
      current === STATUS.JOURNEYS ? STATUS.DEFAULT : STATUS.JOURNEYS
    );
  };

  const onSingleJourneyClicked = (data: string) => {
    setOpenSingleJourney(data);
  };

  const onDetailClicked = (dest: IPlaceDetail | undefined) => {
    setCurrentTrip(openSingleJourney);
    setCurrentDestination(dest);
    navigate(`/travel/${openSingleJourney}/${dest?.name}`);
  };

  const onLogOutClicked = () => {
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
    setCurrentTrip("");
    setPlayer({ email: "", info: { name: "", password: "" } });
    navigate("/login");
  };

  return (
    <AnimatePresence>
      <Wrapper>
        <Container>
          <Title onClick={handleHomeClicked}>TravelGo</Title>
          <Right>
            <Journey
              onClick={onJourneyClicked}
              isJourney={openJourney === STATUS.JOURNEYS}
            >
              Journeys
            </Journey>
            <UserCard>
              <FontAwesomeIcon icon={faUser} onClick={openUserInfo} />
              <Name onClick={openUserInfo}>{player.info.name}</Name>
              <FontAwesomeIcon icon={faCaretDown} onClick={openUserInfo} />
              {isUserInfoOpen && (
                <UserInfoCard
                  variants={barVar}
                  initial="initial"
                  animate="animate"
                >
                  <InfoTitle>User Name</InfoTitle>
                  <Info>{player.info.name}</Info>
                  <InfoTitle>Email</InfoTitle>
                  <Info>
                    {player.email.split("$")[0] +
                      "@" +
                      player.email.split("$")[1] +
                      "." +
                      player.email.split("$")[2]}
                  </Info>
                  <LogOut
                    onClick={onLogOutClicked}
                    variants={logoutVar}
                    whileHover={"hover"}
                  >
                    LOGOUT
                  </LogOut>
                </UserInfoCard>
              )}
            </UserCard>
          </Right>
        </Container>
        {openJourney === STATUS.JOURNEYS && (
          <SecondBar variants={barVar} initial="initial" animate="animate">
            <Journeys>
              {Object.entries(userInfo[player.email].trips).length ? (
                Object.entries(userInfo[player.email].trips).map((data) => (
                  <JourneyTitle
                    onClick={() => {
                      onSingleJourneyClicked(data[0]);
                    }}
                    isNow={data[0] === openSingleJourney}
                  >
                    {data[0] === openSingleJourney ? (
                      <BlackSpan
                        variants={tabVar}
                        initial="initial"
                        animate="animate"
                        whileHover={"hover"}
                        exit={"exit"}
                      >
                        {data[0]}
                      </BlackSpan>
                    ) : (
                      <GraySpan
                        variants={tabVar}
                        initial="initial"
                        animate="animate"
                        whileHover={"hover"}
                        exit={"exit"}
                      >
                        {data[0]}
                      </GraySpan>
                    )}
                  </JourneyTitle>
                ))
              ) : (
                <Loader>
                  There is no journey... Please create your journey.
                </Loader>
              )}
            </Journeys>
            <SingleJourney>
              {Object.entries(userInfo[player.email].trips).map(
                (data) =>
                  openSingleJourney === data[0] && (
                    <JourneyDetailBox>
                      {data[1].map((trip) => (
                        <JourneyDetail
                          onClick={() => {
                            onDetailClicked(trip.destination);
                          }}
                          variants={tabVar}
                          initial="initial"
                          animate="animate"
                          whileHover={"hover"}
                          exit={"exit"}
                        >
                          {trip.destination?.name ===
                          currentDestination?.name ? (
                            <BlackSpan
                              variants={tabVar}
                              initial="initial"
                              animate="animate"
                              whileHover={"hover"}
                              exit={"exit"}
                            >
                              {trip.destination?.name}
                            </BlackSpan>
                          ) : (
                            <GraySpan
                              variants={tabVar}
                              initial="initial"
                              animate="animate"
                              whileHover={"hover"}
                              exit={"exit"}
                            >
                              {trip.destination?.name}
                            </GraySpan>
                          )}
                        </JourneyDetail>
                      ))}
                    </JourneyDetailBox>
                  )
              )}
            </SingleJourney>
          </SecondBar>
        )}
      </Wrapper>
    </AnimatePresence>
  );
};

export default NavigationBar;

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100px;
  z-index: 50;
`;

const Loader = styled.h2``;

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0 15%;
  border: 1px solid lightgray;
  background-color: rgba(255, 255, 255, 0.9);
`;

const Right = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
  height: 100%;
`;

const Title = styled.h2`
  font-weight: 900;
  font-size: 28px;
  cursor: pointer;
  padding: 30px 0;
`;

const SecondBar = styled(motion.div)`
  background-color: ${(props) => props.theme.main.bg + "bb"};
  padding: 30px 12%;
  border-bottom: 1px solid lightgray;
  transform-origin: top center;
`;

const Journey = styled.div<{ isJourney: boolean }>`
  font-weight: 700;
  font-size: 18px;
  margin-right: 80px;
  cursor: pointer;
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray;
  height: 100%;
  padding: 30px;
  box-shadow: inset 0 -4px 4px -4px
    ${(props) => (props.isJourney ? props.theme.main.accent : "transparent")};
`;

const Journeys = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 20px;
`;

const SingleJourney = styled.div`
  width: 100%;
`;

const JourneyDetailBox = styled.div`
  display: flex;
`;

const BlackSpan = styled(motion.h2)`
  color: black;
`;

const GraySpan = styled(motion.h2)`
  color: gray;
`;

const JourneyDetail = styled(motion.h2)<{ isNow: boolean }>`
  cursor: pointer;
  margin-right: 30px;
  font-size: 15px;
  font-weight: 500;
  color: ${(props) => (props.isNow ? "black" : "gray")};
`;

const JourneyTitle = styled(motion.h2)<{ isNow: boolean }>`
  cursor: pointer;
  margin-right: 30px;
  font-size: 15px;
  font-weight: 500;
  color: ${(props) => (props.isNow ? "#ffffff" : "gray")};
`;

const UserCard = styled.div`
  height: 100%;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 51;
  position: relative;
`;

const Name = styled.h2`
  font-size: 20px;
  margin: 0 15px;
`;

const InfoTitle = styled.h2`
  margin-bottom: 5px;
  color: black;
`;

const Info = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: 600;
`;

const UserInfoCard = styled(motion.div)`
  position: absolute;
  right: 0;
  top: 40px;
  width: 300px;
  height: 500px;
  z-index: 200;
  padding: 20px;
  background-color: ${(props) => props.theme.main.bg};
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.5);
  cursor: default;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-bottom: 0;
`;

const LogOut = styled(motion.div)`
  margin-top: auto;
  text-align: center;
  border-top: 1px solid lightgray;
  padding: 20px;
  font-weight: 600;
  cursor: pointer;
`;

const tabVar = {
  initial: {},
  animate: {},
  hover: {
    color: "#000000",
    transition: { delay: 0.1, duration: 0.1 },
  },
  exit: {},
};

const barVar = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
      stiffness: 100,
    },
  },
  exit: { y: 0 },
};

const logoutVar = {
  hover: {
    background: "linear-gradient(to right, transparent, #EBEBFF, transparent)",
  },
};
