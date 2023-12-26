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
              <DestinationTitle>{destination?.name}</DestinationTitle>
              <DestinationSubTitle>
                {destination?.formatted_address.split(" ")[0]}
              </DestinationSubTitle>
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
                  <CardDescription>{destination?.editorial_summary?.overview}</CardDescription>
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
  display: flex;
  cursor: pointer;
  width: 100%;
  /* border-radius: 16px; */
  /* box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1); */
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 60px;
`;

const DestinationTitle = styled.h2`
  font-size: 18px;
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
  background-color: rgba(0, 0, 0, 0.25);
`;

const BigCard = styled(motion.div)`
  width: 800px;
  height: 500px;
  z-index: 2;
  background-color: white;
  display: flex;
  padding: 36px;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
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
  font-weight: 500;
`;

const CardDescription = styled.h2`
  font-size: 14px;
  font-weight: 300;
  margin-top: 30px;
`;

const CardAddress = styled.h2`
  font-size: 18px;
  font-weight: 400;
  color: lightgray;
`;

const DestinationInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 44px;
  padding-left: 36px;
`;

const CardButton = styled.button`
  margin-top: auto;
  padding: 16px;
  background-color: blue;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  width: 264px;
  cursor: pointer;
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
