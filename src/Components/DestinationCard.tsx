import styled from "styled-components";
import { makeImagePath } from "../utils";
import { IPlaceDetail } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLong } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { destinationState, playerState, tripState, userState } from "../atoms";

const DestinationCard = ({ title, destination }: IBigTripCardProps) => {
  const navigate = useNavigate();
  const [currentDestination, setCurrentDestination] = useRecoilState(destinationState);

  const onDestinationClicked = () => {
    navigate(`/travel/${title}/${destination?.name}`);
    setCurrentDestination(destination);
  };

  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [player, setPlayer] = useRecoilState(playerState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);

  const currentTarget =
    userInfo[player.email].trips[currentTrip][
      userInfo[player.email].trips[currentTrip].findIndex((e) => e.destination?.name === destination?.name)
    ];

  const deleteDestination = (destination: IPlaceDetail | undefined) => {
    setUserInfo((current) => {
      const userCopy = { ...current[player.email] };
      const copy = { ...current[player.email].trips };
      const target = [...copy[currentTrip]];
      const index = target.findIndex((e) => e.destination?.name === destination?.name);
      const newTarget = [...target.slice(0, index), ...target.slice(index + 1)];
      const newTrip = { ...copy, [currentTrip]: newTarget };
      const newUser = { ...userCopy, ["trips"]: newTrip };
      return { ...current, [player.email]: newUser };
    });
  };

  return (
    <AnimatePresence>
      <Wrapper>
        {destination && (
          <Container>
            <Destination
              bgPhoto={`url(${makeImagePath(destination?.photos ? destination?.photos[0].photo_reference : "", 500)})`}
              onClick={onDestinationClicked}
            />
            <Description>
              <DestinationContent onClick={onDestinationClicked}>
                <DestinationTitle>
                  {destination?.name} {destination?.formatted_address.split(" ")[0]}
                </DestinationTitle>
                <DestinationSubTitle>
                  {"(" +
                    currentTarget.detail.date.split("|")[0] +
                    " ~ " +
                    currentTarget.detail.date.split("|")[1] +
                    ")"}
                </DestinationSubTitle>
              </DestinationContent>
              <Button
                onClick={() => {
                  deleteDestination(destination);
                }}
              >
                삭제
              </Button>
            </Description>
          </Container>
        )}
      </Wrapper>
    </AnimatePresence>
  );
};

export default DestinationCard;

const Wrapper = styled(motion.div)`
  display: flex;
  /* box-shadow: 2px 2px 4px 2px lightgray; */
  cursor: pointer;
  width: 100%;
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
  height: 18vw;
  border-radius: 20px;
  cursor: pointer;
`;

const DestinationTitle = styled.h2`
  font-size: 21px;
  font-weight: 600;
  color: black;
  margin-top: 10px;
`;

const DestinationSubTitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
  margin-top: 5px;
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

interface IBigTripCardProps {
  title: string;
  destination: IPlaceDetail | undefined;
}
