import { motion } from "framer-motion";
import styled from "styled-components";

const Header = () => {
  return (
    <Wrapper>
      <Title>TravelGo</Title>
      <Bag>가방</Bag>
    </Wrapper>
  );
};

export default Header;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 40px 300px;
`;

const Title = styled.h2`
  margin: 0 auto;
  font-size: 20px;
  font-weight: 500;
`;

const Bag = styled.div``;

const Circle = styled(motion.h2)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: red;
  width: 20px;
  height: 20px;
  border-radius: 100px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  position: absolute;
  top: -10px;
  right: -20px;
`;
