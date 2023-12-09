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
    <Hex onClick={handleTripCardClicked}>
      <HexInner>
        <Content>
          <p>{title}</p>
        </Content>
      </HexInner>
    </Hex>
  );
};

export default TripCard;

const Hex = styled(motion.div)`
  width: 25%;
  margin-bottom: 1.8%;
  position: relative;
  visibility: hidden;
  cursor: pointer;

  &:nth-of-type(7n + 5) {
    margin-left: 12.5%;
  }
  &:after {
    content: "";
    display: block;
    padding-bottom: 80%;
  }
`;
const HexInner = styled(motion.div)`
  position: absolute;
  width: 99%;
  padding-bottom: 114.6%;
  overflow: hidden;
  visibility: hidden;

  transform: rotate3d(0, 0, 1, -60deg) skewY(30deg);
  * {
    position: absolute;
    visibility: visible;
  }
`;
const Content = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  transform: skewY(-30deg) rotate3d(0, 0, 1, 60deg);

  background: linear-gradient(
    135deg,
    hsla(15, 100%, 25%, 1) 1%,
    hsla(17, 41%, 51%, 1) 19%,
    hsla(23, 41%, 63%, 1) 34%,
    hsla(23, 65%, 73%, 1) 50%,
    hsla(23, 41%, 63%, 1) 68%,
    hsla(17, 41%, 51%, 1) 83%,
    hsla(15, 100%, 25%, 1) 100%
  );

  p {
    font-size: 1.3125rem;
    font-weight: 500;
    text-align: center;
    color: #fff;
    &:hover {
      background-color: transparent;
    }
  }
`;

interface ITripCardProps {
  title: string;
  number: number;
}
