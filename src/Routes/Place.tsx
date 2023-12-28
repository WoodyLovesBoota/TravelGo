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
import { daysSinceSpecificDate } from "../utils";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import AttractionScreen from "../Components/AttractionScreen";
import ScheduleScreen from "../Components/ScheduleScreen";
const Place = () => {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [isHotel, setIsHotel] = useState(false);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const navigate = useNavigate();

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

  const onBackClick = () => {
    navigate("/city");
  };

  const onCardClick = (name: string | undefined) => {
    navigate(`/place/${name}`);
  };

  return (
    <Wrapper>
      <Header now={2} />
      <Citys>
        {userInfo[currentTrip].trips.map((city, index) => (
          <>
            <AttractionScreen destination={city.destination} />
            <ScheduleScreen destination={city.destination} />
          </>
        ))}
      </Citys>
    </Wrapper>
  );
};

export default Place;

const Wrapper = styled(motion.div)`
  width: 100vw;
  min-height: 100vh;
`;

const Overview = styled.div`
  background-color: ${(props) => props.theme.gray.bg};
  width: 300px;
  height: 100vh;
  padding-top: 130px;
  padding-bottom: 28px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  display: flex;
  flex-direction: column;
`;

const OverviewDuration = styled.h2`
  color: ${(props) => props.theme.gray.accent};
  font-size: 14px;
  line-height: 24px;
  font-weight: 400;
  padding: 0 28px;
`;

const OverviewNight = styled.h2`
  color: ${(props) => props.theme.gray.accent};
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  padding: 0 28px;
`;

const OverviewCitys = styled.div`
  width: 100%;
  height: 500px;
  overflow-y: auto;
  margin-top: 50px;
`;

const OverviewCard = styled.div`
  width: 100%;
  padding: 16px 28px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: white;
  }
`;

const OverviewCardName = styled.h2`
  font-size: 14px;
  font-weight: 400;
  color: black;
`;

const Buttons = styled.div`
  margin-top: auto;
  z-index: 2;
  padding: 0 28px;
`;

const Goback = styled.button`
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  z-index: 2;
  background-color: transparent;
  color: ${(props) => props.theme.gray.button};
`;

const Button = styled.button`
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.blue.accent};
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  z-index: 2;
`;

const NoButton = styled.button`
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.gray.button};
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  z-index: 2;
`;

const TitleBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 28px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  min-width: 80px;
  padding: 3px 5px;
`;

const PencilIcon = styled.div`
  background: url("./pencil.png");
  background-position: center center;
  background-size: cover;
  width: 14px;
  height: 14px;
  margin-left: 20px;
`;

const TitleForm = styled.form`
  min-width: 100px;
`;

const TitleInput = styled.input`
  width: 100px;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: -2px;
  border-bottom: 2px solid ${(props) => props.theme.gray.blur};
  padding: 3px 5px;
  background-color: transparent;
  &:focus {
    outline: none;
    border-bottom: 2px solid black;
  }
`;

const Citys = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 24px;
  justify-content: center;
  width: 100%;
`;

const Main = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 130px 100px;
  padding-left: 400px;
`;

interface IForm {
  keyword: string;
}

interface IDragging {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
