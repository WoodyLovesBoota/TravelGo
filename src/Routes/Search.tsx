import { useQuery } from "react-query";
import { IGetPlaceResult, getPlaceResult, IGetPlaceDetailResult, getPlaceDetailResult } from "../api";
import styled from "styled-components";
import { motion } from "framer-motion";
import { makeImagePath } from "../utils";
import { useRecoilState, useRecoilValue } from "recoil";
import { playerState, userState, tripState } from "../atoms";
import GoogleMap from "../Components/GoogleMap";
import { useState } from "react";
import { useLocation, Link, PathMatch, useMatch, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Search = () => {
  const location = useLocation();
  const destination = new URLSearchParams(location.search).get("destination");
  const navigate = useNavigate();
  const [clickedImage, setClickedImage] = useState("");
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const player = useRecoilValue(playerState);
  const currentTrip = useRecoilValue(tripState);
  const { register, handleSubmit } = useForm<IDateForm>();

  const destinationMatch: PathMatch<string> | null = useMatch("/search/:title");

  const { data: destinationData, isLoading: isDestinationLoading } = useQuery<IGetPlaceResult>(
    ["getDestination", destination],
    () => getPlaceResult(destination || "")
  );

  const { data: detailData, isLoading: isDetailLoading } = useQuery<IGetPlaceDetailResult>(
    ["getPlaceDetail", destinationData],
    () => getPlaceDetailResult(destinationData?.candidates[0].place_id),
    { enabled: !!destinationData }
  );

  const onYesClicked = () => {};

  const onNoClicked = () => {
    navigate(`/destination/${currentTrip}`);
  };

  const onValid = ({ start, end }: IDateForm) => {
    setUserInfo((current) => {
      if (destinationMatch && destinationMatch?.params.title) {
        const userCopy = { ...current[player.email] };
        const copy = { ...current[player.email].trips };
        const target = copy[destinationMatch?.params.title];

        const temp = [
          ...target,
          {
            destination: detailData?.result,
            detail: {
              date: start + "|" + end,
              attractions: { NoName: [] },
              hotels: [],
              wtm: [],
            },
          },
        ];
        temp.sort((a, b) => {
          return (
            Number(a.detail.date.split("|")[0].split("-").join("")) -
            Number(b.detail.date.split("|")[0].split("-").join(""))
          );
        });
        const last = { ...copy, [destinationMatch?.params.title]: temp };
        const targetTrip = { ...userCopy, ["trips"]: last };
        return { ...current, [player.email]: targetTrip };
      } else {
        return { ...current };
      }
    });
    navigate(`/destination/${currentTrip}`);
  };

  return (
    <Wrapper>
      {isDestinationLoading || isDetailLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        destinationMatch && (
          <Container
            variants={loadingVar}
            initial={"initial"}
            animate="animate"
            bgPhoto={makeImagePath(
              clickedImage === ""
                ? detailData?.result?.photos
                  ? detailData?.result?.photos[0]?.photo_reference
                  : ""
                : clickedImage,
              800
            )}
          >
            <Card
              bgPhoto={makeImagePath(
                clickedImage === ""
                  ? detailData?.result?.photos
                    ? detailData?.result?.photos[0]?.photo_reference
                    : ""
                  : clickedImage,
                800
              )}
            >
              <Images>
                {detailData?.result?.photos &&
                  detailData?.result?.photos.map(
                    (img, i) =>
                      i < 8 && (
                        <Image
                          bgPhoto={makeImagePath(img.photo_reference, 500)}
                          onClick={() => {
                            img.photo_reference && setClickedImage(img.photo_reference);
                          }}
                        />
                      )
                  )}
              </Images>
              <GoogleMap
                destination={destinationData?.candidates[0]?.formatted_address}
                width="50%"
                height="90%"
                zoom={11}
              />
              <Column>
                <DestinationInfo>
                  <CardTitle>{destinationData?.candidates[0]?.name}</CardTitle>
                </DestinationInfo>
                <Form onSubmit={handleSubmit(onValid)}>
                  <DateBox>
                    <InputTitle>Departure date</InputTitle>
                    <DateInput
                      {...register("start", { required: true })}
                      type="date"
                      data-placeholder="날짜 선택"
                      aria-required="true"
                    />
                  </DateBox>
                  <DateBox>
                    <InputTitle>Arrival date</InputTitle>
                    <DateInput
                      {...register("end", { required: true })}
                      type="date"
                      data-placeholder="날짜 선택"
                      aria-required="true"
                    />
                  </DateBox>
                  <Selection>
                    <Question>목적지를 추가할까요?</Question>
                    <Buttons>
                      <Button variants={buttonVar} whileHover={"hover"} onClick={onNoClicked}>
                        아니오
                      </Button>
                      <Button variants={buttonVar} whileHover={"hover"} type="submit" onClick={onYesClicked}>
                        네
                      </Button>
                    </Buttons>
                  </Selection>
                </Form>
              </Column>
            </Card>
          </Container>
        )
      )}
    </Wrapper>
  );
};

export default Search;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  font-weight: 500;
`;

const Form = styled.form`
  width: 100%;
`;

const DateBox = styled.div`
  width: 100%;
  margin-bottom: 50px;
`;

const DateInput = styled.input`
  background-color: white;
  border: none;
  padding: 15px;
  border-radius: 5px;
  font-weight: 600;
  color: black;
  width: 100%;
`;

const InputTitle = styled.h2`
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 15px;
`;

const Container = styled(motion.div)<{ bgPhoto: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const Column = styled.div`
  padding: 72px;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  width: 50%;
  margin-left: 20px;
  height: 90%;
`;

const Images = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
`;

const Image = styled(motion.div)<{ bgPhoto: string }>`
  background-image: url(${(props) => props.bgPhoto});
  background-position: center center;
  background-size: cover;
  width: 90px;
  height: 90px;
  cursor: pointer;
  @media screen and (max-width: 1199px) {
    display: none;
  }
`;

const Card = styled(motion.div)<{ bgPhoto: string }>`
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  display: flex;
  padding: 72px;
`;

const CardTitle = styled(motion.h2)`
  font-size: 48px;
  font-weight: 400;
  margin-bottom: 30px;
`;

const DestinationInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;

const Selection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0px;
`;

const Button = styled(motion.button)`
  width: 45%;
  cursor: pointer;
  padding: 15px 8px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: none;
  margin: 0 10px;
  font-size: 18px;
  font-weight: 600;

  &:first-child {
    background-color: ${(props) => props.theme.red.accent};
  }
  &:last-child {
    background-color: ${(props) => props.theme.green.accent};
  }
`;

const Question = styled.h2`
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 30px;
  font-size: 16px;
  font-weight: 500;
`;

const buttonVar = {
  hover: { scale: 1.1 },
};

const loadingVar = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.3 } },
};

interface IDateForm {
  start: string;
  end: string;
}
