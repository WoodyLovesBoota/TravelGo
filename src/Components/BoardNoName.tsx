import styled from "styled-components";
import { IJourney } from "../atoms";
import { Droppable } from "react-beautiful-dnd";
import DragJourneyCard from "./DragJourneyCard";

const BoardNoName = ({ journey, boardId }: IJourneyBoardProps) => {
  return (
    <Wrapper>
      {journey.length === 0 ? (
        <Empty>There is no schedule..</Empty>
      ) : (
        <Droppable droppableId={boardId}>
          {(provided, snapshot) => (
            <Area
              isDraggingOver={snapshot.isDraggingOver}
              isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {journey.map(
                (place, index) =>
                  place && (
                    <DragJourneyCard
                      key={place.timestamp + ""}
                      index={index}
                      journeyId={place.timestamp + ""}
                      journeyName={place.name}
                      journeyAddress={place.address}
                      boardId={boardId}
                      placeId={place.placeId}
                    />
                  )
              )}
              {provided.placeholder}
            </Area>
          )}
        </Droppable>
      )}
    </Wrapper>
  );
};

export default BoardNoName;

const Wrapper = styled.div`
  border-radius: 0.5rem;
  width: 100%;
  padding: 1.25rem 1.5625rem;
  color: ${(props) => props.theme.main.word};
  background-color: ${(props) => props.theme.main.hlbg};
  min-height: 6.25rem;
`;

const Empty = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1.25rem;
`;

const Area = styled.div<IDragging>`
  background-color: transparent;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-content: space-between;
  grid-gap: 0.625rem;
  @media screen and (max-width: 1199px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media screen and (max-width: 899px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

interface IJourneyBoardProps {
  boardId: string;
  journey: (IJourney | undefined)[];
}

interface IDragging {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
