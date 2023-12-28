import { AnimatePresence } from "framer-motion";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IPlaceDetail } from "../api";
import { makeImagePath } from "../utils";
import { tripState, userState } from "../atoms";
import { useRecoilState } from "recoil";

const DragCardSmall = ({
  journeyId,
  journeyName,
  index,
  journeyAddress,
  journeyPhoto,
  destination,
}: IDragJourneyCardProps) => {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);

  return (
    <AnimatePresence>
      {journeyId ? (
        <>
          {userInfo[currentTrip].trips[
            userInfo[currentTrip].trips.findIndex((e) => e.destination?.name === destination?.name)
          ].detail.attractions["NoName"].some((e) => e?.placeId === journeyPhoto) ? (
            <Draggable key={journeyName} draggableId={journeyId} index={index}>
              {(provided, snapshot) => (
                <Card
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <Description>
                    <Title>{journeyName}</Title>
                  </Description>
                </Card>
              )}
            </Draggable>
          ) : (
            <NormalCard>
              <Description>
                <Title>{journeyName}</Title>
              </Description>
            </NormalCard>
          )}
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default DragCardSmall;

const Card = styled.div`
  width: 100%;
  padding: 0 44px;
`;

const Description = styled.div``;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 400;
  padding: 13px 0;
`;

const NormalCard = styled.div`
  width: 100%;
  padding: 0 44px;

  background-color: ${(props) => props.theme.blue.light};
`;

interface IDragJourneyCardProps {
  journeyId: string | undefined;
  index: number;
  journeyName: string | undefined;
  journeyAddress: string | undefined;
  destination: IPlaceDetail | undefined;
  journeyPhoto: string | undefined;
}
