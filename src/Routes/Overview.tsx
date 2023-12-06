import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Overview = () => {
  const { state } = useLocation();

  return <Content>{state ? state.overview.overview : null}</Content>;
};

export default Overview;

const Content = styled.p`
  word-spacing: 0.0625rem;
  line-height: 1.5;
  font-weight: 600;
  font-size: 0.875rem;
`;
