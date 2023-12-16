import styled from "styled-components";
import { IJourney } from "../atoms";
import { Droppable } from "react-beautiful-dnd";
import DragJourneyCard from "./DragJourneyCard";

const BoardNoName = ({ journey, boardId }: IJourneyBoardProps) => {
  return (
    <Wrapper>
      {journey.length === 0 ? (
        <Empty>스케줄이 없습니다. 이전 화면으로 넘어가 장소를 추가해주세요.</Empty>
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
  border-radius: 8px;
  width: 100%;
  padding: 20px 25px;
  color: ${(props) => props.theme.main.word};
  background-color: rgba(0, 0, 0, 0.8);
  min-height: 220px;
`;

const Empty = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin-top: 20px;
`;

const Area = styled.div<IDragging>`
  background-color: transparent;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: space-between;
  grid-gap: 10px;
`;

interface IJourneyBoardProps {
  boardId: string;
  journey: (IJourney | undefined)[];
}

interface IDragging {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
