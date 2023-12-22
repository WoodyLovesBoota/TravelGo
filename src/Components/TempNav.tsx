import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { destinationState, userState, tripState, navState, STATUS } from "../atoms";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { makeImagePath } from "../utils";

const NavigationBar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [openDestination, setOpenDestination] = useState(false);

  const onDestinationClicked = () => {
    setOpenDestination(true);
  };

  const onDeleteClick = (name: string | undefined) => {
    setUserInfo((prev) => {
      let index = [...prev].findIndex((e) => e.destination?.name === name);
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  };

  const handleNavClick = () => {
    if (openDestination) setOpenDestination(false);
  };

  return (
    <AnimatePresence>
      <Wrapper onClick={handleNavClick}>
        <Title>
          <Capital>B</Capital>EEE
        </Title>
        <Links>
          <Box>
            <Link onClick={onDestinationClicked}>DESTINATIONS</Link>
            {userInfo.length > 0 && (
              <Circle
                key={userInfo.length}
                variants={numberVar}
                initial="initial"
                animate="animate"
              >
                {userInfo.length}
              </Circle>
            )}
          </Box>
        </Links>
      </Wrapper>
      {openDestination && (
        <Destinations>
          {userInfo.map((dest) => (
            <DestItem>
              <DestImg
                bgphoto={`url(${makeImagePath(
                  dest.destination?.photos ? dest.destination?.photos[0].photo_reference : "",
                  500
                )})`}
              />
              <DestTitle>{dest.destination?.name}</DestTitle>
              <DeleteButton onClick={() => onDeleteClick(dest.destination?.name)}>x</DeleteButton>
            </DestItem>
          ))}
        </Destinations>
      )}
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

const Destinations = styled.div`
  display: flex;
`;

const DestItem = styled.div`
  display: flex;
`;

const DestImg = styled.div<{ bgphoto: string }>`
  background-image: ${(props) => props.bgphoto};
  background-position: center center;
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 100%;
`;

const DestTitle = styled.h2``;

const DeleteButton = styled.button``;

const Box = styled.div`
  position: relative;
`;

const Circle = styled(motion.h2)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: red;
  width: 20px;
  height: 20px;
  border-radius: 100px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  position: absolute;
  top: -10px;
  right: -20px;
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

const numberVar = {
  initial: { scale: 0 },
  animate: { scale: 1 },
};
