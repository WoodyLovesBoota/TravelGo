import { IPlaceDetail } from "../api";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { tripState, userState } from "../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const JourneyCard = ({ name, placeId, destination }: IJourneyCardProps) => {
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [userInfo, setUserInfo] = useRecoilState(userState);

  const deleteJourney = () => {
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
    <Wrapper>
      <Container>
        <Title>{name}</Title>
        <Button onClick={deleteJourney}>
          <FontAwesomeIcon icon={faX} />
        </Button>
      </Container>
    </Wrapper>
  );
};

export default JourneyCard;

const Wrapper = styled.div`
  width: 100%;
`;

const Container = styled.div`
  width: 100%;
  cursor: pointer;
  padding: 13px 0;
  display: flex;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 400;
`;

const Button = styled.h2`
  margin-left: auto;
  font-size: 8px;
  color: ${(props) => props.theme.gray.blur};
`;

interface IJourneyCardProps {
  name: string | undefined;
  placeId: string | undefined;
  destination: IPlaceDetail | undefined;
}
