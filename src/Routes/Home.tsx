import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { destinationState, playerState, tripState, userState } from "../atoms";
import TripCard from "../Components/TripCard";
import NavigationBar from "../Components/NavigationBar";
import { motion } from "framer-motion";
import imageList from "../imageData.json";
import { useEffect } from "react";

const Home = () => {
  const { register, handleSubmit, setValue: setInputValue } = useForm<IForm>();
  const [users, setUsers] = useRecoilState(userState);
  const [player, setPlayer] = useRecoilState(playerState);

  const onValid = (data: IForm) => {
    if (users[player.email].trips[data.title]) alert("동일한 이름의 여행이 존재합니다");
    else {
      setUsers((current) => {
        const copy = { ...current[player.email].trips };
        const target = { ...copy, [data.title]: [] };
        const temp = { ...current[player.email], ["trips"]: target };
        return { ...current, [player.email]: temp };
      });

      setInputValue("title", "");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Wrapper bgphoto={imageList[Math.floor(Math.random() * 10) % imageList.length]}>
      <NavigationBar />
      <Container variants={loadingVar} initial="initial" animate="animate">
        <Header>
          <Title>
            MAKE YOUR <br />
            OWN TRIP.
          </Title>
          <SubTitle>
            새로운 여행을 만들어주세요. 원하는 여행을 선택하고 여행에 대한 정보를 입력하여 나만의 여행을 만들어 가세요.
          </SubTitle>
          <Form onSubmit={handleSubmit(onValid)}>
            <Input {...register("title", { required: true })} autoComplete="off" placeholder="Enter a name of Trip" />
            <SubmitButton type="submit">Create</SubmitButton>
          </Form>
        </Header>
        <Main>
          {Object.entries(users[player.email].trips).length === 0 ? (
            <Loader>There is no trips... Please create a new trip.</Loader>
          ) : (
            <TripCards>
              {Object.entries(users[player.email].trips).map(([title, trip], ind) => (
                <TripCard key={title} title={title} number={ind} />
              ))}
            </TripCards>
          )}
        </Main>
      </Container>
    </Wrapper>
  );
};

export default Home;

const Wrapper = styled.div<{ bgphoto: string }>`
  width: 100vw;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${(props) => props.bgphoto});
  background-position: center center;
  background-size: cover;
  min-height: 100vh;
`;

const Container = styled(motion.div)`
  display: flex;
  padding: 150px 140px;
  padding-right: 0;
  width: 100%;
  margin: auto 0;
`;

const Header = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Main = styled.div``;

const Title = styled.h2`
  font-size: 80px;
  font-weight: 500;
  margin-bottom: 50px;
  line-height: 1;
`;

const SubTitle = styled.h2`
  font-size: 21px;
  font-weight: 400;
  margin-bottom: 50px;
  width: 80%;
`;

const TripCards = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  width: 60vw;
  padding-top: 20px;
  padding-left: 30px;
  &::-webkit-scrollbar {
    height: 10px;
    display: block;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
    display: block;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    display: block;
  }
`;

const Loader = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  @media screen and (max-width: 500px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Input = styled.input`
  width: 90%;
  padding: 15px;
  font-size: 21px;
  border-radius: 10px;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.2);
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: white;
  }
`;

const SubmitButton = styled.button`
  margin-left: 1.25rem;
  border: none;
  background-color: ${(props) => props.theme.main.accent};
  color: white;
  padding: 20px 30px;
  font-size: 16px;
  border-radius: 25px;
  font-weight: 600;
  display: none;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.main.accent + "aa"};
  }
  @media screen and (max-width: 800px) {
  }
  @media screen and (max-width: 500px) {
    width: 100%;
    margin-top: 20px;
    border-radius: 12px;
  }
`;

const loadingVar = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.3 } },
};

interface IForm {
  title: string;
}
