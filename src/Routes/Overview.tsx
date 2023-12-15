import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Overview = () => {
  const { state } = useLocation();

  return <Content>{state ? state.overview.overview : null}</Content>;
};

export default Overview;

const Content = styled.p`
  word-spacing: 1px;
  font-weight: 500;
  font-size: 16px;
  color: black;
`;
