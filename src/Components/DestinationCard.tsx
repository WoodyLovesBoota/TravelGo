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
              <Card
                bgPhoto={makeImagePath(
                  destination?.photos ? destination.photos[0]?.photo_reference : "",
                  800
                )}
              />
              <Column>
                <DestinationInfo>
                  <CardTitle>{destination?.name}</CardTitle>
                  <CardAddress>{destination?.formatted_address.split(" ")[0]}</CardAddress>
                </DestinationInfo>
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
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  position: relative;
  width: 321px;
  height: 321px;
  border-radius: 8px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
`;

const Destination = styled.div<{ bgPhoto: string }>`
  background-image: ${(props) => props.bgPhoto};
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 241px;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  cursor: pointer;
`;

const DestinationTitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 4px;
  color: black;
`;

const DestinationSubTitle = styled.h2`
  font-size: 14px;
  font-weight: 300;
  color: ${(props) => props.theme.gray.normal};
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
  width: 800px;
  height: 500px;
  z-index: 2;
  border-radius: 20px;
  background-color: white;
  display: flex;
  padding: 36px;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
`;

const Card = styled(motion.div)<{ bgPhoto: string }>`
  width: 428px;
  height: 428px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
`;

const CardTitle = styled(motion.h2)`
  font-size: 28px;
  font-weight: 400;
  padding-top: 44px;
  margin-bottom: 10px;
`;

const CardAddress = styled.h2`
  font-size: 18px;
  font-weight: 400;
  color: ${(props) => props.theme.gray.normal};
`;

const DestinationInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 36px;
`;

const CardButton = styled.button`
  margin-top: auto;
  height: 50px;
  width: 264px;
  background-color: ${(props) => props.theme.blue.accent};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
`;

interface IBigTripCardProps {
  title: string | undefined;
  destination: IPlaceDetail | undefined;
}
