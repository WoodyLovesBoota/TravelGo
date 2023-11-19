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
              <Button
                variants={buttonVar}
                whileHover={"hover"}
                onClick={onOverlayClicked}
              >
                <FontAwesomeIcon icon={faLeftLong}></FontAwesomeIcon>
              </Button>
              {currentTrip}
            </Title>
            <SubTitle>
              Please add a destination (ex. city, region ...). You can click the
              card to add detail for the destination.
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
          {users[player.email].trips[currentTrip] &&
          users[player.email].trips[currentTrip]?.length ? (
            <SmallCalender
              destinations={users[player.email].trips[currentTrip]}
            />
          ) : null}
        </Header>
        <Main>
          {users[player.email].trips[currentTrip].length === 0 ? (
            <Loader>
              There is no destination. Please add your destination
            </Loader>
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
  padding: 100px 0;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Header = styled.div`
  background-color: white;
  padding: 150px 15%;
  display: flex;
  justify-content: space-between;
  height: 75vh;
`;

const Column = styled.div`
  width: 50%;
`;

const Button = styled(motion.button)`
  border: none;
  background-color: ${(props) => props.theme.main.accent};
  color: white;
  border-radius: 25px;
  width: 50px;
  height: 50px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 64px;
  font-weight: 800;
  margin-bottom: 50px;
  display: flex;
  align-items: center;
`;

const SubTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  width: 80%;
`;

const Main = styled.div`
  background-color: ${(props) => props.theme.main.bg};

  padding: 100px 12%;
  padding-bottom: 200px;
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
  height: 100px;
  font-size: 16px;
  font-weight: 500;
`;

const Form = styled(motion.form)`
  display: flex;
  margin: 70px 0;
`;

const Input = styled(motion.input)`
  width: 60%;
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
  padding: 10px 25px;
  font-size: 16px;
  border-radius: 50px;
  font-weight: 700;
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
