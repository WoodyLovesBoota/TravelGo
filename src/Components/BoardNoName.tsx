import styled from "styled-components";
import { IJourney } from "../atoms";
import { Droppable } from "react-beautiful-dnd";
import DragJourneyCard from "./DragJourneyCard";
import { IPlaceDetail } from "../api";

const BoardNoName = ({ journey, boardId, destination }: IJourneyBoardProps) => {
  return (
    <Wrapper>
      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <>
              {journey.length === 0 ? (
                <Empty>스케줄이 없습니다. 이전 화면으로 넘어가 장소를 추가해주세요.</Empty>
              ) : (
                journey.map(
                  (place, index) =>
                    place && (
                      <DragJourneyCard
                        key={place.timestamp + ""}
                        index={index}
                        journeyId={place.timestamp + ""}
                        journeyName={place.name}
                        journeyAddress={place.address}
                        destination={destination}
                        journeyPhoto={place.image[0]}
                      />
                    )
                )
              )}
            </>
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
};

export default BoardNoName;

const Wrapper = styled.div`
  width: 100%;
  padding: 32px;
  color: ${(props) => props.theme.main.word};
  height: 100%;
  box-shadow: -4px 0 12px 0 rgba(0, 0, 0, 0.1);
`;

const Empty = styled.h2`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.gray.blur};
`;

const Area = styled.div<IDragging>`
  background-color: transparent;
  display: flex;
  flex-direction: column;
`;

interface IJourneyBoardProps {
  boardId: string;
  journey: (IJourney | undefined)[];
  destination: IPlaceDetail | undefined;
}

interface IDragging {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
