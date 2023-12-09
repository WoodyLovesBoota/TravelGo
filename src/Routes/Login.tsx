import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { playerState, userState } from "../atoms";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue: setInputValue } = useForm<IForm>();
  const [users, setUsers] = useRecoilState(userState);
  const [player, setPlayer] = useRecoilState(playerState);

  const moveToSignUp = () => {
    navigate("/signup");
  };

  const moveToMain = () => {
    navigate("/");
  };

  const onValid = (data: IForm) => {
    const pattern = /^[A-Za-z0-9_\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
    if (pattern.test(data.email)) {
      if (
        users[data.email.split("@")[0] + "$" + data.email.split("@")[1].split(".")[0] + "$" + data.email.split(".")[1]]
          ?.info.password === data.password
      ) {
        setPlayer({
          email:
            data.email.split("@")[0] + "$" + data.email.split("@")[1].split(".")[0] + "$" + data.email.split(".")[1],
          info: {
            name: users[
              data.email.split("@")[0] + "$" + data.email.split("@")[1].split(".")[0] + "$" + data.email.split(".")[1]
            ].info.name,
            password:
              users[
                data.email.split("@")[0] + "$" + data.email.split("@")[1].split(".")[0] + "$" + data.email.split(".")[1]
              ].info.password,
          },
        });
        navigate("/trip");
      } else {
        alert(`아이디 혹은 비밀번호가 잘못되었습니다.`);
        setInputValue("password", "");
      }
    } else {
      alert(`Email 형식이 맞지 않습니다.`);
      setInputValue("email", "");
      setInputValue("password", "");
    }
  };

  return (
    <Wrapper>
      <Container>
        <Main>
          <Form onSubmit={handleSubmit(onValid)}>
            <Title>Login</Title>
            <SubTitle>
              <Question>Doesn't have an account yet?</Question>
              <Question>
                <LinkSignup variants={buttonVar} whileHover={"hover"} onClick={moveToSignUp}>
                  Sign Up
                </LinkSignup>
                or
                <LinkSignup variants={buttonVar} whileHover={"hover"} onClick={moveToMain}>
                  Main
                </LinkSignup>
              </Question>
            </SubTitle>
            <Email>
              <InputTitle>Email Address</InputTitle>
              <Input
                {...register("email", { required: true })}
                autoComplete="off"
                placeholder="Enter your email address. ex) example@gmail.com"
              />
            </Email>
            <Password>
              <InputTitle>Password</InputTitle>
              <Input
                {...register("password", { required: true })}
                type="password"
                autoComplete="off"
                placeholder="Enter your password."
              />
            </Password>
            <Button type="submit">LOGIN</Button>
          </Form>
        </Main>
      </Container>
    </Wrapper>
  );
};

export default Login;

const Wrapper = styled.div`
  width: 100vw;
  height: max(100vh, 650px);
  background-color: ${(props) => props.theme.main.accent};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 90%;
  height: 80%;
  background-color: ${(props) => props.theme.main.bg};
  box-shadow: 0px 1px 2px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  padding: 20px;

  @media screen and (max-width: 500px) {
    height: 100vh;
    width: 100%;
    padding: 10px;
  }
`;

const Main = styled.div`
  width: 50%;
  height: 95%;
  background-color: white;
  margin: 0 40px;
  padding: 50px;
  @media screen and (max-width: 1200px) {
    width: 100%;
  }
  @media screen and (max-width: 800px) {
    margin: 0 10px;
    padding: 40px 20px;
  }
`;

const Title = styled.h2`
  color: ${(props) => props.theme.main.word};
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 15px;
`;

const LinkSignup = styled(motion.p)`
  font-weight: 500;
  font-size: 18px;
  margin-left: 10px;
  margin-right: 10px;
  color: ${(props) => props.theme.main.accent};
  cursor: pointer;
  font-weight: 700;
  @media screen and (max-width: 800px) {
    font-size: 16px;
    margin-right: 10px;
    margin-left: 0;
    &:last-child {
      margin-left: 10px;
    }
  }
`;

const SubTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: gray;
  display: flex;
  margin-bottom: 2.5rem;
  @media screen and (max-width: 800px) {
    font-size: 16px;
    flex-direction: column;
  }
`;

const Question = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: gray;
  display: flex;

  @media screen and (max-width: 800px) {
    font-size: 16px;
    width: 100%;
    margin-bottom: 10px;
  }
`;

const Form = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Email = styled.div`
  margin-bottom: 3.125rem;
`;

const InputTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  @media screen and (max-width: 800px) {
    font-size: 16px;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 60px;
  border: 2px solid lightgray;
  font-size: 18px;
  font-weight: 600;
  padding: 20px;
  border-radius: 12px;
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.main.accent};
  }
  &::placeholder {
    color: lightgray;
  }
  @media screen and (max-width: 800px) {
    font-size: 16px;
    padding: 15px;
  }
`;

const Password = styled.div``;

const Button = styled(motion.button)`
  background-color: ${(props) => props.theme.main.button};
  border: none;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  margin-top: auto;
  &:hover {
    background-color: ${(props) => props.theme.main.button + "aa"};
  }

  @media screen and (max-width: 500px) {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    border-radius: 0px;
  }
`;

const buttonVar = { hover: { scale: 1.1 } };

interface IForm {
  email: string;
  password: string;
}
