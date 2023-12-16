import styled from "styled-components";
import NavigationBar from "../Components/NavigationBar";
import { useRecoilState } from "recoil";
import { destinationState, playerState, tripState, userState } from "../atoms";
import { useEffect, useState } from "react";
import { makeImagePath } from "../utils";
import GoogleRouteMap from "../Components/GoogleRouteMap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import imageList from "../imageData.json";

const Summary = () => {
  const [currentDestination, setCurrentDestination] = useRecoilState(destinationState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [player, setPlayer] = useRecoilState(playerState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [clickedCategory, setClickedCategory] = useState("");

  const destination = currentDestination?.name;
  const navigate = useNavigate();

  const currentTarget =
    userInfo[player.email].trips[currentTrip][
      userInfo[player.email].trips[currentTrip].findIndex((e) => e.destination?.name === destination)
    ];

  const onCategoryClick = (boardName: string) => {
    setClickedCategory(boardName);
  };

  const onGoBackClicked = () => {
    navigate(`/journey/${currentTrip}/${destination}`);
  };

  const onGoForwardClicked = () => {
    navigate(`/destination/${currentTrip}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Wrapper>
      <Header bgphoto={imageList[Math.floor(Math.random() * 10) % imageList.length]}>
        <NavigationBar />
        <Title>SUMMARY</Title>
      </Header>
      <Main variants={loadingVar} initial="initial" animate="animate">
        <MainTitle>Scehdule of {currentDestination?.name}</MainTitle>
        <MainSubtitle>
          {currentTarget.detail.date.split("|")[0]} 부터 {currentTarget.detail.date.split("|")[1]} 까지의{" "}
          {currentDestination?.name}에서의 일정을 확인해 보세요. 아래의 카테고리를 클릭하여 각각의 일정을 점검하세요.
        </MainSubtitle>
        <MainContent>
          <List>
            {Object.keys(
              userInfo[player.email].trips[currentTrip][
                userInfo[player.email].trips[currentTrip].findIndex(
                  (e) => e.destination?.name === currentDestination?.name
                )
              ].detail.attractions
            ).map((boardName) => {
              return (
                boardName !== "NoName" && (
                  <Category
                    isnow={boardName === clickedCategory}
                    onClick={() => {
                      onCategoryClick(boardName);
                    }}
                  >
                    {boardName}
                  </Category>
                )
              );
            })}
          </List>
          <Info>
            {userInfo[player.email].trips[currentTrip][
              userInfo[player.email].trips[currentTrip].findIndex(
                (e) => e.destination?.name === currentDestination?.name
              )
            ].detail.attractions[clickedCategory] && (
              <Paths>
                {userInfo[player.email].trips[currentTrip][
                  userInfo[player.email].trips[currentTrip].findIndex(
                    (e) => e.destination?.name === currentDestination?.name
                  )
                ].detail.attractions[clickedCategory]?.length > 0 ? (
                  userInfo[player.email].trips[currentTrip][
                    userInfo[player.email].trips[currentTrip].findIndex(
                      (e) => e.destination?.name === currentDestination?.name
                    )
                  ].detail.attractions[clickedCategory]?.length > 1 ? (
                    userInfo[player.email].trips[currentTrip][
                      userInfo[player.email].trips[currentTrip].findIndex(
                        (e) => e.destination?.name === currentDestination?.name
                      )
                    ].detail.attractions[clickedCategory]?.length > 2 ? (
                      <GoogleRouteMap
                        origin={`place_id:${
                          userInfo[player.email].trips[currentTrip][
                            userInfo[player.email].trips[currentTrip].findIndex(
                              (e) => e.destination?.name === currentDestination?.name
                            )
                          ].detail.attractions[clickedCategory][0]?.placeId
                        }`}
                        destination={`place_id:${
                          userInfo[player.email].trips[currentTrip][
                            userInfo[player.email].trips[currentTrip].findIndex(
                              (e) => e.destination?.name === currentDestination?.name
                            )
                          ].detail.attractions[clickedCategory][
                            userInfo[player.email].trips[currentTrip][
                              userInfo[player.email].trips[currentTrip].findIndex(
                                (e) => e.destination?.name === currentDestination?.name
                              )
                            ].detail.attractions[clickedCategory].length - 1
                          ]?.placeId
                        }`}
                        waypoints={userInfo[player.email].trips[currentTrip][
                          userInfo[player.email].trips[currentTrip].findIndex(
                            (e) => e.destination?.name === currentDestination?.name
                          )
                        ].detail.attractions[clickedCategory].map((e, i) => {
                          if (
                            e &&
                            i > 0 &&
                            i <
                              userInfo[player.email].trips[currentTrip][
                                userInfo[player.email].trips[currentTrip].findIndex(
                                  (e) => e.destination?.name === currentDestination?.name
                                )
                              ].detail.attractions[clickedCategory].length -
                                1
                          )
                            return e.placeId;
                          else return;
                        })}
                        width="100%"
                        height="33vw"
                        zoom={14}
                      />
                    ) : (
                      <GoogleRouteMap
                        origin={`place_id:${
                          userInfo[player.email].trips[currentTrip][
                            userInfo[player.email].trips[currentTrip].findIndex(
                              (e) => e.destination?.name === currentDestination?.name
                            )
                          ].detail.attractions[clickedCategory][0]?.placeId
                        }`}
                        destination={`place_id:${
                          userInfo[player.email].trips[currentTrip][
                            userInfo[player.email].trips[currentTrip].findIndex(
                              (e) => e.destination?.name === currentDestination?.name
                            )
                          ].detail.attractions[clickedCategory][
                            userInfo[player.email].trips[currentTrip][
                              userInfo[player.email].trips[currentTrip].findIndex(
                                (e) => e.destination?.name === currentDestination?.name
                              )
                            ].detail.attractions[clickedCategory].length - 1
                          ]?.placeId
                        }`}
                        waypoints={[]}
                        width="100%"
                        height="33vw"
                        zoom={14}
                      />
                    )
                  ) : (
                    <GoogleRouteMap
                      origin={`place_id:${
                        userInfo[player.email].trips[currentTrip][
                          userInfo[player.email].trips[currentTrip].findIndex(
                            (e) => e.destination?.name === currentDestination?.name
                          )
                        ].detail.attractions[clickedCategory][0]?.placeId
                      }`}
                      destination={""}
                      waypoints={[]}
                      width="100%"
                      height="33vw"
                      zoom={14}
                    />
                  )
                ) : (
                  <Loader>경로를 표시할 장소가 존재하지 않습니다.</Loader>
                )}
              </Paths>
            )}
            {userInfo[player.email].trips[currentTrip][
              userInfo[player.email].trips[currentTrip].findIndex(
                (e) => e.destination?.name === currentDestination?.name
              )
            ].detail.attractions[clickedCategory] && (
              <>
                <RowTitle>Attractions</RowTitle>
                <Row>
                  {userInfo[player.email].trips[currentTrip][
                    userInfo[player.email].trips[currentTrip].findIndex(
                      (e) => e.destination?.name === currentDestination?.name
                    )
                  ].detail.attractions[clickedCategory].map((attr) => (
                    <Card>
                      <CardPhoto
                        bgphoto={`url(${makeImagePath(
                          attr
                            ? attr.image
                              ? attr.image[0]
                              : currentDestination
                              ? currentDestination.photos[0].photo_reference
                              : ""
                            : "",
                          500
                        )})`}
                      />
                      <CardTitle>{attr?.name}</CardTitle>
                      <CardSubtitle>{attr?.address}</CardSubtitle>
                    </Card>
                  ))}
                </Row>
              </>
            )}
            {userInfo[player.email].trips[currentTrip][
              userInfo[player.email].trips[currentTrip].findIndex(
                (e) => e.destination?.name === currentDestination?.name
              )
            ].detail.attractions[clickedCategory] && (
              <>
                <HotelsTitle>Hotels</HotelsTitle>
                <Hotels>
                  {userInfo[player.email].trips[currentTrip][
                    userInfo[player.email].trips[currentTrip].findIndex(
                      (e) => e.destination?.name === currentDestination?.name
                    )
                  ].detail.hotels.map((hotel) => (
                    <Card>
                      <CardPhoto
                        bgphoto={`url(${makeImagePath(
                          hotel
                            ? hotel.image
                              ? hotel.image[0]
                              : currentDestination
                              ? currentDestination.photos[0].photo_reference
                              : ""
                            : "",
                          500
                        )})`}
                      />
                      <CardTitle>{hotel?.name}</CardTitle>
                      <CardSubtitle>{hotel?.address}</CardSubtitle>
                    </Card>
                  ))}
                </Hotels>
              </>
            )}
          </Info>
        </MainContent>
      </Main>
      <Footer variants={loadingVar} initial="initial" animate="animate">
        <Question>{currentDestination?.name}에서의 모든 여행을 계획하셨나요?</Question>
        <Buttons>
          <Button onClick={onGoBackClicked}>
            <span>아니요</span>
            <span>더 많은 장소를 찾는다.</span>
          </Button>
          <Button onClick={onGoForwardClicked}>
            <span>네</span>
            <span>다음 여행지로 이동한다.</span>
          </Button>
        </Buttons>
      </Footer>
    </Wrapper>
  );
};

export default Summary;

const Wrapper = styled.div``;

const Header = styled.div<{ bgphoto: string }>`
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${(props) => props.bgphoto});
  background-position: center center;
  background-size: cover;
  width: 100%;
  height: 15vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 50px;
`;

const Title = styled.div`
  font-size: 36px;
  font-weight: 700;
  padding: 0 144px;
`;

const Main = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 144px;
  width: 100%;
  min-height: 70vh;
`;

const MainTitle = styled.h2`
  color: black;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const MainSubtitle = styled.h2`
  color: gray;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 50px;
`;

const MainContent = styled.div`
  width: 100%;
`;

const List = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 54px;
`;

const Category = styled.div<{ isnow: boolean }>`
  color: ${(props) => (props.isnow ? "white" : props.theme.main.accent)};
  background-color: ${(props) => (props.isnow ? props.theme.main.accent : "transparent")};
  padding: 10px 20px;
  font-size: 18px;
  font-weight: 600;
  margin: 0 10px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Info = styled.div`
  width: 100%;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
  margin-bottom: 50px;
`;

const RowTitle = styled.h2`
  color: black;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const Hotels = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
  margin-bottom: 50px;
`;

const HotelsTitle = styled.h2`
  color: black;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const Card = styled.div`
  width: 100%;
  border-radius: 10px;
`;

const CardPhoto = styled.div<{ bgphoto: string }>`
  background: ${(props) => props.bgphoto};
  background-position: center center;
  background-size: cover;
  width: 100%;
  height: 20vw;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const CardTitle = styled.h2`
  color: black;
  font-size: 18px;
  font-weight: 400;
`;

const CardSubtitle = styled.h2`
  color: gray;
  font-size: 14px;
  font-weight: 500;
`;

const Paths = styled.div`
  margin-bottom: 50px;
`;

const Loader = styled.h2`
  color: black;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`;

const Footer = styled(motion.div)`
  padding: 140px 0;
  background-color: ${(props) => props.theme.main.accent};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Question = styled.h2`
  font-size: 21px;
  font-weight: 400;
  margin-bottom: 20px;
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

const loadingVar = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.3 } },
};
