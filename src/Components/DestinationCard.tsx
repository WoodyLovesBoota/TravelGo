import styled from "styled-components";
import { makeImagePath } from "../utils";
import { IPlaceDetail } from "../api";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { destinationState, tripState, userState } from "../atoms";
import { useEffect, useState } from "react";
import GoogleMap from "./GoogleMap";
import DBHandler from "../firebase/DBHandler";

const DestinationCard = ({ title, destination }: IBigTripCardProps) => {
  const navigate = useNavigate();
  const [isCardClicked, setIsCardClicked] = useState(false);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);

  const onAddClick = () => {
    setIsCardClicked(false);
    setUserInfo((current) => {
      let copy = { ...current[currentTrip] };
      let target = [...current[currentTrip].trips];
      let newArr =
        target.length === 0
          ? [
              {
                destination: destination,
                detail: {
                  date: 0 + "|" + 0,
                  attractions: { NoName: [] },
                  hotels: [],
                  wtm: [],
                },
              },
            ]
          : [
              ...target,
              {
                destination: destination,
                detail: {
                  date: 0 + "|" + 0,
                  attractions: { NoName: [] },
                  hotels: [],
                  wtm: [],
                },
              },
            ];
      return { ...current, [currentTrip]: { ...copy, ["trips"]: newArr } };
    });
  };

  // useEffect(() => {
  //   DBHandler.addUserInfoPost("destination", "userDestination", userInfo);
  // }, [userInfo]);

  const deleteDestination = (destination: IPlaceDetail | undefined) => {};

  const onCardClick = () => {
    setIsCardClicked(true);
  };

  return (
    <>
      <AnimatePresence>
        <Wrapper onClick={onCardClick} layoutId={destination?.place_id} key={destination?.place_id}>
          {destination && (
            <Container>
              <Destination
                bgPhoto={`url(${makeImagePath(
                  destination?.photos ? destination?.photos[0].photo_reference : "",
                  500
                )})`}
              />
              <Description>
                <DestinationTitle>{destination?.name}</DestinationTitle>
                <DestinationSubTitle>
                  {destination?.formatted_address.split(" ")[0]}
                </DestinationSubTitle>
              </Description>
            </Container>
          )}
        </Wrapper>
      </AnimatePresence>
      <AnimatePresence>
        {isCardClicked && (
          <BigDestination>
            <BigOverlay onClick={() => setIsCardClicked(false)} />
            <BigCard layoutId={destination?.place_id}>
              <Column>
                <Card
                  bgPhoto={makeImagePath(
                    destination?.photos ? destination.photos[0]?.photo_reference : "",
                    800
                  )}
                />
              </Column>
              <Column>
                <DestinationInfo>
                  <CardTitle>{destination?.name}</CardTitle>
                  <CardAddress>{destination?.formatted_address}</CardAddress>

                  {/* <CardDescription>{destination?.editorial_summary?.overview}</CardDescription> */}
                </DestinationInfo>
                <GoogleMap
                  destination={destination?.formatted_address}
                  width="100%"
                  height="68%"
                  zoom={11}
                />
                <CardButton onClick={onAddClick}>추가하기</CardButton>
              </Column>
            </BigCard>
          </BigDestination>
        )}
      </AnimatePresence>
    </>
  );
};

export default DestinationCard;

const Wrapper = styled(motion.div)`
  display: flex;
  cursor: pointer;
  width: 282px;
  border-radius: 16px;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  padding: 26px 20px;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
`;

const Destination = styled.div<{ bgPhoto: string }>`
  background-image: ${(props) => props.bgPhoto};
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 282px;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  cursor: pointer;
`;

const DestinationTitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: black;
`;

const DestinationSubTitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: gray;
`;

const Button = styled(motion.button)`
  border: none;
  width: 60px;
  height: 80%;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  font-weight: 500;
  margin-top: auto;
  z-index: 50;
  color: black;
  background-color: lightgray;
  &:hover {
    background-color: #e9e9e9;
  }
`;

const BigDestination = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const BigOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
`;

const BigCard = styled(motion.div)`
  width: 1200px;
  height: 600px;
  z-index: 2;
  border-radius: 6px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  padding: 40px;
  box-shadow: 12px 12px 0 rgba(0, 0, 0, 0.2);
`;

const Card = styled(motion.div)<{ bgPhoto: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  border-radius: 4px;
`;

const CardTitle = styled(motion.h2)`
  font-size: 18px;
  color: gray;
  font-weight: 400;
`;

const CardDescription = styled.h2`
  font-size: 16px;
  font-weight: 500;
`;

const CardAddress = styled.h2`
  font-size: 24px;
  font-weight: 500;
`;

const DestinationInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
`;

const CardButton = styled.button`
  margin-top: auto;
  padding: 20px;
  background-color: #8eb1f9;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.25);
  &:hover {
    background-color: #8eb1f9dd;
  }
  &:active {
    background-color: #8eb1f9bb;
    box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.25) inset;
  }
`;

const hoverVar = {
  initial: { y: 0 },
  hover: { y: -16, boxShadow: "12px 16px 0 0 rgba(0,0,0,0.1)" },
};

interface IBigTripCardProps {
  title: string | undefined;
  destination: IPlaceDetail | undefined;
}
