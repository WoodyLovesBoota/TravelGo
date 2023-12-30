import styled from "styled-components";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { tripState, userState } from "../atoms";

const Home = () => {
  const [currentTrip, setCurrentTrip] = useRecoilState(tripState);
  const [userInfo, setUserInfo] = useRecoilState(userState);

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

  const cityData = [
    {
      formatted_address: "영국 런던",
      geometry: {
        location: { lat: 51.5072178, lng: -0.1275862 },
        viewport: {
          northeast: { lat: 51.67234324898703, lng: 0.1482710335611201 },
          southwest: { lat: 51.38494012429096, lng: -0.3514683384218145 },
        },
      },
      name: "런던",
      photos: [
        {
          height: 1377,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/113518051088109061519">V P creation</a>',
          ],
          photo_reference:
            "AWU5eFjuoLrf5CnBKayvIUvz92RZk1w77_fLIgPmfFTRSaP5hW6Gqlb5XrmPSlpCYdpszd6b5dn-z1aHmFjhr6k6JNOWSjznMlY4CSuI9Wnz5v6_JgqlT5RYnmgpfdrRfHkVQMQ0HqGLiGYyeerHMVpqCUDS5gsDvq19gLa57-2FaryNAJJQ",
          width: 1080,
        },
      ],
      international_phone_number: "",
      rating: 0,
      editorial_summary: { overview: "" },
      reviews: { rating: 0, text: "", relative_time_description: "", author_name: "" },
      place_id: "",
    },
    {
      formatted_address: "베트남 다낭 하이쩌우 군 다낭",
      geometry: {
        location: {
          lat: 16.0544068,
          lng: 108.2021667,
        },
        viewport: {
          northeast: {
            lat: 16.09513447373474,
            lng: 108.2354164821088,
          },
          southwest: {
            lat: 15.99920298334486,
            lng: 108.1779956489773,
          },
        },
      },
      name: "다낭",
      photos: [
        {
          height: 449,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/109694458398346260590">Thịnh Phát Media</a>',
          ],
          photo_reference:
            "AWU5eFhpeHJ6uLjEco03Cmzn8QV1QyVZqycHn6ceBhQqzKgvIoJyvs55uvnaUW0PLkv7gjO0t-uPX2VFv2SIdM48C8r6ctE6h3hkPsSsadTZPpdhum5qFWNIcWTDgtUc1l5zonLCYx3XuyZOxgTNN0TmPnBMFlpQjZ2rC8dfklDl6klMvDFa",
          width: 800,
        },
      ],
      international_phone_number: "",
      rating: 0,
      editorial_summary: { overview: "" },
      reviews: { rating: 0, text: "", relative_time_description: "", author_name: "" },
      place_id: "",
    },
    {
      formatted_address: "아랍에미리트 두바이",
      geometry: {
        location: {
          lat: 25.2048493,
          lng: 55.2707828,
        },
        viewport: {
          northeast: {
            lat: 25.35856066265986,
            lng: 55.56452157241026,
          },
          southwest: {
            lat: 24.79348418590246,
            lng: 54.89045432509004,
          },
        },
      },
      name: "두바이",
      photos: [
        {
          height: 715,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/105720947735363972437">AMIT</a>',
          ],
          photo_reference:
            "AWU5eFhH2Rea4QcpwTVQrmqSQK7vwn4KM5wpG1p_gK_pVdSojupJFv08Hsq_3TmUCyHbzZT96_x6r2-JauqCu7FPvwZInitfWoPxReH1vNUtj7LuVwg7A668WfOaL5Sj9Qj_x9tPYjbA0pMjI_tO1FNGbwbyVZWcw89YsRFyGgtLVJW9pUDQ",
          width: 720,
        },
      ],
      international_phone_number: "",
      rating: 0,
      editorial_summary: { overview: "" },
      reviews: { rating: 0, text: "", relative_time_description: "", author_name: "" },
      place_id: "",
    },
    {
      formatted_address: "대한민국 제주특별자치도 제주시",
      geometry: {
        location: {
          lat: 33.4996213,
          lng: 126.5311884,
        },
        viewport: {
          northeast: {
            lat: 34.01320165731334,
            lng: 126.9704282702537,
          },
          southwest: {
            lat: 33.2729633892818,
            lng: 126.1441159549812,
          },
        },
      },
      name: "제주시",
      photos: [
        {
          height: 1908,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/113658997457027346559">Youngsoo Oh</a>',
          ],
          photo_reference:
            "AWU5eFhYu4K_sWZZPH5_cjPw3FpVu2CLTvngjd4IzMaQDm8VYYDAi6HM719IHP1vFH_pIIhRyz4M-c1Rh9LR466uf-M9mr08tY_VZLpf6lnhhSFfcuEaR148e6opGQEsczYV-mDhU3_zwdGGwm2C_FhuaiydfXlRd5-d8v_nyo5qTdKOhqC_",
          width: 4032,
        },
      ],
      international_phone_number: "",
      rating: 0,
      editorial_summary: { overview: "" },
      reviews: { rating: 0, text: "", relative_time_description: "", author_name: "" },
      place_id: "",
    },
    {
      formatted_address: "이탈리아 로마",
      geometry: {
        location: {
          lat: 41.9027835,
          lng: 12.4963655,
        },
        viewport: {
          northeast: {
            lat: 42.05054624539585,
            lng: 12.73028878823088,
          },
          southwest: {
            lat: 41.76959604595655,
            lng: 12.34170704408109,
          },
        },
      },
      name: "로마",
      photos: [
        {
          height: 1536,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/115231549331021169860">Francisco Gallego</a>',
          ],
          photo_reference:
            "AWU5eFjERz4b6a0lHlZSSRJr0IHIvhY9Cu0-FWiF5PCmmV5ehRjgZsgj-07ikyu4s-4jBI0cew4UXeDuy7Mf9Cyb4f2qb1RC4-2Ybuv-NwEvNnEd35Z7pSqnyE3EZXE9aCWcd2sYZbHO0AVAJoKQrhBCYJA7XkioOLwBDG_g1NO0ILe76EVt",
          width: 2048,
        },
      ],
      international_phone_number: "",
      rating: 0,
      editorial_summary: { overview: "" },
      reviews: { rating: 0, text: "", relative_time_description: "", author_name: "" },
      place_id: "",
    },
    {
      formatted_address: "홍콩",
      geometry: {
        location: {
          lat: 22.3193039,
          lng: 114.1693611,
        },
        viewport: {
          northeast: {
            lat: 22.56194850129329,
            lng: 114.452899926778,
          },
          southwest: {
            lat: 22.14349997657862,
            lng: 113.8259000633773,
          },
        },
      },
      name: "홍콩",
      photos: [
        {
          height: 6936,
          html_attributions: [
            '<a href="https://maps.google.com/maps/contrib/106519355418131367589">Bhupendra Rathore</a>',
          ],
          photo_reference:
            "AWU5eFjqrnBS4drb3exXHHcRJcwm-k1su1dbsB_ZLsDmcnsEwr9VLeYcl26OdeDtX9k6hehetjnoVH6PIZnnLmHDb6WyhJEOfCLhwDckJyb9jVaI7MKaGVWHazely1x7s9Tvf7tAlr3IYFSkUkcf1_1pwo7JVThNsN-NdnPxpF77VWHzYrqY",
          width: 9248,
        },
      ],
      international_phone_number: "",
      rating: 0,
      editorial_summary: { overview: "" },
      reviews: { rating: 0, text: "", relative_time_description: "", author_name: "" },
      place_id: "",
    },
  ];

  const navigate = useNavigate();

  const onRecommendClick = (ind: number) => {
    let target = "Trip" + Math.floor(Math.random() * 10000);
    setCurrentTrip(target);
    setUserInfo((current) => {
      return {
        ...current,
        [target]: {
          date: "",
          trips: [
            {
              destination: cityData[ind],
              detail: {
                date: 0 + "|" + 0,
                attractions: { NoName: [] },
                hotels: [],
                wtm: [],
              },
            },
          ],
        },
      };
    });
    navigate("/date");
  };

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
              let target = "Trip" + Math.floor(Math.random() * 10000);
              setCurrentTrip(target);
              setUserInfo((current) => {
                return { ...current, [target]: { date: "", trips: [] } };
              });
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
            <CityCard
              onClick={() => {
                onRecommendClick(i);
              }}
            >
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
  font-size: 18px;
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
  cursor: pointer;
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
