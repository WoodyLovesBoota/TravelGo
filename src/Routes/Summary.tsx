import styled from "styled-components";
import { useRecoilState } from "recoil";
import { tripState, userState } from "../atoms";
import { useEffect, useState } from "react";
import { makeImagePath } from "../utils";
import GoogleRouteMap from "../Components/GoogleRouteMap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Summary = () => {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <Wrapper></Wrapper>;
};

export default Summary;

const Wrapper = styled.div``;
