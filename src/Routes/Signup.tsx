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
            data.email.split("@")[0] + "$" + data.email.split("@")[1].split(".")[0] + "$" + data.email.split(".")[1]
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
              <Button type="submit">SUBMIT</Button>
              <Button onClick={goLogin}>CANCEL</Button>
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
  min-height: 100vh;
  background-color: ${(props) => props.theme.main.accent};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 90%;
  min-height: 80vh;
  background-color: ${(props) => props.theme.main.bg};
  box-shadow: 0px 1px 2px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  padding: 20px;

  @media screen and (max-width: 500px) {
    height: 100vh;
    width: 100%;
    padding: 10px;
    align-items: flex-start;
  }
`;

const Main = styled.div`
  width: 100%;
  min-height: 75vh;
  background-color: white;
  margin: 0 40px;
  padding: 50px;
  @media screen and (max-width: 1200px) {
    width: 100%;
  }
  @media screen and (max-width: 800px) {
    margin: 0 10px;
    padding: 40px 20px;
    padding-bottom: 10px;
  }
  @media screen and (max-width: 800px) {
    min-height: 95vh;
  }
`;

const Title = styled.h2`
  color: ${(props) => props.theme.main.word};
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 15px;
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

const Form = styled.form`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  @media screen and (max-width: 800px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const Column = styled.div`
  width: 47%;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

const Email = styled.div``;

const Info = styled.div``;

const InputTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: black;
  margin-bottom: 10px;
  @media screen and (max-width: 800px) {
    font-size: 16px;
  }
`;

const Input = styled.input`
  width: 95%;
  height: 50px;
  border: 2px solid lightgray;
  font-size: 16px;
  font-weight: 600;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 1.875rem;
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
    width: 100%;
  }
`;

const Password = styled.div`
  display: flex;
  flex-direction: column;
`;

const Button = styled(motion.button)`
  background-color: ${(props) => props.theme.main.button};
  border: none;
  padding: 20px;
  border-radius: 10px;
  width: 45%;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;

  &:hover {
    background-color: ${(props) => props.theme.main.button + "aa"};
  }

  &:last-child {
    background-color: transparent;
    color: ${(props) => props.theme.main.accent};
    border: 2px solid ${(props) => props.theme.main.accent};
  }

  @media screen and (max-width: 500px) {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 50vw;
    border-radius: 0px;
    &:last-child {
      right: 0;
      left: 50vw;
      border: 0;
      background-color: white;
    }
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
