import styled from "styled-components";
import { ITripDetails } from "../atoms";
import { useState } from "react";

const SmallCalender = ({ destinations }: ISmallCalenderProps) => {
  const destNames = destinations.map((info) => {
    return { name: info.destination?.name, date: info.detail.date };
  });

  const [startYear, setStartYear] = useState(
    Number(destNames[0].date.split("|")[0].split("-")[0])
  );
  const [startMonth, setStartMonth] = useState(
    Number(destNames[0].date.split("|")[0].split("-")[1])
  );

  const WEEKDAY = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const firstDay = new Date(startYear, startMonth - 1, 1).getDay();
  const lastDate = new Date(startYear, startMonth, 0).getDate();
  const secondMonday = 8 - firstDay;
  const totalWeekCnt = Math.floor((lastDate - secondMonday) / 7) + 2;

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
  return (
    <Wrapper>
      <Header>
        <Button onClick={prevMonth}>{`<`}</Button>
        <Button onClick={nextMonth}>{`>`}</Button>
        <DateInfo>
          {startYear}. {startMonth < 10 ? "0" + startMonth : startMonth}.
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
                          <DateBox>
                            {secondMonday + (cnt - 2) * 7 + date}
                          </DateBox>
                          {destNames.map((single) =>
                            Number(
                              single.date.split("|")[0].split("-").join("")
                            ) ===
                            Number(
                              String(startYear) +
                                String(
                                  startMonth < 10
                                    ? "0" + startMonth
                                    : startMonth
                                ) +
                                String(
                                  secondMonday + (cnt - 2) * 7 + date < 10
                                    ? "0" +
                                        String(
                                          secondMonday + (cnt - 2) * 7 + date
                                        )
                                    : secondMonday + (cnt - 2) * 7 + date
                                )
                            ) ? (
                              <StartBar>{single.name}</StartBar>
                            ) : Number(
                                single.date.split("|")[1].split("-").join("")
                              ) ===
                              Number(
                                String(startYear) +
                                  String(
                                    startMonth < 10
                                      ? "0" + startMonth
                                      : startMonth
                                  ) +
                                  String(
                                    secondMonday + (cnt - 2) * 7 + date < 10
                                      ? "0" +
                                          String(
                                            secondMonday + (cnt - 2) * 7 + date
                                          )
                                      : secondMonday + (cnt - 2) * 7 + date
                                  )
                              ) ? (
                              <EndBar />
                            ) : Number(
                                single.date.split("|")[0].split("-").join("")
                              ) <
                                Number(
                                  String(startYear) +
                                    String(
                                      startMonth < 10
                                        ? "0" + startMonth
                                        : startMonth
                                    ) +
                                    String(
                                      secondMonday + (cnt - 2) * 7 + date < 10
                                        ? "0" +
                                            String(
                                              secondMonday +
                                                (cnt - 2) * 7 +
                                                date
                                            )
                                        : secondMonday + (cnt - 2) * 7 + date
                                    )
                                ) &&
                              Number(
                                single.date.split("|")[1].split("-").join("")
                              ) >
                                Number(
                                  String(startYear) +
                                    String(
                                      startMonth < 10
                                        ? "0" + startMonth
                                        : startMonth
                                    ) +
                                    String(
                                      secondMonday + (cnt - 2) * 7 + date < 10
                                        ? "0" +
                                            String(
                                              secondMonday +
                                                (cnt - 2) * 7 +
                                                date
                                            )
                                        : secondMonday + (cnt - 2) * 7 + date
                                    )
                                ) ? (
                              <Bar />
                            ) : null
                          )}
                        </>
                      )}
                  </Day>
                ))}
              </Week>
            )
          );
        })}
      </Container>
    </Wrapper>
  );
};

export default SmallCalender;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-top: 2px solid ${(props) => props.theme.main.hlbg};
  border-left: 2px solid ${(props) => props.theme.main.hlbg};
`;

const Header = styled.div`
  display: flex;
`;

const DateInfo = styled.h2`
  margin-left: auto;
  font-size: 20px;
  font-weight: 600;
`;

const Week = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
`;

const Days = styled.div`
  display: flex;
  width: 100%;
  height: 25px;
`;

const DayBox = styled.div`
  width: 14.285%;
  border-right: 2px solid ${(props) => props.theme.main.hlbg};
  border-bottom: 2px solid ${(props) => props.theme.main.hlbg};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  background-color: ${(props) => props.theme.main.normal};
  color: white;
  &:first-child {
    color: ${(props) => props.theme.red.normal};
  }
  &:last-child {
    color: ${(props) => props.theme.blue.normal};
  }
`;

const Day = styled.div`
  width: 14.285%;
  position: relative;
  border-right: 2px solid ${(props) => props.theme.main.hlbg};
  border-bottom: 2px solid ${(props) => props.theme.main.hlbg};
  font-size: 14px;
  font-weight: 600;
  padding-top: 5px;
`;

const DateBox = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Bar = styled.div`
  background-color: ${(props) => props.theme.main.accent};
  width: 110%;
  height: 20px;
  position: absolute;
  top: 40%;
  left: -5%;
`;

const StartBar = styled.div`
  background-color: ${(props) => props.theme.main.accent};
  width: 55%;
  height: 20px;
  position: absolute;
  right: -5%;
  top: 40%;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.55vw;
  color: white;
  padding-left: 3px;
`;

const EndBar = styled.div`
  background-color: ${(props) => props.theme.main.accent};
  width: 40%;
  height: 20px;
  position: absolute;
  left: 0;
  top: 40%;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  font-size: 20px;
  font-weight: 400;
  color: gray;
  cursor: pointer;
`;

interface ISmallCalenderProps {
  destinations: ITripDetails[];
}
