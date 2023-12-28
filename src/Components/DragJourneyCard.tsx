import { AnimatePresence } from "framer-motion";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IPlaceDetail } from "../api";
import { makeImagePath } from "../utils";

const DragJourneyCard = ({
  journeyId,
  journeyName,
  index,
  journeyAddress,
  journeyPhoto,
  destination,
}: IDragJourneyCardProps) => {
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
                <Num>{index}</Num>
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

interface IDragJourneyCardProps {
  journeyId: string | undefined;
  index: number;
  journeyName: string | undefined;
  journeyAddress: string | undefined;
  destination: IPlaceDetail | undefined;
  journeyPhoto: string | undefined;
}
