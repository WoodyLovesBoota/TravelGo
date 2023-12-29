import styled from "styled-components";
import { IJourney } from "../atoms";
import { Droppable } from "react-beautiful-dnd";
import DragJourneyCard from "./DragJourneyCard";
import { IPlaceDetail } from "../api";

const BoardJourney = ({ journey, boardId, destination }: IJourneyBoardProps) => {
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
            {journey && journey.length === 0 ? (
              <Empty>
                좌측 사이드바에서 장소를 <br />
                드래그 앤 드롭 해보세요
              </Empty>
            ) : (
              journey &&
              journey.map(
                (j, i) =>
                  j && (
                    <DragJourneyCard
                      key={j.timestamp + ""}
                      index={i}
                      journeyId={j.timestamp + ""}
                      journeyName={j.name}
                      journeyAddress={j.address}
                      journeyPhoto={j.image[0]}
                      placeId={j.placeId}
                      destination={destination}
                    />
                  )
              )
            )}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
};

export default BoardJourney;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 0 0 auto;
`;

const Empty = styled.h2`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 300;
  color: ${(props) => props.theme.gray.normal};
`;

const Area = styled.div<IDragging>`
  flex-grow: 1;
  height: 100%;
  width: 100%;
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
