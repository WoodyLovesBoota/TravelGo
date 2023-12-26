import styled from "styled-components";
import Header from "../Components/Header";
import NavigationBar from "../Components/NavigationBar";
import Calendar from "../Components/Calendar";
import { useRecoilState } from "recoil";
import { choiceState, startDateState, endDateState, userState, tripState } from "../atoms";
import { ReactComponent as Arrow } from "../assets/arrow.svg";
import { useNavigate } from "react-router-dom";
import TravelOverview from "../Components/TravelOverview";

const Date = () => {
  const [isChoice, setIsChoice] = useRecoilState(choiceState);
  const [startDate, setStartDate] = useRecoilState(startDateState);
  const [endDate, setEndDate] = useRecoilState(endDateState);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const onButtonClick = () => {
    if (startDate !== "출발 날짜" && endDate !== "도착 날짜") {
      navigate("/city");
      setUserInfo((current) => {
        const copy = { ...current[currentTrip] };
        return { ...current, [currentTrip]: { ...copy, ["date"]: startDate + "|" + endDate } };
      });
    } else {
      alert("여행을 떠나실 날짜를 선택해주세요.");
    }
  };

  return (
    <Wrapper>
      <Header now={0} />
      <Container>
        <Overview>
          <Empty>여행을 계획해보세요!</Empty>
        </Overview>
        <Main>
          <Calendarbox>
            <Title>
              <Duration>
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
                        (
                        {
                          ["일", "월", "화", "수", "목", "금", "토"][
                            Number(startDate.split(".")[3])
                          ]
                        }
                        )
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
                        ({["일", "월", "화", "수", "목", "금", "토"][Number(endDate.split(".")[3])]}
                        )
                      </DateInfo>
                    </>
                  )}
                </End>
              </Duration>
            </Title>
            <Calendar />
          </Calendarbox>
          <Button onClick={onButtonClick}>선택</Button>
        </Main>
      </Container>
    </Wrapper>
  );
};

export default Date;

const Wrapper = styled.div`
  height: 100vh;
  padding-top: 80px;
`;

const Container = styled.div`
  display: flex;
  height: calc(100% - 80px);
`;

const Overview = styled.div`
  background-color: lightgray;
  width: 300px;
  height: 100vh;
  padding: 50px 30px;
  padding-top: 130px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
`;

const Empty = styled.h2`
  font-size: 20px;
  font-weight: 500;
`;

const Main = styled.div`
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1); */
  margin-top: 75px;
  width: 100%;
  padding-left: 300px;
  padding-bottom: 30px;
`;

const Calendarbox = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  margin-bottom: 50px;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  align-items: center;
`;

const Duration = styled.div`
  display: flex;
`;

const Button = styled.button`
  font-size: 14px;
  font-weight: 500;
  padding: 20px 100px;
  border-radius: 8px;
  background-color: blue;
  color: white;
  cursor: pointer;
  margin-top: 75px;
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
