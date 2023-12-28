import { useRecoilState } from "recoil";
import styled from "styled-components";
import { tripState, userState } from "../atoms";
import NavigationBar from "./NavigationBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Header = ({ now }: { now: number }) => {
  return (
    <Wrapper>
      <Title>TravelGo</Title>
      <NavigationBar now={now} />
      <Menu>
        <FontAwesomeIcon icon={faBars} />
      </Menu>
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
  padding: 25px 28px;
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
  color: ${(props) => props.theme.blue.accent};
`;

const Menu = styled.div`
  color: ${(props) => props.theme.gray.semiblur};
`;
