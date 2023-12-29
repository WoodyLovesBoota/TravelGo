import { AnimatePresence } from "framer-motion";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IPlaceDetail } from "../api";
import { makeImagePath } from "../utils";
import { useRecoilState } from "recoil";
import { tripState, userState } from "../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const DragJourneyCard = ({
  journeyId,
  journeyName,
  index,
  journeyAddress,
  journeyPhoto,
  placeId,
  destination,
}: IDragJourneyCardProps) => {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);

  const deleteCard = () => {
    setUserInfo((current) => {
      const one = { ...current };
      const two = { ...one[currentTrip] };
      const three = [...two.trips];
      const index = three.findIndex((e) => e.destination?.name === destination?.name);
      const four = { ...three[index] };
      const five = { ...four.detail };
      const six = { ...five.attractions };
      const target = Object.values({ ...six }).findIndex((e) =>
        e.some((ele) => ele?.placeId === placeId)
      );
      const seven = [...six[Object.keys({ ...six })[target]]];

      const targetIndex = seven.findIndex((e) => e?.placeId === placeId);
      const newArray = [...seven.slice(0, targetIndex), ...seven.slice(targetIndex + 1)];

      const newSix = { ...six, [Object.keys({ ...six })[target]]: newArray };
      const newFive = { ...five, ["attractions"]: newSix };
      const newFour = { ...four, ["detail"]: newFive };
      const newThree = [...three.slice(0, index), newFour, ...three.slice(index + 1)];
      const newTwo = { ...two, ["trips"]: newThree };
      const newOne = { ...current, [currentTrip]: newTwo };

      return newOne;
    });
  };

  return (
    <AnimatePresence>
      {journeyId ? (
        <>
          <Draggable key={journeyName} draggableId={journeyId} index={index}>
            {(provided, snapshot) => (
              <Card
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <Num>{index + 1}</Num>
                <Container>
                  <Photo
                    bgPhoto={`url(${makeImagePath(
                      journeyPhoto
                        ? journeyPhoto
                        : destination
                        ? destination.photos[0].photo_reference
                        : "",
                      500
                    )})`}
                  />
                  <Description>
                    <Title>{journeyName}</Title>
                    <Subtitle>{journeyAddress}</Subtitle>
                  </Description>
                  <Button onClick={deleteCard}>
                    <FontAwesomeIcon icon={faX} />{" "}
                  </Button>
                </Container>
              </Card>
            )}
          </Draggable>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default DragJourneyCard;

const Card = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  height: 80px;
`;

const Num = styled.h2`
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.theme.blue.light};
  color: ${(props) => props.theme.blue.accent};
  font-size: 14px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
`;

const Container = styled.div`
  display: flex;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  width: 308px;
  background-color: white;
`;

const Photo = styled.div<{ bgPhoto: string }>`
  background-image: ${(props) => props.bgPhoto};
  background-size: cover;
  background-position: center center;
  width: 80px;
  height: 80px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
`;

const Description = styled.div`
  padding: 12px;
  height: 100%;
  width: 228px;
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 7px;
`;

const Subtitle = styled.h2`
  color: ${(props) => props.theme.gray.normal};
  font-size: 12px;
  font-weight: 300;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 12px;
  font-size: 10px;
  color: ${(props) => props.theme.gray.blur};
  background-color: transparent;
  cursor: pointer;
`;

interface IDragJourneyCardProps {
  journeyId: string | undefined;
  index: number;
  journeyName: string | undefined;
  journeyAddress: string | undefined;
  destination: IPlaceDetail | undefined;
  placeId: string | undefined;
  journeyPhoto: string | undefined;
}
