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
              <Button variants={buttonVar} whileHover={"hover"} type="submit">
                SUBMIT
              </Button>
              <Button variants={buttonVar} whileHover={"hover"} onClick={goLogin}>
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
  box-shadow: 0rem 0.0625rem 0.125rem 0.375rem rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.25rem 12%;
  @media screen and (max-width: 1199px) {
    padding: 1.25rem 0;
  }
`;

const Main = styled.div`
  width: 100%;
  height: 90%;
  background-color: white;
  margin: 0 2.5rem;
  padding: 3.75rem;
  overflow: auto;
  @media screen and (max-width: 899px) {
    margin: 0;
  }
`;

const Title = styled.h2`
  color: ${(props) => props.theme.main.word};
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
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
  font-size: 1.125rem;
  font-weight: 600;
  color: black;
  margin-bottom: 0.625rem;
`;

const Input = styled.input`
  width: 80%;
  height: 3.125rem;
  border: 0.125rem solid lightgray;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.625rem;
  border-radius: 0.625rem;
  margin-bottom: 1.875rem;
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
  padding: 1.25rem;
  border-radius: 0.625rem;
  width: 45%;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;

  &:last-child {
    background-color: transparent;
    color: ${(props) => props.theme.main.accent};
    border: 0.125rem solid ${(props) => props.theme.main.accent};
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
