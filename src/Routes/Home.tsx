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
        <Capital>B</Capital>EEE
        <LoginButton variants={buttonVar} whileHover={"hover"} onClick={goNext}>
          Log In
        </LoginButton>
      </Header>

      <Container>
        <SubTitle>Build your journey</SubTitle>
        <Title>Make your travel plans</Title>
        <Detail>
          Start planning your travel adventures with BEEE. Create the trip you've always wanted, wherever in the world
          you want to go.
        </Detail>
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
  height: 100vh;
  color: #373e3f;
  background: url("./bee-bg.jpeg");
  background-size: cover;
  background-position: center center;
`;

const Header = styled.div`
  padding: 4%;
  font-size: 1.3125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
`;

const Capital = styled.span`
  color: ${(props) => props.theme.main.accent};
  font-weight: 700;
  font-size: 1.3125rem;
  cursor: pointer;
`;

const LoginButton = styled(motion.button)`
  margin-left: auto;
  font-size: 1.125rem;
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
`;

const SubTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.875rem;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
`;

const Detail = styled.h2`
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 3.75rem;
  width: 50%;
  line-height: 2;
  @media screen and (max-width: 1199px) {
    width: 70%;
  }
  @media screen and (max-width: 899px) {
    display: none;
  }
`;

const Button = styled(motion.button)`
  height: 4.375rem;
  width: 9.375rem;
  cursor: pointer;
  border-radius: 2.1875rem;
  font-weight: 600;
  font-size: 1.125rem;
  border: none;
  background-color: #fed745;
`;

const buttonVar = {
  hover: { scale: 1.1 },
};
