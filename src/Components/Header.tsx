import { useRecoilState } from "recoil";
import styled from "styled-components";
import { tripState, userState } from "../atoms";
import NavigationBar from "./NavigationBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";

const Header = ({ now }: { now: number }) => {
  const navigate = useNavigate();
  return (
    <Wrapper isnow={now === -1}>
      <Title
        onClick={() => {
          navigate("/");
        }}
      >
        <Logo />
      </Title>
      {now !== -1 && <NavigationBar now={now} />}
      <Menu>
        <FontAwesomeIcon icon={faBars} />
      </Menu>
    </Wrapper>
  );
};

export default Header;

const Wrapper = styled.div<{ isnow: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 25px 28px;
  box-shadow: ${(props) => !props.isnow && "0px 2px 12px 0px rgba(0, 0, 0, 0.1)"};
  background-color: ${(props) => (props.isnow ? "rgba(255,255,255,0.2)" : "white")};
  backdrop-filter: ${(props) => props.isnow && "blur(8px)"};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
`;

const Title = styled.h2`
  cursor: pointer;
  width: 100px;
`;

const Menu = styled.div`
  color: ${(props) => props.theme.gray.semiblur};
`;
