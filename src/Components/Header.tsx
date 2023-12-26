import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { tripState, userState } from "../atoms";
import NavigationBar from "./NavigationBar";

const Header = ({ now }: { now: number }) => {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);

  return (
    <Wrapper>
      <Title>TravelGo</Title>
      <NavigationBar now={now} />
      <Menu>3</Menu>
    </Wrapper>
  );
};

export default Header;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 25px 30px;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
`;

const Menu = styled.div``;
