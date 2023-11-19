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
        TravelGo{" "}
        <LoginButton variants={buttonVar} whileHover={"hover"} onClick={goNext}>
          Log In
        </LoginButton>
      </Header>

      <Container>
        <SubTitle>Build your own journey</SubTitle>
        <Title>Make your travel plans.</Title>
        <Detail>
          Start planning your travel adventures with TravelGo. Explore favorite
          spots in the city, and enjoy the pleasure of planning and recording
          every moment of your journey. Create the trip you've always wanted,
          wherever in the world you want to go.
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
  background-color: ${(props) => props.theme.main.accent};
  color: white;
`;

const Header = styled.div`
  padding: 60px 100px;
  font-size: 28px;
  font-weight: 900;
  display: flex;
  align-items: center;
`;

const LoginButton = styled(motion.button)`
  margin-left: auto;
  font-size: 18px;
  font-weight: 600;
  color: white;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const Container = styled.div`
  width: 100%;
  height: 80%;
  padding: 5% 10%;
  display: flex;
  flex-direction: column;
`;

const SubTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 80px;
  font-weight: 900;
  margin-bottom: 40px;
`;

const Detail = styled.h2`
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 60px;
  width: 60%;
  line-height: 1.5;
`;

const Button = styled(motion.button)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 190px;
  cursor: pointer;
  border-radius: 35px;
  font-weight: 600;
  color: ${(props) => props.theme.main.accent};
  font-size: 24px;
  border: none;
  background-color: white;
`;

const buttonVar = {
  hover: { scale: 1.1 },
};
