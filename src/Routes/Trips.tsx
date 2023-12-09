import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { playerState, userState } from "../atoms";
import TripCard from "../Components/TripCard";
import NavigationBar from "../Components/NavigationBar";
import { motion } from "framer-motion";

const Trip = () => {
  const navigate = useNavigate();
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

  return (
    <Wrapper variants={loadingVar} initial="initial" animate="animate">
      <NavigationBar />
      <Container>
        <Header>
          <Title>
            Create your<span> journey</span>
          </Title>
          <SubTitle>
            Choose the journey you want and fill out the contents of the trip. Or you can create a new journey.
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
              {Object.entries(users[player.email].trips).map(([title, trip]) => (
                <TripCard key={title} title={title} number={trip.length} />
              ))}
            </TripCards>
          )}
        </Main>
      </Container>
    </Wrapper>
  );
};

export default Trip;

const Wrapper = styled(motion.div)`
  width: 100vw;
  min-height: 100vh;
`;

const Container = styled.div`
  display: flex;
  width: 100vw;
  padding: 12% 8%;

  @media screen and (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
  }
  @media screen and (max-width: 500px) {
    padding-bottom: 0;
  }
`;

const Header = styled.div`
  width: 55%;
  height: 100%;
  margin-bottom: 15%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  @media screen and (max-width: 1200px) {
    width: 100%;
  }
  @media screen and (max-width: 500px) {
    min-height: 100vh;
    justify-content: flex-start;
  }
`;

const Main = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  @media screen and (max-width: 1200px) {
    width: 100%;
    height: inherit;
  }
  @media screen and (max-width: 500px) {
    background-color: ${(props) => props.theme.main.accent};
    width: 100vw;
    padding: 30% 12%;
  }
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 50px;
  width: 100%;
  span {
    font-size: 3rem;
    font-weight: 600;
    @media screen and (max-width: 500px) {
      width: 100%;
      display: block;
    }
  }
`;

const SubTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 50px;
  width: 100%;
`;

const TripCards = styled.div`
  width: 600px;
  margin-left: 50px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  @media screen and (max-width: 1200px) {
    width: 70%;
    margin: 0;
  }
  @media screen and (max-width: 800px) {
    width: 100%;
  }
  @media screen and (max-width: 500px) {
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
  width: 23.75rem;
  padding: 20px;
  font-size: 16px;
  border: none;
  box-shadow: 1px 2px 2px 2px lightgray;
  border-radius: 7px;
  font-weight: 600;
  &:focus {
    outline: none;
    box-shadow: 1px 2px 2px 2px ${(props) => props.theme.main.accent};
  }
  @media screen and (max-width: 500px) {
    width: 100%;
  }
`;

const SubmitButton = styled.button`
  margin-left: 1.25rem;
  border: none;
  background-color: ${(props) => props.theme.main.button};
  color: ${(props) => props.theme.main.word};
  padding: 20px 30px;
  font-size: 16px;
  border-radius: 25px;
  font-weight: 600;
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
