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
    <Wrapper onClick={handleTripCardClicked}>
      <Title>{title}</Title>
    </Wrapper>
  );
};

export default TripCard;

const Wrapper = styled(motion.div)`
  width: 270px;
  height: 360px;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.3);
  flex: 0 0 auto;
  margin-right: 20px;
  border-radius: 30px;
  box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: flex-end;
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: 400;
  color: white;
`;

interface ITripCardProps {
  title: string;
  number: number;
}
