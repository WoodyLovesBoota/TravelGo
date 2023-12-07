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
          <Column>
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
          </Column>
          {users[player.email].trips[currentTrip] && users[player.email].trips[currentTrip]?.length ? (
            <SmallCalender destinations={users[player.email].trips[currentTrip]} />
          ) : null}
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
  overflow: auto;
  width: 100vw;
  z-index: 99;
  color: ${(props) => props.theme.main.word};
  padding: 8% 0;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Header = styled.div`
  padding: 8% 8%;
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 1199px) {
    flex-direction: column;
  }
`;

const Column = styled.div`
  width: 70%;
  @media screen and (max-width: 1199px) {
    width: 100%;
  }
`;

const Button = styled(motion.button)`
  border: none;
  background-color: ${(props) => props.theme.main.accent};
  color: ${(props) => props.theme.main.word};
  border-radius: 1.5625rem;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1.25rem;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 3.125rem;
  display: flex;
  align-items: center;
`;

const SubTitle = styled.h2`
  font-size: 1rem;
  font-weight: 500;
`;

const Main = styled.div`
  background-color: ${(props) => props.theme.main.normal};
  padding: 8%;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15.625rem, 1fr));
  grid-gap: 1.875rem;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 6.25rem;
  font-size: 1rem;
  font-weight: 500;
`;

const Form = styled(motion.form)`
  display: flex;
  margin: 4.375rem 0;
  width: 100%;
`;

const Input = styled(motion.input)`
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
  border-radius: 3.125rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.main.accent + "aa"};
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
