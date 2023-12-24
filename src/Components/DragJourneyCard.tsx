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
  width: 100%;
  cursor: pointer;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  box-shadow: 4px 4px 20px 0 rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  align-items: center;
`;

const Photo = styled.div<{ bgPhoto: string }>`
  background-image: ${(props) => props.bgPhoto};
  background-size: cover;
  background-position: center center;
  border-radius: 10px;
  width: 50px;
  height: 50px;
  margin-right: 15px;
`;

const Description = styled.div``;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 500;
`;

const Subtitle = styled.h2`
  color: ${(props) => props.theme.gray.semiblur};
  font-size: 12px;
  font-weight: 400;
`;

interface IDragJourneyCardProps {
  journeyId: string | undefined;
  index: number;
  journeyName: string | undefined;
  journeyAddress: string | undefined;
  destination: IPlaceDetail | undefined;
  journeyPhoto: string | undefined;
}
