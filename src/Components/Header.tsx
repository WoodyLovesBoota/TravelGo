import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { tripState, userState } from "../atoms";

const Header = () => {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);

  return (
    <Wrapper>
      <Title>TravelGo</Title>
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
