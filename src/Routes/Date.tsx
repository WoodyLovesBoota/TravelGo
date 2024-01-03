import styled from "styled-components";
import Header from "../Components/Header";
import Calendar from "../Components/Calendar";
import { useRecoilState } from "recoil";
import { choiceState, startDateState, endDateState, userState, tripState } from "../atoms";
import { ReactComponent as Arrow } from "../assets/arrow.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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

  useEffect(() => {
    if (userInfo[currentTrip].date === "") {
      setStartDate("출발 날짜");
      setEndDate("도착 날짜");
    } else {
      setStartDate(userInfo[currentTrip].date.split("|")[0]);
      setEndDate(userInfo[currentTrip].date.split("|")[1]);
    }
  }, [currentTrip]);

  return (
    <Wrapper>
      <Header now={0} />
      <Container>
        <Main>
          <Calendarbox>
            <Title>
              <Duration>
                {startDate === "출발 날짜" && endDate === "도착 날짜" ? (
                  <Empty>여행 기간을 선택해주세요.</Empty>
                ) : (
                  <>
                    <Start isnow={isChoice === 1}>
                      {startDate === "출발 날짜" ? (
                        ""
                      ) : (
                        <>
                          <DateInfo>{startDate.split(".")[0]}년 </DateInfo>
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
                    <End isnow={isChoice === 2}>
                      {endDate === "도착 날짜" ? (
                        ""
                      ) : (
                        <>
                          <DateInfo>{endDate.split(".")[0]}년 </DateInfo>
                          <DateInfo>{endDate.split(".")[1]}월 </DateInfo>
                          <DateInfo>{endDate.split(".")[2]}일 </DateInfo>
                          <DateInfo>
                            (
                            {
                              ["일", "월", "화", "수", "목", "금", "토"][
                                Number(endDate.split(".")[3])
                              ]
                            }
                            )
                          </DateInfo>
                        </>
                      )}
                    </End>
                  </>
                )}
              </Duration>
            </Title>
            <Calendar />
          </Calendarbox>
          {startDate === "출발 날짜" || endDate === "도착 날짜" ? (
            <NoButton>완료</NoButton>
          ) : (
            <Button onClick={onButtonClick}>완료</Button>
          )}
        </Main>
      </Container>
    </Wrapper>
  );
};

export default Date;

const Wrapper = styled.div`
  padding-top: 130px;
  padding-bottom: 50px;
  height: 100vh;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Calendarbox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto 0;
`;

const Title = styled.div`
  margin-bottom: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 50px;
  border-radius: 10px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
`;

const Duration = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Empty = styled.h2`
  font-size: 16px;
  font-weight: 400;
`;

const Button = styled.button`
  font-size: 16px;
  font-weight: 500;
  padding: 18px 105px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.blue.accent};
  color: white;
  cursor: pointer;
  margin-top: 50px;
`;

const NoButton = styled.button`
  font-size: 16px;
  font-weight: 500;
  padding: 18px 105px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.gray.button};
  color: white;
  cursor: pointer;
  margin-top: 50px;
`;

const Start = styled.h2<{ isnow: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  width: 45%;
`;

const Divider = styled.h2`
  margin: auto 0;
`;

const End = styled.h2<{ isnow: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  width: 45%;
`;

const DateInfo = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: black;
  margin-right: 5px;
`;
