import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { tripState } from "../atoms";
import { motion } from "framer-motion";

const TripCard = ({ title, number }: ITripCardProps) => {
  const navigate = useNavigate();
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const handleTripCardClicked = () => {
    setCurrentTrip(title);
    navigate(`/destination/${title}`);
  };

  return (
    <Wrapper variants={cardVar} whileHover={"wordHover"}>
      <Container
        variants={cardVar}
        whileHover={"hover"}
        onClick={handleTripCardClicked}
      >
        {number}
      </Container>
      <Title>{title}</Title>
    </Wrapper>
  );
};

export default TripCard;

const Wrapper = styled(motion.div)`
  width: 100px;
  height: 100px;
`;

const Container = styled(motion.div)`
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 30px;
  color: black;
  box-shadow: 2px 2px 4px 2px gray;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  width: 100%;
  margin-top: 15px;
`;

const cardVar = {
  hover: { scale: 1.1, boxShadow: "2px 2px 4px 2px #775EEF", color: "#775EEF" },
  wordHover: { color: "#775EEF" },
};

interface ITripCardProps {
  title: string;
  number: number;
}
