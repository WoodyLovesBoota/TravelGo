import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const NavigationBar = ({ now }: { now: number }) => {
  const navigate = useNavigate();

  const handleVortexClick = (num: number) => {
    if (num <= now) {
      if (num === 0) navigate("/");
      else if (num === 1) navigate("/city");
      else if (num === 2) navigate("/place");
    }
  };
  return (
    <Wrapper>
      {["기간 설정", "여행지 설정", "장소 선택", "일정 관리", "최종 여행 계획"].map((e, i) => (
        <Vortex key={e + i}>
          <Title
            variants={circleVar}
            initial="initial"
            animate="animate"
            ispass={i < now}
            isnow={i === now}
          >
            {e}
          </Title>
          <Contents>
            <Circle
              variants={circleVar}
              initial="initial"
              animate="animate"
              ispass={i < now}
              isnow={i === now}
              onClick={() => {
                handleVortexClick(i);
              }}
            />
            {i !== 4 && <Line ispass={i < now} />}
          </Contents>
        </Vortex>
      ))}
    </Wrapper>
  );
};

export default NavigationBar;

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const Line = styled.div<{ ispass: boolean }>`
  width: 75px;
  height: 1.5px;
  background-image: linear-gradient(
    to right,
    ${(props) => (props.ispass ? "skyblue 30%" : "black 10%")},
    rgba(255, 255, 255, 0) 0%
  );
  background-position: center;
  background-size: 4px 1px;
  background-repeat: repeat-x;
`;

const Contents = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
`;

const Vortex = styled.div`
  display: flex;
  flex-direction: column;
`;

const Circle = styled(motion.div)<{ ispass: boolean; isnow: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 100px;
  background-color: ${(props) =>
    props.ispass
      ? props.theme.blue.mild
      : props.isnow
      ? props.theme.blue.accent
      : props.theme.gray.blur};
`;

const Title = styled(motion.h2)<{ ispass: boolean; isnow: boolean }>`
  color: ${(props) =>
    props.ispass
      ? props.theme.blue.mild
      : props.isnow
      ? props.theme.blue.accent
      : props.theme.gray.normal};
  font-size: ${(props) => (props.isnow ? "14px" : "12px")};
  font-weight: ${(props) => (props.isnow ? "400" : "300")};
  margin-left: -22px;
  margin-bottom: 8px;
  line-height: 14px;
`;

const circleVar = {
  initial: { scale: 0 },
  animate: { scale: 1, transition: { duration: 0.3 } },
};
