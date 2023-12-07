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
          <Title>Create your journey</Title>
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
  height: 100vh;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  @media screen and (max-width: 1100px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Header = styled.div`
  padding: 12% 8%;
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  @media screen and (max-width: 1100px) {
    width: 70%;
    height: inherit;
    padding-bottom: 0;
  }
`;

const Main = styled.div`
  padding: 10%;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  @media screen and (max-width: 1100px) {
    width: 60%;
    height: inherit;
    padding-top: 0;
  }
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 3.125rem;
  width: 100%;
`;

const SubTitle = styled.h2`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 3.125rem;
`;

const TripCards = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const Loader = styled.div`
  font-size: 1rem;
  font-weight: 500;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 25rem;
  padding: 1.25rem;
  font-size: 1rem;
  border: none;
  box-shadow: 0.0625rem 0.125rem 0.125rem 0.125rem lightgray;
  border-radius: 0.4375rem;
  font-weight: 600;
  &:focus {
    outline: none;
    box-shadow: 0.0625rem 0.125rem 0.125rem 0.125rem ${(props) => props.theme.main.accent};
  }
`;

const SubmitButton = styled.button`
  margin-left: 2.5rem;
  border: none;
  background-color: ${(props) => props.theme.main.button};
  color: ${(props) => props.theme.main.word};
  padding: 1.25rem 1.875rem;
  font-size: 1rem;
  border-radius: 1.5625rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.main.accent + "aa"};
  }
`;

const loadingVar = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.3 } },
};

interface IForm {
  title: string;
}
