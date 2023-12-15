import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { playerState, destinationState, userState, tripState, navState, STATUS } from "../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IPlaceDetail } from "../api";

const NavigationBar = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useRecoilState(playerState);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [currentDestination, setCurrentDestination] = useRecoilState(destinationState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [openJourney, setOpenJourney] = useRecoilState(navState);
  const [openSingleJourney, setOpenSingleJourney] = useState(currentTrip);

  const handleHomeClicked = () => {
    const isHome = window.confirm("홈 화면으로 돌아가시겠습니까?");
    isHome && navigate("/trip");
  };

  const openUserInfo = () => {
    setIsUserInfoOpen((current) => !current);
  };

  const onJourneyClicked = () => {
    setOpenJourney((current) => (current === STATUS.JOURNEYS ? STATUS.DEFAULT : STATUS.JOURNEYS));
  };

  const onSingleJourneyClicked = (data: string) => {
    setOpenSingleJourney(data);
  };

  const onDetailClicked = (dest: IPlaceDetail | undefined) => {
    setCurrentTrip(openSingleJourney);
    setCurrentDestination(dest);
    navigate(`/travel/${openSingleJourney}/${dest?.name}`);
  };

  const onLogOutClicked = () => {
    setCurrentDestination({
      formatted_address: "string",
      international_phone_number: "string",
      rating: 0,
      photos: [{ photo_reference: "string" }],
      geometry: {
        location: {
          lat: 0,
          lng: 0,
        },
      },
      name: "string",
      editorial_summary: { overview: "string" },
      reviews: {
        rating: 0,
        text: "string",
        relative_time_description: "string",
        author_name: "string",
      },
      place_id: "string",
    });
    setCurrentTrip("");
    setPlayer({ email: "", info: { name: "", password: "" } });
    navigate("/");
  };

  return (
    <AnimatePresence>
      <Wrapper>
        <Title onClick={handleHomeClicked}>
          <Capital>B</Capital>EEE
        </Title>
        <Journey onClick={onJourneyClicked}>Journeys</Journey>
      </Wrapper>
    </AnimatePresence>
  );
};

export default NavigationBar;

const Wrapper = styled.div`
  width: 100vw;
  z-index: 50;
  padding: 0 140px;
  display: flex;
  align-items: center;
  height: 120px;
`;

const Title = styled.h2`
  font-weight: 900;
  font-size: 21px;
  cursor: pointer;
  padding: 1.875rem 0;
`;

const Capital = styled.span`
  color: ${(props) => props.theme.main.accent};
  font-weight: 900;
  font-size: 21px;
  cursor: pointer;
  padding: 1.875rem 0;
`;

const Journey = styled.h2`
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
`;
