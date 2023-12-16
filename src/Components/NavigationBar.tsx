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
    if (isHome) {
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
      navigate("/");
    }
  };

  const onDestinationClicked = () => {
    if (currentTrip !== "") {
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
      navigate(`/destination/${currentTrip}`);
    }
  };

  const onPlaceClicked = () => {
    currentTrip !== "" &&
      currentDestination?.name !== "string" &&
      navigate(`/travel/${currentTrip}/${currentDestination?.name}`);
  };

  const onJourneyClicked = () => {
    currentTrip !== "" &&
      currentDestination?.name !== "string" &&
      navigate(`/journey/${currentTrip}/${currentDestination?.name}`);
  };

  const onSummaryClicked = () => {
    currentTrip !== "" &&
      currentDestination?.name !== "string" &&
      navigate(`/summary/${currentTrip}/${currentDestination?.name}`);
  };

  return (
    <AnimatePresence>
      <Wrapper>
        <Title onClick={handleHomeClicked}>
          <Capital>B</Capital>EEE
        </Title>
        <Links>
          <Link onClick={onDestinationClicked}>DESTINATIONS</Link>
          <Link onClick={onPlaceClicked}>PLACES</Link>
          <Link onClick={onJourneyClicked}>JOURNEYS</Link>
          <Link onClick={onSummaryClicked}>SUMMARY</Link>
        </Links>
      </Wrapper>
    </AnimatePresence>
  );
};

export default NavigationBar;

const Wrapper = styled.div`
  width: 100vw;
  z-index: 50;
  padding: 0 144px;
  display: flex;
  align-items: center;
  height: 100px;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 21px;
  cursor: pointer;
`;

const Capital = styled.span`
  color: white;
  font-weight: 600;
  font-size: 21px;
  cursor: pointer;
`;

const Links = styled.div`
  margin-left: auto;
  display: flex;
`;

const Link = styled.h2`
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  margin-left: 30px;
`;
