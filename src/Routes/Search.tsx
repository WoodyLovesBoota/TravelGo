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
          <>
            <Background
              bgPhoto={makeImagePath(
                clickedImage === ""
                  ? detailData?.result?.photos
                    ? detailData?.result?.photos[0]?.photo_reference
                    : ""
                  : clickedImage,
                800
              )}
            />
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
              <Column>
                <Card
                  bgPhoto={makeImagePath(
                    clickedImage === ""
                      ? detailData?.result?.photos
                        ? detailData?.result?.photos[0]?.photo_reference
                        : ""
                      : clickedImage,
                    800
                  )}
                />
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
              </Column>
              <Column>
                <DestinationInfo>
                  <CardTitle>{destinationData?.candidates[0]?.name}</CardTitle>
                  <Content>{destinationData?.candidates[0]?.formatted_address}</Content>
                  <GoogleMap
                    destination={destinationData?.candidates[0]?.formatted_address}
                    width="100%"
                    height="270px"
                    zoom={8}
                  />
                </DestinationInfo>
                <Form onSubmit={handleSubmit(onValid)}>
                  <DateRow>
                    <DateBox>
                      <InputTitle>Departure date</InputTitle>
                      <DateInput
                        {...register("start", { required: true })}
                        type="date"
                        data-placeholder="날짜 선택"
                        aria-required="true"
                      />
                    </DateBox>
                    <Divider>~</Divider>
                    <DateBox>
                      <InputTitle>Arrival date</InputTitle>
                      <DateInput
                        {...register("end", { required: true })}
                        type="date"
                        data-placeholder="날짜 선택"
                        aria-required="true"
                      />
                    </DateBox>
                  </DateRow>
                  <Selection>
                    <Question>Is this the place for you to Travel?</Question>
                    <Buttons>
                      <Button variants={buttonVar} whileHover={"hover"} onClick={onNoClicked}>
                        No
                      </Button>
                      <Button variants={buttonVar} whileHover={"hover"} type="submit" onClick={onYesClicked}>
                        Yes
                      </Button>
                    </Buttons>
                  </Selection>
                </Form>
              </Column>
            </Container>
          </>
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

const DateRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const DateBox = styled.div`
  width: 40%;
`;

const Divider = styled.h2`
  font-weight: 600;
  color: gray;
  margin-top: 20px;
`;

const DateInput = styled.input`
  background-color: lightgray;
  border: none;
  padding: 15px 8px;
  border-radius: 5px;
  font-weight: 600;
  color: gray;
  width: 100%;
`;

const InputTitle = styled.h2`
  font-weight: 600;
`;

const Background = styled.div<{ bgPhoto: string }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center center;
  background-size: cover;
  filter: blur(7px);
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
  &:last-child {
    padding: 3.125rem 3.125rem;
    background-color: rgba(255, 255, 255, 0.6);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 15px;
    @media screen and (max-width: 1199px) {
      height: 51.875rem;
      width: 39.375rem;
    }
    @media screen and (max-width: 500px) {
      width: 100vw;
      min-height: 51.875rem;
    }
  }
`;

const Images = styled.div`
  display: flex;
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
  width: 45rem;
  height: 39.375rem;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  margin-right: 15px;
  @media screen and (max-width: 1199px) {
    display: none;
  }
`;

const CardTitle = styled(motion.h2)`
  font-size: 2.25rem;
  font-weight: 600;
`;

const Content = styled.h2`
  font-size: 16px;
  margin-left: 8px;
  margin-bottom: 30px;
  font-weight: 500;
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
  margin: 10px auto;
  margin-top: 35px;
  font-size: 16px;
  font-weight: 700;
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
