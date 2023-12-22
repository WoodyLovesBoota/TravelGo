import styled from "styled-components";
import DestinationCard from "../Components/DestinationCard";
import { useRecoilState, useRecoilValue } from "recoil";
import { tripState, userState } from "../atoms";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import NavigationBar from "../Components/NavigationBar";
import imageList from "../imageData.json";
import {
  IGetPlaceResult,
  getPlaceResult,
  IGetPlaceDetailResult,
  getPlaceDetailResult,
} from "../api";
import { useQuery } from "react-query";
import Header from "../Components/Header";

const City = () => {
  const [users, setUsers] = useRecoilState(userState);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const currentTrip = useRecoilValue(tripState);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchData, setSearchData] = useState("");
  const { ref, ...rest } = register("destination");

  const { data: destinationData, isLoading: isDestinationLoading } = useQuery<IGetPlaceResult>(
    ["getDestination", searchData],
    () => getPlaceResult(searchData || ""),
    { enabled: !!searchData }
  );

  const { data: detailData, isLoading: isDetailLoading } = useQuery<IGetPlaceDetailResult>(
    ["getPlaceDetail", destinationData],
    () => getPlaceDetailResult(destinationData?.candidates[0].place_id),
    { enabled: !!destinationData }
  );

  const onValid = (data: IForm) => {
    setSearchData(data.destination);
    setValue("destination", "");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Wrapper>
      <Header />
      <NavigationBar now={1} />
      <Container variants={inputVar} initial="initial" animate="animate">
        {/* <Title>Title</Title> */}
        <SubTitle>여행할 도시를 찾아보세요</SubTitle>
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
      <Main>
        {isDestinationLoading || isDetailLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          detailData && (
            <Cards>
              <DestinationCard
                key={detailData?.result.place_id}
                title={detailData?.result.name}
                destination={detailData?.result}
              />
            </Cards>
          )
        )}
      </Main>
    </Wrapper>
  );
};

export default City;

const Wrapper = styled(motion.div)`
  width: 100vw;
  color: ${(props) => props.theme.main.word};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Card = styled.div``;

const Title = styled.div`
  font-size: 80px;
  font-weight: 500;
  line-height: 1;
  margin-bottom: 40px;
  padding-top: 100px;
`;

const SubTitle = styled.h2`
  font-size: 21px;
  font-weight: 400;
  text-align: center;
  padding-top: 100px;
`;

const Main = styled(motion.div)`
  width: 100%;
  padding: 0 72px;
  padding-bottom: 50px;
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
  display: flex;
  justify-content: center;
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
  margin: 70px 0 0 0;
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
  background-color: rgba(0, 0, 0, 0.2);
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
