import styled from "styled-components";
import Header from "../Components/Header";
import City from "./City";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const cities = [
    "런던 영국",
    "다낭 베트남",
    "두바이 아랍에미리트공화국",
    "제주도 대한민국",
    "로마 이탈리아",
    "홍콩 홍콩",
  ];
  const images = [
    "/background/London.jpg",
    "/background/Danang.jpg",
    "/background/Dubai.jpg",
    "/background/Jeju.jpg",
    "/background/Rome.jpg",
    "/background/HongKong.jpg",
  ];

  const navigate = useNavigate();

  return (
    <>
      <Wrapper>
        <Header now={-1} />
        <Container>
          <Contents>
            <Title>당신을 위한 여행 플래너</Title>
            <SubTitle>고민만 하던 여행 계획, 트래블고로 손쉽게 짜보세요.</SubTitle>
          </Contents>
          <Button
            onClick={() => {
              navigate("/date");
            }}
          >
            여행 계획 짜기
          </Button>
        </Container>
      </Wrapper>
      <Main>
        <MainTitle>추천 도시</MainTitle>
        <CityList>
          {cities.map((e, i) => (
            <CityCard>
              <CityPhoto bgphoto={images[i]} />
              <CityContent>
                <CityTitle>{e.split(" ")[0]}</CityTitle>
                <CitySubTitle>{e.split(" ")[1]}</CitySubTitle>
              </CityContent>
            </CityCard>
          ))}
        </CityList>
      </Main>
      <Footer>
        <FooterTitleRow>
          <Logo>YTW.</Logo>
          <RestTitleContent>ABOUT</RestTitleContent>
          <RestTitleContent>WORK</RestTitleContent>
          <RestTitleContent>LINK</RestTitleContent>
        </FooterTitleRow>
        <FooterMainRow>
          <FirstContent>woodylovesboota@gmail.com</FirstContent>
          <RestContent href="https://github.com/WoodyLovesBoota/TravelGo" target="_blank">
            View Code
          </RestContent>
          <RestContent href="https://woodylovesboota.xyz/" target="_blank">
            Portfolio
          </RestContent>
          <RestContent target="_blank" href="https://www.instagram.com/tttaeook/">
            Instagram
          </RestContent>
        </FooterMainRow>
        <FooterMainRow>
          <FirstContent>010-2363-7164</FirstContent>
          <RestContent></RestContent>
          <RestContent target="_blank" href="https://github.com/WoodyLovesBoota">
            Github
          </RestContent>
          <RestContent target="_blank" href="https://www.linkedin.com/in/tae-wook-yang-6762092a2/">
            LinkedIn
          </RestContent>
        </FooterMainRow>
        <FooterMainRow>
          <FirstContent></FirstContent>
          <RestContent></RestContent>
          <RestContent target="_blank" href="https://velog.io/@woodylovescoding">
            Personal Blog
          </RestContent>
          <RestContent></RestContent>
        </FooterMainRow>
        <FooterMainRow>
          <FirstContent>@ 2023 YangTaeWook All Rights Reserved.</FirstContent>
          <RestContent></RestContent>
          <RestContent></RestContent>
          <RestContent></RestContent>
        </FooterMainRow>
      </Footer>
    </>
  );
};

export default Home;

const Wrapper = styled.div`
  background: url("/background/NewYork.jpg");
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center center;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const Container = styled.div`
  margin-top: auto;
  padding: 150px 216px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Contents = styled.div``;

const Title = styled.div`
  color: white;
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 36px;
`;

const SubTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: white;
`;

const Button = styled.button`
  background-color: white;
  color: ${(props) => props.theme.blue.accent};
  width: 244px;
  height: 72px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  font-size: 20px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
`;

const Main = styled.div`
  background-color: white;
  padding: 100px 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
`;

const MainTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 32px;
  font-weight: 500;
`;

const CityList = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  justify-content: center;
`;

const CityCard = styled.div`
  width: 344px;
  height: 344px;
  border-radius: 8px;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.1);
  margin: 20px;
`;

const CityPhoto = styled.div<{ bgphoto: string }>`
  background: url(${(props) => props.bgphoto});
  background-position: center;
  background-size: cover;
  width: 344px;
  height: 264px;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
`;

const CityContent = styled.div`
  width: 100%;
  height: 80px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CityTitle = styled.h2`
  font-weight: 400;
  font-size: 16px;
  margin-bottom: 4px;
`;

const CitySubTitle = styled.h2`
  font-size: 14px;
  font-weight: 300;
  color: ${(props) => props.theme.gray.normal};
`;

const Footer = styled.div`
  background-color: ${(props) => props.theme.gray.bg};
  padding: 50px 216px;
`;

const FooterTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const FirstContent = styled.h1`
  width: 375px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  font-family: "Helvetica Neue", sans-serif;
`;

const Logo = styled.h1`
  width: 375px;
  font-size: 24px;
  font-weight: 400;
  font-family: "Archivo Black";
`;

const RestTitleContent = styled.h2`
  width: 216px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  font-family: "Helvetica Neue", sans-serif;
`;

const RestContent = styled.a`
  width: 216px;
  text-align: left;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  font-family: "Helvetica Neue", sans-serif;
  cursor: pointer;
`;

const FooterMainRow = styled.div`
  display: flex;
  justify-content: space-between;
`;
