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
            >
              <Header>
                <Arrow onClick={onDestinationClicked} variants={buttonVar} whileHover={"hover"}>
                  <FontAwesomeIcon icon={faRightLong} />
                </Arrow>
                <Button
                  onClick={() => {
                    deleteDestination(destination);
                  }}
                  variants={buttonVar}
                  whileHover={"hover"}
                >
                  삭제
                </Button>
              </Header>
            </Destination>
            <DestinationTitle>{destination?.name}</DestinationTitle>
            <DestinationSubTitle>{destination?.formatted_address.split(" ")[0]}</DestinationSubTitle>
          </Container>
        )}
      </Wrapper>
    </AnimatePresence>
  );
};

export default DestinationCard;

const Wrapper = styled(motion.div)`
  padding: 0.9375rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0.125rem 0.125rem 0.25rem 0.125rem lightgray;
  cursor: pointer;
  width: 100%;
  background-color: white;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Arrow = styled(motion.h2)`
  font-size: 1.125rem;
  background-color: white;
  padding: 0.625rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2.5rem;
`;

const Destination = styled.div<{ bgPhoto: string }>`
  background-image: ${(props) => props.bgPhoto};
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 12.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0.9375rem;
  padding-bottom: 0.9375rem;
  cursor: pointer;
`;

const DestinationTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0.4375rem auto;
`;

const DestinationSubTitle = styled.h2`
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0 auto;
`;

const Button = styled(motion.button)`
  border: none;
  width: 3.75rem;
  height: 1.875rem;
  cursor: pointer;
  font-size: 0.75rem;
  border-radius: 0.3125rem;
  background-color: white;
  font-weight: 600;
  margin-top: auto;
  z-index: 50;
`;

const buttonVar = {
  hover: { scale: 1.2 },
};

interface IBigTripCardProps {
  title: string;
  destination: IPlaceDetail | undefined;
}
