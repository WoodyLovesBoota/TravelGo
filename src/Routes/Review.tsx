import { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import StarRate from "../Components/StarRate";

const Review = () => {
  const { state } = useLocation();
  const [current, setCurrent] = useState(0);

  const decreaseState = () => {
    setCurrent((prev) => (prev === 0 ? state.review.length - 1 : prev - 1));
  };

  const increaseState = () => {
    setCurrent((prev) => (prev === state.review.length - 1 ? 0 : prev + 1));
  };

  return (
    <Wrapper>
      {state && state.review ? (
        <ReviewCard>
          <Row>
            <Column>
              <Name>{state.review[current].author_name}</Name>
              <Date>{state.review[current].relative_time_description}</Date>
            </Column>
            <Column>
              <Button onClick={decreaseState}>&lt;</Button>
              <Button onClick={increaseState}>&gt;</Button>
            </Column>
          </Row>
          <Rating>
            <StarRate dataRating={state.review[current].rating} size="14" />
          </Rating>
          <Content>{state.review[current].text}</Content>
        </ReviewCard>
      ) : (
        `해당 장소에 대한 리뷰가 존재하지 않습니다.`
      )}
    </Wrapper>
  );
};

export default Review;

const Wrapper = styled.div``;

const ReviewCard = styled.div`
  width: 100%;
  margin-bottom: 1.25rem;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  &:last-child {
    display: flex;
    flex-direction: row;
  }
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: black;
`;

const Content = styled.div`
  line-height: 1.5;
  font-weight: 500;
  font-size: 16px;
  color: black;
`;

const Rating = styled.div`
  margin: 5px 0;
`;

const Date = styled.div`
  color: gray;
  font-size: 14px;
  font-weight: 500;
`;

const Button = styled.div`
  width: 40px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: gray;
  font-weight: 600;
  cursor: pointer;
`;
