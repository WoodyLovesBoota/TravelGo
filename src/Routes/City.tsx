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
import { ReactComponent as Search } from "../assets/search.svg";

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
        <Form onSubmit={handleSubmit(onValid)}>
          <Input
            {...rest}
            name="destination"
            ref={(e) => {
              ref(e);
              inputRef.current = e;
            }}
            placeholder="어디로 여행을 떠나시나요?"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            required
          />
          <Icon>
            <Search width={23} />
          </Icon>{" "}
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

const Main = styled(motion.div)`
  width: 100%;
  padding: 0 72px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Cards = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 77px;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  padding: 77px;
`;

const Form = styled(motion.form)`
  display: flex;
  justify-content: center;
  margin: 80px 0 0 0;
  width: 506px;
  height: 50px;
  position: relative;
`;

const Input = styled(motion.input)`
  border-radius: 10px;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  padding: 15px 60px;
  font-size: 16px;
  font-weight: 400;
  &:focus {
    outline: none;
  }
  &::placeholder {
  }
`;

const Icon = styled.div`
  position: absolute;
  top: 13px;
  left: 15px;
`;

const inputVar = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.3 } },
};

interface IForm {
  destination: string;
}
