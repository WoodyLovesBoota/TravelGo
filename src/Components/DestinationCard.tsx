import styled from "styled-components";
import { makeImagePath } from "../utils";
import { IPlaceDetail } from "../api";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { destinationState, tripState, userState } from "../atoms";
import { useState } from "react";
import GoogleMap from "./GoogleMap";

const DestinationCard = ({ title, destination }: IBigTripCardProps) => {
  const navigate = useNavigate();
  const [isCardClicked, setIsCardClicked] = useState(false);
  const [userInfo, setUserInfo] = useRecoilState(userState);

  const onAddClick = () => {
    setIsCardClicked(false);
    setUserInfo((current) => [
      ...current,
      {
        destination: destination,
        detail: {
          date: 0 + "|" + 0,
          attractions: { NoName: [] },
          hotels: [],
          wtm: [],
        },
      },
    ]);
  };

  const deleteDestination = (destination: IPlaceDetail | undefined) => {};

  const onCardClick = () => {
    setIsCardClicked(true);
  };

  return (
    <>
      <AnimatePresence>
        <Wrapper
          onClick={onCardClick}
          variants={hoverVar}
          whileHover={"hover"}
          layoutId={destination?.place_id}
          key={destination?.place_id}
        >
          {destination && (
            <Container>
              <Destination
                bgPhoto={`url(${makeImagePath(
                  destination?.photos ? destination?.photos[0].photo_reference : "",
                  500
                )})`}
                // onClick={onDestinationClicked}
              />
              <Description>
                <DestinationContent>
                  <DestinationTitle>{destination?.name}</DestinationTitle>
                  <DestinationSubTitle>
                    {destination?.formatted_address.split(" ")[0]}
                    {/* {"(" +
                        currentTarget.detail.date.split("|")[0] +
                        " ~ " +
                        currentTarget.detail.date.split("|")[1] +
                        ")"} */}
                  </DestinationSubTitle>
                </DestinationContent>
                {/* <Button
                    onClick={() => {
                      deleteDestination(destination);
                    }}
                  >
                    삭제
                  </Button> */}
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
  /* box-shadow: 2px 2px 4px 2px lightgray; */
  cursor: pointer;
  width: 300px;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.1);
  padding: 8px;
  border-radius: 6px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const DestinationContent = styled.div``;

const Description = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Destination = styled.div<{ bgPhoto: string }>`
  background-image: ${(props) => props.bgPhoto};
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 300px;
  border-radius: 6px;
  cursor: pointer;
`;

const DestinationTitle = styled.h2`
  font-size: 21px;
  font-weight: 400;
  color: black;
  margin-top: 5px;
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
