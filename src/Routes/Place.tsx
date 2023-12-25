import { useRecoilState } from "recoil";
import { destinationState, userState, tripState } from "../atoms";
import styled from "styled-components";
import { IGeAutoCompletePlacesResult, getAutoCompletePlacesResult } from "../api";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import PlaceCard from "../Components/PlaceCard";
import JourneyCard from "../Components/JourneyCard";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHotel } from "@fortawesome/free-solid-svg-icons";
import { faFortAwesome } from "@fortawesome/free-brands-svg-icons";
import HotelCard from "../Components/HotelCard";
import { makeImagePath } from "../utils";
import NavigationBar from "../Components/NavigationBar";
import Header from "../Components/Header";
import DestinationCard from "../Components/DestinationCard";
import CityCard from "../Components/CityCard";

const Place = () => {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [isHotel, setIsHotel] = useState(false);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [isInputOpen, setIsInputOpen] = useState(false);

  const { register, handleSubmit } = useForm<IForm>();

  const onValid = (data: IForm) => {
    setIsInputOpen(false);
    const newName = data.keyword;
    newName &&
      setUserInfo((current) => {
        const copy = { ...current[currentTrip] };
        const temp = { ...current };
        delete temp[currentTrip];
        return { ...temp, [newName]: copy };
      });
    newName && setCurrentTrip(data.keyword);
  };

  return (
    <Wrapper>
      <Header />
      <NavigationBar now={2} />
      <Main>
        <Trip>
          <TitleBox>
            {isInputOpen ? (
              <TitleForm onSubmit={handleSubmit(onValid)}>
                <TitleInput
                  {...register("keyword")}
                  autoComplete="off"
                  autoFocus
                  placeholder={currentTrip}
                />
              </TitleForm>
            ) : (
              <Title>{currentTrip}</Title>
            )}
            <PencilIcon
              onClick={() => {
                isInputOpen ? setIsInputOpen(false) : setIsInputOpen(true);
              }}
            />
          </TitleBox>
          <TripDuration
            onClick={() => {
              isInputOpen && setIsInputOpen(false);
            }}
          >
            {userInfo[currentTrip].date
              .split("|")[0]
              .slice(0, userInfo[currentTrip].date.split("|")[0].length - 2)}
            (
            {
              ["일", "월", "화", "수", "목", "금", "토"][
                Number(userInfo[currentTrip].date.split("|")[0].split(".")[3])
              ]
            }
            ){" ~ "}
            {userInfo[currentTrip].date
              .split("|")[1]
              .slice(0, userInfo[currentTrip].date.split("|")[0].length - 2)}
            (
            {
              ["일", "월", "화", "수", "목", "금", "토"][
                Number(userInfo[currentTrip].date.split("|")[1].split(".")[3])
              ]
            }
            )
          </TripDuration>
        </Trip>
        <Citys>
          {userInfo[currentTrip].trips.map((city, index) => (
            <CityCard
              key={city.destination?.name && city.destination?.name + index}
              destination={city.destination}
            />
          ))}
        </Citys>
      </Main>
    </Wrapper>
  );
};

export default Place;

const Wrapper = styled(motion.div)`
  width: 100vw;
  min-height: 100vh;
  padding: 0 300px;
`;

const Trip = styled.div`
  width: 400px;
  padding: 20px 30px;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  margin-top: 60px;
  border-radius: 10px;
`;

const TitleBox = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 21px;
  font-weight: 400;
  margin-bottom: 12px;
  min-width: 100px;
  padding: 3px 5px;
`;

const PencilIcon = styled.div`
  background: url("./pencil.png");
  background-position: center center;
  background-size: cover;
  width: 14px;
  height: 14px;
  margin-left: 40px;
`;

const TitleForm = styled.form`
  min-width: 120px;
  margin-bottom: 10px;
`;

const TitleInput = styled.input`
  width: 120px;
  font-size: 21px;
  font-weight: 400;
  border-bottom: 2px solid ${(props) => props.theme.gray.blur};
  padding: 3px 5px;
  &:focus {
    outline: none;
    border-bottom: 2px solid ${(props) => props.theme.blue.accent};
  }
`;

const TripDuration = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: ${(props) => props.theme.gray.semiblur};
`;

const Citys = styled.div`
  margin-top: 36px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 15px;
  padding-bottom: 50px;
`;

const Main = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface IForm {
  keyword: string;
}
