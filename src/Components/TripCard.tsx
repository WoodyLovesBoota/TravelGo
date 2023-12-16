import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { tripState } from "../atoms";
import { motion } from "framer-motion";
import imageList from "../imageData.json";

const TripCard = ({ title, number }: ITripCardProps) => {
  const navigate = useNavigate();
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const handleTripCardClicked = () => {
    setCurrentTrip(title);
    navigate(`/destination/${title}`);
  };

  return (
    <Wrapper onClick={handleTripCardClicked} bgphoto={imageList[Math.floor(Math.random() * 10) % imageList.length]}>
      <Title>{title}</Title>
    </Wrapper>
  );
};

export default TripCard;

const Wrapper = styled(motion.div)<{ bgphoto: string }>`
  width: 270px;
  height: 400px;
  padding: 20px;
  flex: 0 0 auto;
  margin-right: 20px;
  border-radius: 30px;
  box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: flex-end;
  cursor: pointer;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3)), url(${(props) => props.bgphoto});
  background-position: center center;
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 400;
  color: white;
`;

interface ITripCardProps {
  title: string;
  number: number;
}
