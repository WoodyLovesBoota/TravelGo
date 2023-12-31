import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { IJourney, isCalendarState, tripState, userState } from "../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as Arrow } from "../assets/arrow.svg";
import { IPlaceDetail } from "../api";
import { daysSinceSpecificDate } from "../utils";

const SmallCalender = ({ destination }: { destination: IPlaceDetail | undefined }) => {
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [startMonth, setStartMonth] = useState(new Date().getMonth() + 1);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [isChoice, setIsChoice] = useState(0);
  const [startDate, setStartDate] = useState("출발 날짜");
  const [endDate, setEndDate] = useState("도착 날짜");
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [isCalendarOpen, setIsCalendarOpen] = useRecoilState(isCalendarState);
  const [isSubmit, setIsSubmit] = useState("false");

  const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];
  const firstDay = new Date(startYear, startMonth - 1, 1).getDay();
  const lastDate = new Date(startYear, startMonth, 0).getDate();
  const secondMonday = 8 - firstDay;
  const totalWeekCnt = Math.floor((lastDate - secondMonday) / 7) + 2;

  const firstDayN =
    startMonth === 12
      ? new Date(startYear + 1, 0, 1).getDay()
      : new Date(startYear, startMonth, 1).getDay();
  const lastDateN =
    startMonth === 12
      ? new Date(startYear + 1, 1, 0).getDate()
      : new Date(startYear, startMonth + 1, 0).getDate();

  const secondMondayN = 8 - firstDayN;
  const totalWeekCntN = Math.floor((lastDateN - secondMondayN) / 7) + 2;

  const prevMonth = () => {
    if (startMonth > 1) setStartMonth((current) => current - 1);
    else {
      setStartMonth(12);
      setStartYear((current) => current - 1);
    }
  };

  const nextMonth = () => {
    if (startMonth < 12) setStartMonth((current) => current + 1);
    else {
      setStartMonth(1);
      setStartYear((current) => current + 1);
    }
  };

  const handleDateClick = (info: string) => {
    if (isChoice === 1) {
      setStartDate(info);
      setIsChoice(2);
    } else if (isChoice === 2) {
      setEndDate(info);
      setIsChoice(0);
    } else if (isChoice === 0) {
      setStartDate(info);
      setIsChoice(2);
      setEndDate("도착 날짜");
    }
  };

  useEffect(() => {
    if (isSubmit === "true") {
      setUserInfo((current) => {
        const one = { ...current };
        const two = { ...one[currentTrip] };
        const three = [...two.trips];
        const index = three.findIndex((e) => e.destination?.name === destination?.name);
        const four = { ...three[index] };
        const five = { ...four.detail };
        const six = { ...five.attractions };
        let newObj: { [key: string]: (IJourney | undefined)[] } = { ["NoName"]: six["NoName"] };
        for (
          let i = 0;
          i <=
          daysSinceSpecificDate(
            [
              Number(startDate.split(".")[0]),
              Number(startDate.split(".")[1]),
              Number(startDate.split(".")[2]),
            ],
            [
              Number(endDate.split(".")[0]),
              Number(endDate.split(".")[1]),
              Number(endDate.split(".")[2]),
            ]
          );
          i++
        ) {
          newObj[i + 1 + "일차"] = [];
        }
        const newFive = { ...five, ["attractions"]: newObj };
        const newFour = { ...four, ["detail"]: newFive };
        const newThree = [...three.slice(0, index), newFour, ...three.slice(index + 1)];
        const newTwo = { ...two, ["trips"]: newThree };
        const newOne = { ...current, [currentTrip]: newTwo };

        return newOne;
      });
    }

    if (isSubmit === "true") setIsCalendarOpen(false);
  }, [isSubmit]);

  const onButtonClick = () => {
    setUserInfo((current) => {
      if (startDate === "출발 날짜" || endDate === "도착 날짜") return current;
      else {
        const one = { ...current };
        const two = { ...one[currentTrip] };
        const three = [...two.trips];
        const index = three.findIndex((e) => e.destination?.name === destination?.name);
        const four = { ...three[index] };
        const five = { ...four.detail };

        const newFive = { ...five, ["date"]: startDate + "|" + endDate };
        const newFour = { ...four, ["detail"]: newFive };
        const newThree = [...three.slice(0, index), newFour, ...three.slice(index + 1)];
        const newTwo = { ...two, ["trips"]: newThree };
        const newOne = { ...current, [currentTrip]: newTwo };

        return newOne;
      }
    });
    if (startDate === "출발 날짜" || endDate === "도착 날짜")
      alert("여행을 떠나실 날짜를 선택해주세요.");
    else {
      setIsSubmit("true");
    }
  };

  const onOverlayClick = () => {
    setIsCalendarOpen(false);
    setIsSubmit("false");
  };

  useEffect(() => {
    if (startDate !== "출발 날짜" && endDate !== "도착 날짜") {
      if (
        daysSinceSpecificDate(
          [2023, 1, 1],
          [
            Number(startDate.split(".")[0]),
            Number(startDate.split(".")[1]),
            Number(startDate.split(".")[2]),
          ]
        ) >
        daysSinceSpecificDate(
          [2023, 1, 1],
          [
            Number(endDate.split(".")[0]),
            Number(endDate.split(".")[1]),
            Number(endDate.split(".")[2]),
          ]
        )
      ) {
        let copy = startDate;
        setStartDate(endDate);
        setEndDate(copy);
      }
    }
  }, [startDate, endDate]);

  return (
    <Total>
      <Wrapper>
        <Title>
          <Duration>
            {startDate === "출발 날짜" && endDate === "도착 날짜" ? (
              <Empty>여행 기간을 선택해주세요.</Empty>
            ) : (
              <>
                <Start>
                  {startDate === "출발 날짜" ? (
                    startDate
                  ) : (
                    <>
                      <DurInfo>{startDate.split(".")[1]}월 </DurInfo>
                      <DurInfo>{startDate.split(".")[2]}일 </DurInfo>
                      <DurInfo>
                        (
                        {
                          ["일", "월", "화", "수", "목", "금", "토"][
                            Number(startDate.split(".")[3])
                          ]
                        }
                        )
                      </DurInfo>
                    </>
                  )}
                </Start>
                <Divider>
                  <Arrow width={14} fill={"black"} />
                </Divider>
                <End>
                  {endDate === "도착 날짜" ? (
                    endDate
                  ) : (
                    <>
                      <DurInfo>{endDate.split(".")[1]}월 </DurInfo>
                      <DurInfo>{endDate.split(".")[2]}일 </DurInfo>
                      <DurInfo>
                        ({["일", "월", "화", "수", "목", "금", "토"][Number(endDate.split(".")[3])]}
                        )
                      </DurInfo>
                    </>
                  )}
                </End>
              </>
            )}
          </Duration>

          <SubmitButton onClick={onButtonClick}>선택</SubmitButton>
        </Title>
        <Main>
          <Column>
            <Header>
              <Button onClick={prevMonth}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </Button>
              <DateInfo>
                {startYear}년 {startMonth < 10 ? "0" + startMonth : startMonth}월
              </DateInfo>
            </Header>
            <Container>
              <Days>
                {WEEKDAY.map((day) => (
                  <DayBox>{day}</DayBox>
                ))}
              </Days>
              {[1, 2, 3, 4, 5, 6].map((cnt) => {
                return (
                  cnt <= totalWeekCnt && (
                    <Week>
                      {[0, 1, 2, 3, 4, 5, 6].map((date) => (
                        <Day>
                          {secondMonday + (cnt - 2) * 7 + date > 0 &&
                            secondMonday + (cnt - 2) * 7 + date <= lastDate && (
                              <>
                                <DateBox
                                  onClick={() => {
                                    !(
                                      daysSinceSpecificDate(
                                        [2023, 1, 1],
                                        [startYear, startMonth, secondMonday + (cnt - 2) * 7 + date]
                                      ) <
                                        daysSinceSpecificDate(
                                          [2023, 1, 1],
                                          [
                                            Number(userInfo[currentTrip].date.split(".")[0]),
                                            Number(userInfo[currentTrip].date.split(".")[1]),
                                            Number(userInfo[currentTrip].date.split(".")[2]),
                                          ]
                                        ) ||
                                      daysSinceSpecificDate(
                                        [2023, 1, 1],
                                        [startYear, startMonth, secondMonday + (cnt - 2) * 7 + date]
                                      ) >
                                        daysSinceSpecificDate(
                                          [2023, 1, 1],
                                          [
                                            Number(
                                              userInfo[currentTrip].date.split("|")[1].split(".")[0]
                                            ),
                                            Number(
                                              userInfo[currentTrip].date.split("|")[1].split(".")[1]
                                            ),
                                            Number(
                                              userInfo[currentTrip].date.split("|")[1].split(".")[2]
                                            ),
                                          ]
                                        )
                                    ) &&
                                      handleDateClick(
                                        startYear +
                                          "." +
                                          startMonth +
                                          "." +
                                          (secondMonday + (cnt - 2) * 7 + date) +
                                          "." +
                                          date
                                      );
                                  }}
                                  isnow={
                                    daysSinceSpecificDate(
                                      [2023, 1, 1],
                                      [startYear, startMonth, secondMonday + (cnt - 2) * 7 + date]
                                    ) ===
                                      daysSinceSpecificDate(
                                        [2023, 1, 1],
                                        [
                                          Number(endDate.split(".")[0]),
                                          Number(endDate.split(".")[1]),
                                          Number(endDate.split(".")[2]),
                                        ]
                                      ) ||
                                    daysSinceSpecificDate(
                                      [2023, 1, 1],
                                      [startYear, startMonth, secondMonday + (cnt - 2) * 7 + date]
                                    ) ===
                                      daysSinceSpecificDate(
                                        [2023, 1, 1],
                                        [
                                          Number(startDate.split(".")[0]),
                                          Number(startDate.split(".")[1]),
                                          Number(startDate.split(".")[2]),
                                        ]
                                      )
                                  }
                                  ispass={
                                    daysSinceSpecificDate(
                                      [2023, 1, 1],
                                      [startYear, startMonth, secondMonday + (cnt - 2) * 7 + date]
                                    ) <
                                      daysSinceSpecificDate(
                                        [2023, 1, 1],
                                        [
                                          Number(userInfo[currentTrip].date.split(".")[0]),
                                          Number(userInfo[currentTrip].date.split(".")[1]),
                                          Number(userInfo[currentTrip].date.split(".")[2]),
                                        ]
                                      ) ||
                                    daysSinceSpecificDate(
                                      [2023, 1, 1],
                                      [startYear, startMonth, secondMonday + (cnt - 2) * 7 + date]
                                    ) >
                                      daysSinceSpecificDate(
                                        [2023, 1, 1],
                                        [
                                          Number(
                                            userInfo[currentTrip].date.split("|")[1].split(".")[0]
                                          ),
                                          Number(
                                            userInfo[currentTrip].date.split("|")[1].split(".")[1]
                                          ),
                                          Number(
                                            userInfo[currentTrip].date.split("|")[1].split(".")[2]
                                          ),
                                        ]
                                      )
                                  }
                                  isInside={
                                    daysSinceSpecificDate(
                                      [2023, 1, 1],
                                      [startYear, startMonth, secondMonday + (cnt - 2) * 7 + date]
                                    ) <=
                                      daysSinceSpecificDate(
                                        [2023, 1, 1],
                                        [
                                          Number(endDate.split(".")[0]),
                                          Number(endDate.split(".")[1]),
                                          Number(endDate.split(".")[2]),
                                        ]
                                      ) &&
                                    daysSinceSpecificDate(
                                      [2023, 1, 1],
                                      [startYear, startMonth, secondMonday + (cnt - 2) * 7 + date]
                                    ) >=
                                      daysSinceSpecificDate(
                                        [2023, 1, 1],
                                        [
                                          Number(startDate.split(".")[0]),
                                          Number(startDate.split(".")[1]),
                                          Number(startDate.split(".")[2]),
                                        ]
                                      )
                                  }
                                >
                                  {secondMonday + (cnt - 2) * 7 + date}
                                </DateBox>
                              </>
                            )}
                        </Day>
                      ))}
                    </Week>
                  )
                );
              })}
            </Container>
          </Column>
          <Column>
            <Header>
              <DateInfo>
                {startMonth === 12 ? startYear + 1 : startYear}년{" "}
                {startMonth === 12
                  ? "01"
                  : Number(startMonth) + 1 < 10
                  ? "0" + (Number(startMonth) + 1)
                  : Number(startMonth) + 1}
                월
              </DateInfo>
              <Button onClick={nextMonth}>
                <FontAwesomeIcon icon={faAngleRight} />
              </Button>
            </Header>
            <Container>
              <Days>
                {WEEKDAY.map((day) => (
                  <DayBox>{day}</DayBox>
                ))}
              </Days>
              {[1, 2, 3, 4, 5, 6].map((cnt) => {
                return (
                  cnt <= totalWeekCntN && (
                    <Week>
                      {[0, 1, 2, 3, 4, 5, 6].map((date) => (
                        <Day>
                          {secondMondayN + (cnt - 2) * 7 + date > 0 &&
                            secondMondayN + (cnt - 2) * 7 + date <= lastDateN && (
                              <DateBox
                                onClick={() => {
                                  !(
                                    daysSinceSpecificDate(
                                      [2023, 1, 1],
                                      [
                                        startMonth === 12 ? startYear + 1 : startYear,
                                        startMonth === 12 ? 1 : Number(startMonth) + 1,
                                        secondMondayN + (cnt - 2) * 7 + date,
                                      ]
                                    ) <
                                      daysSinceSpecificDate(
                                        [2023, 1, 1],
                                        [
                                          Number(userInfo[currentTrip].date.split(".")[0]),
                                          Number(userInfo[currentTrip].date.split(".")[1]),
                                          Number(userInfo[currentTrip].date.split(".")[2]),
                                        ]
                                      ) ||
                                    daysSinceSpecificDate(
                                      [2023, 1, 1],
                                      [
                                        startMonth === 12 ? startYear + 1 : startYear,
                                        startMonth === 12 ? 1 : Number(startMonth) + 1,
                                        secondMondayN + (cnt - 2) * 7 + date,
                                      ]
                                    ) >
                                      daysSinceSpecificDate(
                                        [2023, 1, 1],
                                        [
                                          Number(
                                            userInfo[currentTrip].date.split("|")[1].split(".")[0]
                                          ),
                                          Number(
                                            userInfo[currentTrip].date.split("|")[1].split(".")[1]
                                          ),
                                          Number(
                                            userInfo[currentTrip].date.split("|")[1].split(".")[2]
                                          ),
                                        ]
                                      )
                                  ) &&
                                    handleDateClick(
                                      (startMonth === 12 ? startYear + 1 : startYear) +
                                        "." +
                                        (startMonth === 12 ? 1 : Number(startMonth) + 1) +
                                        "." +
                                        (secondMondayN + (cnt - 2) * 7 + date) +
                                        "." +
                                        date
                                    );
                                }}
                                isnow={
                                  daysSinceSpecificDate(
                                    [2023, 1, 1],
                                    [
                                      startMonth === 12 ? startYear + 1 : startYear,
                                      startMonth === 12 ? 1 : Number(startMonth) + 1,
                                      secondMondayN + (cnt - 2) * 7 + date,
                                    ]
                                  ) ===
                                    daysSinceSpecificDate(
                                      [2023, 1, 1],
                                      [
                                        Number(startDate.split(".")[0]),
                                        Number(startDate.split(".")[1]),
                                        Number(startDate.split(".")[2]),
                                      ]
                                    ) ||
                                  daysSinceSpecificDate(
                                    [2023, 1, 1],
                                    [
                                      startMonth === 12 ? startYear + 1 : startYear,
                                      startMonth === 12 ? 1 : Number(startMonth) + 1,
                                      secondMondayN + (cnt - 2) * 7 + date,
                                    ]
                                  ) ===
                                    daysSinceSpecificDate(
                                      [2023, 1, 1],
                                      [
                                        Number(endDate.split(".")[0]),
                                        Number(endDate.split(".")[1]),
                                        Number(endDate.split(".")[2]),
                                      ]
                                    )
                                }
                                ispass={
                                  daysSinceSpecificDate(
                                    [2023, 1, 1],
                                    [
                                      startMonth === 12 ? startYear + 1 : startYear,
                                      startMonth === 12 ? 1 : Number(startMonth) + 1,
                                      secondMondayN + (cnt - 2) * 7 + date,
                                    ]
                                  ) <
                                    daysSinceSpecificDate(
                                      [2023, 1, 1],
                                      [
                                        Number(userInfo[currentTrip].date.split(".")[0]),
                                        Number(userInfo[currentTrip].date.split(".")[1]),
                                        Number(userInfo[currentTrip].date.split(".")[2]),
                                      ]
                                    ) ||
                                  daysSinceSpecificDate(
                                    [2023, 1, 1],
                                    [
                                      startMonth === 12 ? startYear + 1 : startYear,
                                      startMonth === 12 ? 1 : Number(startMonth) + 1,
                                      secondMondayN + (cnt - 2) * 7 + date,
                                    ]
                                  ) >
                                    daysSinceSpecificDate(
                                      [2023, 1, 1],
                                      [
                                        Number(
                                          userInfo[currentTrip].date.split("|")[1].split(".")[0]
                                        ),
                                        Number(
                                          userInfo[currentTrip].date.split("|")[1].split(".")[1]
                                        ),
                                        Number(
                                          userInfo[currentTrip].date.split("|")[1].split(".")[2]
                                        ),
                                      ]
                                    )
                                }
                                isInside={
                                  (daysSinceSpecificDate(
                                    [2023, 1, 1],
                                    [
                                      startMonth === 12 ? startYear + 1 : startYear,
                                      startMonth === 12 ? 1 : Number(startMonth) + 1,
                                      secondMondayN + (cnt - 2) * 7 + date,
                                    ]
                                  ) <=
                                    daysSinceSpecificDate(
                                      [2023, 1, 1],
                                      [
                                        Number(endDate.split(".")[0]),
                                        Number(endDate.split(".")[1]),
                                        Number(endDate.split(".")[2]),
                                      ]
                                    ) &&
                                    daysSinceSpecificDate(
                                      [2023, 1, 1],
                                      [
                                        startMonth === 12 ? startYear + 1 : startYear,
                                        startMonth === 12 ? 1 : Number(startMonth) + 1,
                                        secondMondayN + (cnt - 2) * 7 + date,
                                      ]
                                    ) >=
                                      daysSinceSpecificDate(
                                        [2023, 1, 1],
                                        [
                                          Number(startDate.split(".")[0]),
                                          Number(startDate.split(".")[1]),
                                          Number(startDate.split(".")[2]),
                                        ]
                                      )) ||
                                  daysSinceSpecificDate(
                                    [2023, 1, 1],
                                    [
                                      startMonth === 12 ? startYear + 1 : startYear,
                                      startMonth === 12 ? 1 : Number(startMonth) + 1,
                                      secondMondayN + (cnt - 2) * 7 + date,
                                    ]
                                  ) ===
                                    daysSinceSpecificDate(
                                      [2023, 1, 1],
                                      [
                                        Number(startDate.split(".")[0]),
                                        Number(startDate.split(".")[1]),
                                        Number(startDate.split(".")[2]),
                                      ]
                                    ) ||
                                  daysSinceSpecificDate(
                                    [2023, 1, 1],
                                    [
                                      startMonth === 12 ? startYear + 1 : startYear,
                                      startMonth === 12 ? 1 : Number(startMonth) + 1,
                                      secondMondayN + (cnt - 2) * 7 + date,
                                    ]
                                  ) ===
                                    daysSinceSpecificDate(
                                      [2023, 1, 1],
                                      [
                                        Number(endDate.split(".")[0]),
                                        Number(endDate.split(".")[1]),
                                        Number(endDate.split(".")[2]),
                                      ]
                                    )
                                }
                              >
                                {secondMondayN + (cnt - 2) * 7 + date}
                              </DateBox>
                            )}
                        </Day>
                      ))}
                    </Week>
                  )
                );
              })}
            </Container>
          </Column>
        </Main>
      </Wrapper>
      <Overlay onClick={onOverlayClick} />
    </Total>
  );
};

export default SmallCalender;

const Total = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 4;
  width: 100vw;
  height: 100vh;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  width: 100vw;
  height: 100vh;
`;

const Wrapper = styled.div`
  z-index: 3;
  background-color: white;
  padding: 50px;
  min-height: 55vh;
  border-radius: 10px;
`;

const Main = styled.div`
  display: flex;
  justify-content: center;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  &:first-child {
    margin-right: 40px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  margin-bottom: 20px;
  padding: 0 13px;
  align-items: center;
`;

const DateInfo = styled.h2`
  font-size: 16px;
  font-weight: 500;
  &:first-child {
    margin-left: auto;
  }
  &:last-child {
    margin-right: auto;
  }
`;

const Week = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
`;

const Days = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
`;

const DayBox = styled.div`
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
`;

const Day = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DateBox = styled.h2<{ isnow: boolean; ispass: boolean; isInside: boolean }>`
  font-size: 14px;
  font-weight: 400;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) =>
    props.isnow ? "white" : (props) => (props.ispass ? props.theme.gray.semiblur : "black")};
  background-color: ${(props) =>
    props.isnow ? props.theme.blue.accent : props.isInside ? props.theme.blue.mild : "transparent"};
  border-radius: 50px;
  cursor: pointer;
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  font-size: 14px;
  color: ${(props) => props.theme.blue.accent + "60"};
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 100px;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
  &:hover {
    color: ${(props) => props.theme.blue.accent};
  }
  &:first-child {
    margin-right: auto;
  }
  &:last-child {
    margin-left: auto;
  }
`;

const Title = styled.div`
  margin-bottom: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Duration = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  width: 500px;
  height: 50px;
  border-radius: 10px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
`;

const Empty = styled.h2`
  font-size: 16px;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.gray.normal};
`;

const Start = styled.h2`
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

const End = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  width: 45%;
`;

const DurInfo = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: black;
  margin-right: 5px;
`;

const SubmitButton = styled.button`
  font-size: 14px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 8px;
  height: 50px;
  background-color: ${(props) => props.theme.blue.accent};
  color: white;
  cursor: pointer;
`;
