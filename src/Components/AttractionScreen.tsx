import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Link, PathMatch, useMatch, useNavigate } from "react-router-dom";

import { destinationState, tripState, userState } from "../atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { IPlaceDetail } from "../api";

const AttractionScreen = ({ destination }: IAttractionScreenProps) => {
  const navigate = useNavigate();
  const destinationData = useRecoilValue(destinationState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const attractionMatch: PathMatch<string> | null = useMatch("/place/:city");

  const onOverlayClick = () => {};

  return (
    <AnimatePresence>
      {attractionMatch && attractionMatch?.params.city === destination?.name && (
        <Wrapper>
          <Container>{destination?.name}</Container>
        </Wrapper>
      )}
    </AnimatePresence>
  );
};
export default AttractionScreen;

const Wrapper = styled.div`
  background-color: white;
  width: 100vw;
  height: 100vw;
  position: fixed;
  top: 0;
  left: 0;
`;

const Container = styled.div``;

interface IAttractionScreenProps {
  destination: IPlaceDetail | undefined;
}
