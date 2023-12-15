import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { playerState } from "../atoms";

const Home = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useRecoilState(playerState);
  const goTemp = () => {
    setPlayer({
      email: "guest$gmail$com",
      info: {
        name: "Guest",
        password: "1111",
      },
    });
    navigate("/trip");
  };

  const goNext = () => {
    navigate("/login");
  };

  return (
    <Wrapper>
      <Header>
        {/* <Capital>B</Capital>EEE
        <LoginButton variants={buttonVar} whileHover={"hover"} onClick={goNext}>
          Log In
        </LoginButton> */}
      </Header>

      <Container>
        <Title>Hit the road. make your own trip.</Title>
        <Button variants={buttonVar} whileHover={"hover"} onClick={goTemp}>
          Get Start
        </Button>
      </Container>
    </Wrapper>
  );
};

export default Home;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  /* background: url("./bee-bg.jpeg"); */
  background-size: cover;
  background-position: center center;
`;

const Header = styled.div`
  padding: 4%;
  font-size: 21px;
  font-weight: 700;
  display: flex;
  align-items: center;
`;

const Capital = styled.span`
  color: ${(props) => props.theme.main.accent};
  font-weight: 700;
  font-size: 21px;
  cursor: pointer;
`;

const LoginButton = styled(motion.button)`
  margin-left: auto;
  font-size: 18px;
  font-weight: 600;
  color: #373e3f;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const Container = styled.div`
  width: 100%;
  height: 60%;
  padding: 3% 8%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 50px;

  @media screen and (max-width: 800px) {
    margin-top: 100px;
  }
`;

const SubTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 30px;
  @media screen and (max-width: 800px) {
    display: none;
  }
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 40px;
`;

const Detail = styled.h2`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 60px;
  width: 50%;
  line-height: 2;
  @media screen and (max-width: 1200px) {
    width: 70%;
  }
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

const Button = styled(motion.button)`
  height: 4.375rem;
  width: 9.375rem;
  cursor: pointer;
  border-radius: 2.1875rem;
  font-weight: 600;
  font-size: 18px;
  border: none;
  background-color: #fed745;
  @media screen and (max-width: 500px) {
    width: 100vw;
    border-radius: 0;
    position: fixed;
    left: 0;
    bottom: 0;
    height: 70px;
  }
`;

const buttonVar = {
  hover: { scale: 1.1 },
};
