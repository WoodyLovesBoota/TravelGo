import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Link, PathMatch, useMatch, useNavigate } from "react-router-dom";

import { isCalendarState, tripState, userState } from "../atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { IPlaceDetail } from "../api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IGeAutoCompletePlacesResult, getAutoCompletePlacesResult } from "../api";
import { useQuery } from "react-query";
import PlaceCard from "./PlaceCard";
import { ReactComponent as Search } from "../assets/search.svg";
import JourneyCard from "./JourneyCard";
import GoogleMapMarker from "./GoogleMapMarker";
import SmallCalender from "./SmallCalendar";

const ScheduleScreen = ({ destination }: IScheduleScreenProps) => {
  const navigate = useNavigate();
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const scheduleMatch: PathMatch<string> | null = useMatch("/schedule/:city");
  const [isCalendarOpen, setIsCalendarOpen] = useRecoilState(isCalendarState);
  const [value, setValue] = useState("");
  const [isHotel, setIsHotel] = useState(false);
  const [stage, setStage] = useState(0);

  const { register, handleSubmit, setValue: setInputValue } = useForm<IForm>();

  const onValid = (data: IForm) => {
    setValue(data.keyword);
  };

  const onNextClick = () => {};

  const onPrevClick = () => {
    navigate(`/place/${destination?.name}`);
  };

  return (
    <>
      {scheduleMatch && scheduleMatch?.params.city === destination?.name && (
        <Wrapper>
          <NavColumn>
            <NavBox isnow={stage === 0}>
              <NavTitle onClick={() => setStage(0)}>전체</NavTitle>
            </NavBox>
            {Object.keys(
              userInfo[currentTrip].trips[
                userInfo[currentTrip].trips.findIndex(
                  (e) => e.destination?.name === destination?.name
                )
              ].detail.attractions
            ).map(
              (title, ind) =>
                ind !== 0 && (
                  <NavBox isnow={stage === ind + 2}>
                    <NavTitle
                      onClick={() => {
                        setStage(ind + 2);
                      }}
                    >
                      {title}
                    </NavTitle>
                  </NavBox>
                )
            )}
            <NavButtons>
              <NavPrevButton onClick={onPrevClick}>이전</NavPrevButton>

              <NavButton onClick={onNextClick}>다음</NavButton>
            </NavButtons>
          </NavColumn>
        </Wrapper>
      )}
    </>
  );
};

export default ScheduleScreen;

const Wrapper = styled.div`
  background-color: white;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
`;

const NavColumn = styled.div`
  width: 8%;
  height: 100%;
  padding: 32px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchColumn = styled.div`
  width: 25%;
  height: 100%;
  padding: 32px;
`;

const AttractionColumn = styled.div`
  width: 25%;
  height: 100%;
  padding: 32px;
`;

const HotelColumn = styled.div`
  width: 42%;
  height: 100%;
`;

const NavBox = styled.div<{ isnow: boolean }>`
  padding: 25px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.2);
  border-radius: 14px;
  margin-bottom: 25px;
  cursor: pointer;
  background-color: ${(props) => (props.isnow ? props.theme.blue.accent : "transparent")};
  h2 {
    color: ${(props) => props.isnow && "white"};
  }
`;

const NavTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
`;

const NavButtons = styled.div`
  margin-top: auto;
  width: 100%;
`;

const NavPrevButton = styled.button`
  padding: 25px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.2);
  border-radius: 14px;
  margin-bottom: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
`;

const NavButton = styled.button`
  padding: 25px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.2);
  border-radius: 14px;
  margin-bottom: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  background-color: black;
  color: white;
`;

const Title = styled.h2`
  font-size: 21px;
  font-weight: 600;
`;

const Duration = styled.h2`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.gray.blur};
  margin-bottom: 15px;
  cursor: pointer;
`;

const Form = styled.form`
  width: 100%;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  padding: 15px;
  font-size: 16px;
  font-weight: 400;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${(props) => props.theme.gray.blur};
  }
`;

const Icon = styled.div`
  position: absolute;
  top: 13px;
  right: 15px;
`;

const SearchResult = styled.div``;

const Loader = styled.h2``;

const Board = styled.div``;

const Attractions = styled.div`
  width: 100%;
  height: 50%;
`;

const Hotels = styled.div`
  width: 100%;
  height: 50%;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
`;

const Num = styled.h2`
  width: 20px;
  height: 20px;
  border-radius: 100px;
  margin-right: 15px;
  font-weight: 500;
  font-size: 12px;
  color: white;
  background-color: ${(props) => props.theme.blue.accent};
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface IScheduleScreenProps {
  destination: IPlaceDetail | undefined;
}

interface IForm {
  keyword: string;
}
