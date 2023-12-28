import styled from "styled-components";
import { IJourney } from "../atoms";
import { Droppable } from "react-beautiful-dnd";
import DragJourneyCard from "./DragJourneyCard";
import { IPlaceDetail } from "../api";
import DragCardSmall from "./DragCardSmall";

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
                      <DragCardSmall
                        key={place.timestamp + ""}
                        index={index}
                        journeyId={place.timestamp + ""}
                        journeyName={place.name}
                        journeyAddress={place.address}
                        destination={destination}
                        journeyPhoto={place.placeId}
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
  border-top: 1px solid #f2f2f2;
  max-height: 320px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    background-color: transparent;
    width: 5px;
    height: 5px;
    display: none;
  }
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
