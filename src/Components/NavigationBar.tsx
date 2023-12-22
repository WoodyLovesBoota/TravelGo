import styled from "styled-components";

const NavigationBar = ({ now }: { now: number }) => {
  return (
    <Wrapper>
      {["기간 설정", "여행지 설정", "장소 선택", "일정 관리", "최종 여행 계획"].map((e, i) => (
        <Vortex>
          <Title ispass={i < now} isnow={i === now}>
            {e}
          </Title>
          <Contents>
            <Circle ispass={i < now} isnow={i === now} />
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
  margin-top: 60px;
`;

const Line = styled.div<{ ispass: boolean }>`
  width: 136px;
  height: 1.5px;
  background-image: linear-gradient(
    to right,
    ${(props) => (props.ispass ? "black 40%" : "black 10%")},
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

const Circle = styled.div<{ ispass: boolean; isnow: boolean }>`
  width: ${(props) => (props.isnow ? "12px" : "9px")};
  height: ${(props) => (props.isnow ? "12px" : "9px")};
  border-radius: 100px;
  background-color: ${(props) =>
    props.ispass
      ? props.theme.gray.accent
      : props.isnow
      ? props.theme.gray.accent
      : props.theme.gray.blur};
`;

const Title = styled.h2<{ ispass: boolean; isnow: boolean }>`
  color: ${(props) =>
    props.ispass ? props.theme.gray.normal : props.isnow ? "black" : props.theme.gray.semiblur};
  font-size: ${(props) => (props.isnow ? "14px" : "12px")};
  font-weight: ${(props) => (props.isnow ? "400" : "300")};
  margin-left: -22px;
  margin-bottom: 11px;
`;
