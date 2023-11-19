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
    if (users[player.email].trips[data.title])
      alert("동일한 이름의 여행이 존재합니다");
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
      <Header>
        <Title>
          Choose the journey <br />
          or Create a new <br />
          journey
        </Title>
        <SubTitle>
          Choose the journey you want and fill out the contents of the trip. Or
          you can create a new journey.
        </SubTitle>
        <Form onSubmit={handleSubmit(onValid)}>
          <Input
            {...register("title", { required: true })}
            autoComplete="off"
            placeholder="Enter a name of Trip"
          />
          <SubmitButton type="submit">Create a journey</SubmitButton>
        </Form>
      </Header>
      <Main>
        <MainTitle>Your journeys are</MainTitle>
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
    </Wrapper>
  );
};

export default Trip;

const Wrapper = styled(motion.div)`
  width: 100vw;
  height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 150px;
  padding: 0 20%;
  padding-top: 250px;
`;

const Main = styled.div`
  background-color: ${(props) => props.theme.main.hlbg};
  padding: 50px 15%;
  padding-bottom: 200px;
`;

const Title = styled.h2`
  font-size: 64px;
  font-weight: 700;
  margin-bottom: 50px;
  width: 100%;
`;

const SubTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 50px;
`;

const MainTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 50px;
`;

const TripCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  grid-row-gap: 20px;
`;

const Loader = styled.div`
  font-size: 16px;
  font-weight: 500;
`;
const Form = styled.form`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 400px;
  height: 66px;
  padding: 20px;
  padding-bottom: 10px;
  font-size: 16px;
  border: none;
  box-shadow: 1px 2px 2px 2px lightgray;
  border-radius: 7px;
  font-weight: 600;
  &::placeholder {
    position: absolute;
    top: 25px;
  }
  &:focus {
    outline: none;
    box-shadow: 1px 2px 2px 2px ${(props) => props.theme.main.accent};
    &::placeholder {
      position: absolute;
      top: 5px;
    }
  }
`;

const SubmitButton = styled.button`
  margin-left: 40px;
  border: none;
  background-color: ${(props) => props.theme.main.accent};
  color: white;
  padding: 20px 25px;
  font-size: 18px;
  border-radius: 50px;
  font-weight: 700;
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
