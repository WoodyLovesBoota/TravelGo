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
  font-size: 1.125rem;
  font-weight: 600;
`;

const Content = styled.div`
  line-height: 1.5;
  word-spacing: 0.0625rem;
  font-weight: 600;
  font-size: 0.875rem;
`;

const Rating = styled.div`
  margin: 0.3125rem 0;
`;

const Date = styled.div`
  color: gray;
  font-size: 0.875rem;
`;

const Button = styled.div`
  width: 2.5rem;
  font-size: 1.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.white.darker};
  font-weight: 600;
  cursor: pointer;
`;
