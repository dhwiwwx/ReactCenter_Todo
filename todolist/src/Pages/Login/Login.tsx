import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import {
  Container,
  LoginBox,
  Input,
  Button,
  SubButton,
  LogoSection,
  ServiceName,
  SubTitle,
} from "./Login.styled";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/projects");
    } catch (error: any) {
      alert("로그인 실패: 회원정보가 없습니다.");
    }
  };

  return (
    <Container>
      <LoginBox>
        <LogoSection>
          <ServiceName>TIMS</ServiceName>
          <SubTitle>계속하려면 로그인하세요</SubTitle>
        </LogoSection>
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>로그인</Button>
        <SubButton onClick={() => navigate("/signup")}>회원가입</SubButton>
      </LoginBox>
    </Container>
  );
}

export default Login;
