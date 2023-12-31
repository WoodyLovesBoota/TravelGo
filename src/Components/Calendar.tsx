import styled from "styled-components";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { choiceState, endDateState, startDateState } from "../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { daysSinceSpecificDate } from "../utils";

const Calendar = () => {
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [startMonth, setStartMonth] = useState(new Date().getMonth() + 1);

  const [isChoice, setIsChoice] = useRecoilState(choiceState);
  const [startDate, setStartDate] = useRecoilState(startDateState);
  const [endDate, setEndDate] = useRecoilState(endDateState);

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
      setEndDate("도착 날짜");
      setIsChoice(2);
    }
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
    <Wrapper>
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
                                startYear > new Date().getFullYear()
                                  ? false
                                  : startYear < new Date().getFullYear()
                                  ? true
                                  : startMonth > new Date().getMonth() + 1
                                  ? false
                                  : startMonth < new Date().getMonth() + 1
                                  ? true
                                  : secondMonday + (cnt - 2) * 7 + date > new Date().getDate()
                                  ? false
                                  : true
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
                              (startMonth === 12 ? startYear + 1 : startYear) >
                              new Date().getFullYear()
                                ? false
                                : (startMonth === 12 ? startYear + 1 : startYear) <
                                  new Date().getFullYear()
                                ? true
                                : (startMonth === 12 ? 1 : Number(startMonth) + 1) >
                                  new Date().getMonth() + 1
                                ? false
                                : (startMonth === 12 ? 1 : Number(startMonth) + 1) <
                                  new Date().getMonth() + 1
                                ? true
                                : secondMondayN + (cnt - 2) * 7 + date > new Date().getDate()
                                ? false
                                : true
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
    </Wrapper>
  );
};

export default Calendar;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  &:first-child {
    margin-right: 116px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  margin-bottom: 10px;
  padding: 0 13px;
  align-items: center;
`;

const DateInfo = styled.h2`
  font-size: 18px;
  font-weight: 600;
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
  height: 64px;
`;

const Days = styled.div`
  display: flex;
  height: 64px;
`;

const DayBox = styled.div`
  width: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: ${(props) => props.theme.gray.accent};
`;

const Day = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DateBox = styled.h2<{ isnow: boolean; ispass: boolean; isInside: boolean }>`
  font-size: 16px;
  font-weight: ${(props) => (props.ispass ? "400" : "500")};
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) =>
    props.isnow ? "white" : (props) => (props.ispass ? props.theme.gray.semiblur : "black")};
  background-color: ${(props) =>
    props.isnow ? props.theme.blue.accent : props.isInside ? props.theme.blue.mild : "transparent"};
  border-radius: 50px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.blue.mild};
  }
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  font-size: 16px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
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
