import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "../atoms";
import { motion } from "framer-motion";

const Signup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue: setInputValue } = useForm<IForm>();
  const [users, setUsers] = useRecoilState(userState);

  const goLogin = () => {
    navigate("/login");
  };

  const onValid = (data: IForm) => {
    const pattern = /^[A-Za-z0-9_\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
    if (pattern.test(data.email)) {
      if (data.password === data.passwordauth) {
        if (
          users[
            data.email.split("@")[0] +
              "$" +
              data.email.split("@")[1].split(".")[0] +
              "$" +
              data.email.split(".")[1]
          ]
        ) {
          alert(`이미 사용중인 ID 입니다.`);
          setInputValue("email", "");
          setInputValue("password", "");
          setInputValue("passwordauth", "");
          setInputValue("username", "");
        } else {
          setUsers((prev) => {
            return {
              ...prev,
              [data.email.split("@")[0] +
              "$" +
              data.email.split("@")[1].split(".")[0] +
              "$" +
              data.email.split(".")[1]]: {
                info: { name: data.username, password: data.password },
                trips: {},
              },
            };
          });
          alert(`회원가입이 완료되었습니다.`);
          navigate("/login");
        }
      } else {
        alert(`비밀번호가 일치하지 않습니다.`);
        setInputValue("password", "");
        setInputValue("passwordauth", "");
      }
    } else {
      alert(`Email 형식이 맞지 않습니다.`);
      setInputValue("email", "");
      setInputValue("password", "");
      setInputValue("passwordauth", "");
      setInputValue("username", "");
    }
  };

  return (
    <Wrapper>
      <Container>
        <Main>
          <Form onSubmit={handleSubmit(onValid)}>
            <Title>Sign Up</Title>
            <SubTitle>Create an account</SubTitle>
            <Row>
              <Column>
                <Email>
                  <InputTitle>Email</InputTitle>
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
                    autoComplete="off"
                    placeholder="Enter your password."
                  />
                  <InputTitle>Confirm Password</InputTitle>
                  <Input
                    {...register("passwordauth", { required: true })}
                    autoComplete="off"
                    placeholder="Enter your confirm password."
                  />
                </Password>
              </Column>
              <Column>
                <Info>
                  <InputTitle>User Name</InputTitle>
                  <Input
                    {...register("username", { required: true })}
                    autoComplete="off"
                    placeholder="Enter your user name."
                  />
                </Info>
              </Column>
            </Row>
            <Buttons>
              <Button variants={buttonVar} whileHover={"hover"} type="submit">
                SUBMIT
              </Button>
              <Button
                variants={buttonVar}
                whileHover={"hover"}
                onClick={goLogin}
              >
                CANCEL
              </Button>
            </Buttons>
          </Form>
        </Main>
      </Container>
    </Wrapper>
  );
};

export default Signup;

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
  height: 90vh;
  background-color: ${(props) => props.theme.main.bg};
  box-shadow: 0px 1px 2px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 12%;
`;

const Main = styled.div`
  width: 100%;
  height: 90%;
  background-color: white;
  margin: 0 40px;
  padding: 60px;
  overflow: auto;
`;

const Title = styled.h2`
  color: ${(props) => props.theme.main.word};
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const SubTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: gray;
  display: flex;
  margin-bottom: 40px;
`;

const Form = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const Column = styled.div`
  width: 45%;
`;

const Email = styled.div``;

const Info = styled.div``;

const InputTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: black;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 80%;
  height: 50px;
  border: 2px solid lightgray;
  font-size: 16px;
  font-weight: 600;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 30px;
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.main.accent};
  }
  &::placeholder {
    color: lightgray;
  }
`;

const Password = styled.div`
  display: flex;
  flex-direction: column;
`;

const Button = styled(motion.button)`
  background-color: ${(props) => props.theme.main.accent};
  color: white;
  border: none;
  padding: 20px;
  border-radius: 10px;
  width: 45%;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;

  &:last-child {
    background-color: transparent;
    color: ${(props) => props.theme.main.accent};
    border: 2px solid ${(props) => props.theme.main.accent};
  }
`;

const Buttons = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: auto;
`;

const buttonVar = { hover: { scale: 1.1 } };

interface IForm {
  email: string;
  password: string;
  passwordauth: string;
  username: string;
}
