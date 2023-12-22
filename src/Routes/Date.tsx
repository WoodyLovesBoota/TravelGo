import styled from "styled-components";
import Header from "../Components/Header";
import NavigationBar from "../Components/NavigationBar";
import Calendar from "../Components/Calendar";
import { useRecoilState } from "recoil";
import { choiceState, startDateState, endDateState } from "../atoms";
import { ReactComponent as Arrow } from "../assets/arrow.svg";

const Date = () => {
  const [isChoice, setIsChoice] = useRecoilState(choiceState);
  const [startDate, setStartDate] = useRecoilState(startDateState);
  const [endDate, setEndDate] = useRecoilState(endDateState);

  return (
    <Wrapper>
      <Header />
      <NavigationBar now={0} />
      <Main>
        <Title>
          <Start
            isnow={isChoice === 1}
            onClick={() => {
              setIsChoice(1);
            }}
          >
            {startDate === "출발 날짜" ? (
              startDate
            ) : (
              <>
                <DateInfo>{startDate.split(".")[1]}월 </DateInfo>
                <DateInfo>{startDate.split(".")[2]}일 </DateInfo>
                <DateInfo>
                  ({["일", "월", "화", "수", "목", "금", "토"][Number(startDate.split(".")[3])]})
                </DateInfo>
              </>
            )}
          </Start>
          <Divider>
            <Arrow width={14} fill={"black"} />
          </Divider>
          <End
            isnow={isChoice === 2}
            onClick={() => {
              setIsChoice(2);
            }}
          >
            {endDate === "도착 날짜" ? (
              endDate
            ) : (
              <>
                <DateInfo>{endDate.split(".")[1]}월 </DateInfo>
                <DateInfo>{endDate.split(".")[2]}일 </DateInfo>
                <DateInfo>
                  ({["일", "월", "화", "수", "목", "금", "토"][Number(endDate.split(".")[3])]})
                </DateInfo>
              </>
            )}
          </End>
        </Title>
        <Calendar />
      </Main>
    </Wrapper>
  );
};

export default Date;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Main = styled.div`
  padding: 29px 92px;
  border-radius: 20px;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  margin-top: 100px;
`;

const Title = styled.div`
  margin-bottom: 30px;
  display: flex;
`;

const Start = styled.h2<{ isnow: boolean }>`
  padding: 5px;
  border-bottom: 2px solid
    ${(props) => (props.isnow ? props.theme.blue.accent : props.theme.gray.blur)};
  width: 150px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.gray.blur};
`;

const Divider = styled.h2`
  margin: auto 15px;
`;

const End = styled.h2<{ isnow: boolean }>`
  border-bottom: 2px solid
    ${(props) => (props.isnow ? props.theme.blue.accent : props.theme.gray.blur)};
  width: 150px;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.gray.blur};
`;

const DateInfo = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: black;
  margin-right: 5px;
`;
