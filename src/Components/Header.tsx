import { useRecoilState } from "recoil";
import styled from "styled-components";
import { tripState, userState } from "../atoms";
import NavigationBar from "./NavigationBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { useState } from "react";

const Header = ({ now }: { now: number }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);

  const onTripCardClick = (name: string) => {
    setCurrentTrip(name);
    userInfo[name].date.split("|")[0] ? navigate("/city") : navigate("/date");
    setIsMenuOpen(false);
  };

  const onDeleteClick = (name: string) => {
    if (currentTrip === name) navigate("/");
    setUserInfo((current) => {
      let copy = { ...current };
      delete copy[name];
      return copy;
    });
  };

  return (
    <Wrapper
      isnow={now === -1}
      onClick={() => {
        isMenuOpen && setIsMenuOpen(false);
      }}
    >
      <Title
        onClick={() => {
          navigate("/");
          setCurrentTrip("");
        }}
      >
        <Logo />
      </Title>
      {now !== -1 && <NavigationBar now={now} />}
      <Menu
        ishome={now === -1}
        onClick={() => {
          setIsMenuOpen(true);
        }}
      >
        <FontAwesomeIcon icon={faBars} />
      </Menu>
      {isMenuOpen && (
        <Trips>
          <TripsTitle>내 여행</TripsTitle>
          {Object.entries(userInfo).length === 0 ? (
            <Empty>여행을 만들어주세요.</Empty>
          ) : (
            Object.entries(userInfo).map((trip) => (
              <TripCard>
                <TripContainer
                  onClick={() => {
                    onTripCardClick(trip[0]);
                  }}
                >
                  <TripCardTitle>{trip[0] === "Trip1" ? "새로운 여행" : trip[0]}</TripCardTitle>
                  {trip[1] && trip[1].date && trip[1].date.split("|")[0] ? (
                    <TripCardDuration>
                      {trip[1].date.split("|")[0].slice(0, trip[1].date.split("|")[0].length - 2)}(
                      {
                        ["일", "월", "화", "수", "목", "금", "토"][
                          Number(trip[1].date.split("|")[0].split(".")[3])
                        ]
                      }
                      ){" ~ "}
                      {trip[1].date.split("|")[1].slice(0, trip[1].date.split("|")[1].length - 2)}(
                      {
                        ["일", "월", "화", "수", "목", "금", "토"][
                          Number(trip[1].date.split("|")[1].split(".")[3])
                        ]
                      }
                      )
                    </TripCardDuration>
                  ) : (
                    <TripCardDuration>날짜 미정</TripCardDuration>
                  )}
                </TripContainer>
                <DeleteButton
                  onClick={() => {
                    onDeleteClick(trip[0]);
                  }}
                >
                  <FontAwesomeIcon icon={faX} />
                </DeleteButton>
              </TripCard>
            ))
          )}
        </Trips>
      )}
    </Wrapper>
  );
};

export default Header;

const Wrapper = styled.div<{ isnow: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 25px 28px;
  box-shadow: ${(props) => !props.isnow && "0px 2px 12px 0px rgba(0, 0, 0, 0.1)"};
  background-color: ${(props) => (props.isnow ? "rgba(255,255,255,0.2)" : "white")};
  backdrop-filter: ${(props) => props.isnow && "blur(8px)"};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
`;

const Title = styled.h2`
  cursor: pointer;
  width: 100px;
`;

const Menu = styled.div<{ ishome: boolean }>`
  font-size: 20px;
  color: ${(props) => (props.ishome ? props.theme.gray.accent : props.theme.gray.blur)};
  cursor: pointer;
`;

const Trips = styled.div`
  background-color: white;
  width: 328px;
  position: absolute;
  right: 28px;
  top: 60px;
  padding: 26px 0;
  border-radius: 8px;
  border-top-right-radius: 0;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.1);
`;

const TripsTitle = styled.h2`
  padding: 0 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f2f2f2;
  font-size: 20px;
  font-weight: 500;
  line-height: 1;
`;

const Empty = styled.h1`
  font-size: 14px;
  font-weight: 400;
  color: ${(props) => props.theme.gray.blur};
  padding: 16px 20px;
`;

const TripCard = styled.div`
  padding: 16px 20px;
  padding-right: 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: ${(props) => props.theme.gray.bg};
  }
`;

const TripContainer = styled.div`
  width: 90%;
  height: 100%;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: flex-start;
  height: 20px;
  width: 20px;
  background-color: transparent;
  font-size: 10px;
  color: ${(props) => props.theme.gray.blur};
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.gray.accent};
  }
`;

const TripCardTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
  line-height: 1;
`;

const TripCardDuration = styled.h2`
  font-weight: 400;
  font-size: 14px;
  color: ${(props) => props.theme.gray.accent};
`;
