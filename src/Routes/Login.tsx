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
              Doesn't have an account yet?
              <LinkSignup variants={buttonVar} whileHover={"hover"} onClick={moveToSignUp}>
                Sign Up
              </LinkSignup>
              or
              <LinkSignup variants={buttonVar} whileHover={"hover"} onClick={moveToMain}>
                Go Main
              </LinkSignup>
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
            <Button variants={buttonVar} whileHover={"hover"} type="submit">
              LOGIN
            </Button>
          </Form>
        </Main>
        {/* <Image src="images/login.png" /> */}
      </Container>
    </Wrapper>
  );
};

export default Login;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${(props) => props.theme.main.accent};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 90vw;
  height: 80vh;
  background-color: ${(props) => props.theme.main.bg};
  box-shadow: 0rem 0.0625rem 0.125rem 0.375rem rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  padding: 1.25rem;
`;

const Main = styled.div`
  width: 40%;
  height: 90%;
  background-color: white;
  margin: 0 2.5rem;
  padding: 2.5rem;
  @media screen and (max-width: 1199px) {
    width: 100%;
  }
`;

const Title = styled.h2`
  color: ${(props) => props.theme.main.word};
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const LinkSignup = styled(motion.p)`
  font-weight: 500;
  font-size: 1.125rem;
  margin-left: 0.625rem;
  margin-right: 0.625rem;
  color: ${(props) => props.theme.main.accent};
  cursor: pointer;
  font-weight: 700;
`;

const SubTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 500;
  color: gray;
  display: flex;

  margin-bottom: 2.5rem;
`;

const Form = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Email = styled.div`
  margin-bottom: 1.875rem;
`;

const InputTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: black;
  margin-bottom: 0.625rem;
`;

const Input = styled.input`
  width: 100%;
  height: 3.125rem;
  border: 0.125rem solid lightgray;
  font-size: 1.125rem;
  font-weight: 600;
  padding: 0.625rem;
  border-radius: 0.625rem;
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.main.accent};
  }
  &::placeholder {
    color: lightgray;
  }
`;

const Password = styled.div``;

const Button = styled(motion.button)`
  background-color: ${(props) => props.theme.main.accent};
  color: white;
  border: none;
  padding: 1.25rem;
  border-radius: 0.625rem;
  width: 100%;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-top: auto;
`;

const buttonVar = { hover: { scale: 1.1 } };

interface IForm {
  email: string;
  password: string;
}
