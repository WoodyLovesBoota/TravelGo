import styled from "styled-components";
import DestinationCard from "../Components/DestinationCard";
import { useRecoilState, useRecoilValue } from "recoil";
import { playerState, tripState, userState } from "../atoms";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import NavigationBar from "../Components/NavigationBar";
import imageList from "../imageData.json";

const City = () => {
  const [users, setUsers] = useRecoilState(userState);
  const [player, setPlayer] = useRecoilState(playerState);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<IForm>();
  const currentTrip = useRecoilValue(tripState);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref, ...rest } = register("destination");

  const onValid = (data: IForm) => {
    navigate(`/search/${currentTrip}?destination=${data.destination}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AnimatePresence>
      <Wrapper>
        <Header bgphoto={imageList[Math.floor(Math.random() * 10) % imageList.length]}>
          <NavigationBar />
          <Container variants={inputVar} initial="initial" animate="animate">
            <Title>{currentTrip}</Title>
            <SubTitle>
              도시 혹은 지역을 검색하여 {currentTrip}에서의 목적지를 추가하세요. 이후 카드를 클릭하여 세부사항을 점검할
              수 있습니다.
            </SubTitle>
            <Form onSubmit={handleSubmit(onValid)}>
              <Input
                {...rest}
                name="destination"
                ref={(e) => {
                  ref(e);
                  inputRef.current = e;
                }}
                placeholder="Enter your destination"
                autoFocus
                autoComplete="off"
                spellCheck={false}
                required
              />
            </Form>
          </Container>
        </Header>
        <Main variants={inputVar} initial="initial" animate="animate">
          <MainTitle>여행지</MainTitle>
          <MainSubTitle>당신이 선택한 여행지는?</MainSubTitle>
          {users[player.email].trips[currentTrip].length === 0 ? (
            <Loader>There is no destination. Please add your destination</Loader>
          ) : (
            <Cards>
              {users[player.email].trips[currentTrip].map((element) => (
                <DestinationCard
                  key={element.destination?.formatted_address}
                  title={currentTrip}
                  destination={element.destination}
                />
              ))}
            </Cards>
          )}
        </Main>
      </Wrapper>
    </AnimatePresence>
  );
};

export default City;

const Wrapper = styled(motion.div)`
  width: 100vw;
  color: ${(props) => props.theme.main.word};
  display: flex;
  flex-direction: column;
`;

const Header = styled.div<{ bgphoto: string }>`
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${(props) => props.bgphoto});
  background-position: center center;
  background-size: cover;
  width: 100%;
  min-height: 100vh;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto 0;
`;

const Title = styled.div`
  font-size: 72px;
  font-weight: 600;
  margin-bottom: 40px;
  padding-top: 100px;
`;

const SubTitle = styled.h2`
  font-size: 18px;
  font-weight: 400;
  width: 25%;
  text-align: center;
`;

const Main = styled(motion.div)`
  width: 100%;
  padding: 150px 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: black;
  margin-bottom: 15px;
`;

const MainSubTitle = styled.h2`
  color: gray;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 50px;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30px;
  grid-row-gap: 60px;
  width: 100%;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
`;

const Form = styled(motion.form)`
  display: flex;
  justify-content: center;
  margin: 70px 0;
  width: 100%;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

const Input = styled(motion.input)`
  width: 700px;
  padding: 20px;
  font-size: 18px;
  border: none;
  border-radius: 7px;
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0.6);
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: white;
  }
`;

const SubmitButton = styled.button`
  margin-left: 40px;
  border: none;
  background-color: ${(props) => props.theme.main.button};
  color: ${(props) => props.theme.main.word};
  padding: 20px 30px;
  font-size: 16px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.main.accent + "aa"};
  }
  @media screen and (max-width: 800px) {
    width: 100%;
    margin: 20px 0;
    border-radius: 7px;
  }
`;

const inputVar = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.3 } },
};

const buttonVar = {
  hover: { scale: 1.2 },
};

interface IForm {
  destination: string;
}
