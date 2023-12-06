import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { playerState, destinationState, userState, tripState, navState, STATUS } from "../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IPlaceDetail } from "../api";

const NavigationBar = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useRecoilState(playerState);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [currentDestination, setCurrentDestination] = useRecoilState(destinationState);
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
    setOpenJourney((current) => (current === STATUS.JOURNEYS ? STATUS.DEFAULT : STATUS.JOURNEYS));
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
    navigate("/");
  };

  return (
    <AnimatePresence>
      <Wrapper>
        <Container>
          <Title onClick={handleHomeClicked}>
            <Capital>B</Capital>EEE
          </Title>
          <Right>
            <Journey onClick={onJourneyClicked} isJourney={openJourney === STATUS.JOURNEYS}>
              Journeys
            </Journey>
            <UserCard>
              <FontAwesomeIcon icon={faUser} onClick={openUserInfo} />
              <Name onClick={openUserInfo}>{player.info.name}</Name>
              <FontAwesomeIcon icon={faCaretDown} onClick={openUserInfo} />
              {isUserInfoOpen && (
                <UserInfoCard variants={barVar} initial="initial" animate="animate">
                  <InfoTitle>User Name</InfoTitle>
                  <Info>{player.info.name}</Info>
                  <InfoTitle>Email</InfoTitle>
                  <Info>
                    {player.email.split("$")[0] + "@" + player.email.split("$")[1] + "." + player.email.split("$")[2]}
                  </Info>
                  <LogOut onClick={onLogOutClicked}>LOGOUT</LogOut>
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
                <Loader>There is no journey... Please create your journey.</Loader>
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
                          {trip.destination?.name === currentDestination?.name ? (
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
  height: 6.25rem;
  z-index: 50;
  background-color: #feffe7;
`;

const Loader = styled.h2``;

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0 12%;
  border-bottom: 0.125rem solid ${(props) => props.theme.main.point};
`;

const Right = styled.div`
  display: flex;
  margin-left: auto;
  align-items: center;
  height: 100%;
`;

const Title = styled.h2`
  font-weight: 900;
  font-size: 1.3125rem;
  cursor: pointer;
  padding: 1.875rem 0;
`;

const Capital = styled.span`
  color: ${(props) => props.theme.main.accent};
  font-weight: 900;
  font-size: 1.3125rem;
  cursor: pointer;
  padding: 1.875rem 0;
`;

const SecondBar = styled(motion.div)`
  padding: 1.875rem 12%;
  border-bottom: 0.125rem solid ${(props) => props.theme.main.point};
  transform-origin: top center;
`;

const Journey = styled.div<{ isJourney: boolean }>`
  font-weight: 600;
  font-size: 1rem;
  margin-right: 5rem;
  cursor: pointer;
  color: ${(props) => props.theme.main.point};
  border-left: 0.125rem solid ${(props) => props.theme.main.point};
  border-right: 0.125rem solid ${(props) => props.theme.main.point};
  height: 100%;
  padding: 1.875rem;
`;

const Journeys = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 1.25rem;
`;

const SingleJourney = styled.div`
  width: 100%;
`;

const JourneyDetailBox = styled.div`
  display: flex;
`;

const BlackSpan = styled(motion.h2)`
  color: ${(props) => props.theme.main.word};
  font-weight: 500;
`;

const GraySpan = styled(motion.h2)`
  color: gray;
  font-weight: 400;
`;

const JourneyDetail = styled(motion.h2)<{ isNow: boolean }>`
  cursor: pointer;
  margin-right: 1.875rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${(props) => (props.isNow ? props.theme.main.word : "gray")};
`;

const JourneyTitle = styled(motion.h2)<{ isNow: boolean }>`
  cursor: pointer;
  margin-right: 1.875rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${(props) => (props.isNow ? props.theme.main.word : "gray")};
`;

const UserCard = styled.div`
  height: 100%;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 51;
  position: relative;
  color: ${(props) => props.theme.main.point};
`;

const Name = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0.9375rem;
  color: ${(props) => props.theme.main.point};
`;

const InfoTitle = styled.h2`
  margin-bottom: 0.3125rem;
  font-weight: 400;
  color: ${(props) => props.theme.main.point};
`;

const Info = styled.h2`
  font-size: 1rem;
  margin-bottom: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.main.point};
`;

const UserInfoCard = styled(motion.div)`
  position: absolute;
  right: 0;
  top: 2.5rem;
  width: 18.75rem;
  height: 31.25rem;
  z-index: 200;
  padding: 1.25rem;
  box-shadow: 0.0625rem 0.125rem 0.25rem rgba(0, 0, 0, 0.5);
  cursor: default;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-bottom: 0;
  color: ${(props) => props.theme.main.point};
  background-color: ${(props) => props.theme.main.bg};
`;

const LogOut = styled(motion.div)`
  margin-top: auto;
  text-align: center;
  border-top: 0.125rem solid ${(props) => props.theme.main.point};
  color: ${(props) => props.theme.main.point};
  padding: 1.25rem;
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
