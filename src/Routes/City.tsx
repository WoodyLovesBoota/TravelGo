import styled from "styled-components";
import DestinationCard from "../Components/DestinationCard";
import { useRecoilState, useRecoilValue } from "recoil";
import { playerState, tripState, userState } from "../atoms";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import NavigationBar from "../Components/NavigationBar";
import SmallCalender from "../Components/SmallCalender";

const City = () => {
  const [users, setUsers] = useRecoilState(userState);
  const [player, setPlayer] = useRecoilState(playerState);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<IForm>();
  const currentTrip = useRecoilValue(tripState);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref, ...rest } = register("destination");

  const onOverlayClicked = () => {
    navigate("/trip");
  };

  const onValid = (data: IForm) => {
    navigate(`/search/${currentTrip}?destination=${data.destination}`);
  };

  return (
    <AnimatePresence>
      <NavigationBar />
      <Wrapper variants={inputVar} initial="initial" animate="animate">
        <Header>
          <Title>
            <Button variants={buttonVar} whileHover={"hover"} onClick={onOverlayClicked}>
              <FontAwesomeIcon icon={faLeftLong}></FontAwesomeIcon>
            </Button>
            {currentTrip}
          </Title>
          <SubTitle>
            Please add a destination (ex. city, region ...). You can click the card to add detail for the destination.
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
            <SubmitButton type="submit">Add a destination</SubmitButton>
          </Form>
          {/* {users[player.email].trips[currentTrip] && users[player.email].trips[currentTrip]?.length ? (
            <SmallCalender destinations={users[player.email].trips[currentTrip]} />
          ) : null} */}
        </Header>
        <Main>
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
  min-height: 100vh;
  color: ${(props) => props.theme.main.word};
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 12% 8%;

  @media screen and (max-width: 800px) {
    min-height: 100vh;
  }
`;

const Button = styled(motion.button)`
  border: none;
  background-color: ${(props) => props.theme.main.accent};
  color: ${(props) => props.theme.main.word};
  border-radius: 25px;
  width: 40px;
  height: 40px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 50px;
  display: flex;
  align-items: center;
`;

const SubTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
`;

const Main = styled.div`
  background-color: ${(props) => props.theme.main.normal};
  padding: 12% 8%;
  width: 100%;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 30px;
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
  margin: 70px 0;
  width: 100%;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

const Input = styled(motion.input)`
  width: 400px;
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
  @media screen and (max-width: 800px) {
    width: 100%;
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
