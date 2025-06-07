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
  TogglePassword,
  PasswordWrapper,
} from "./Login.styled";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
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
          onKeyDown={handleKeyDown}
        />

        <PasswordWrapper>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <TogglePassword onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </TogglePassword>
        </PasswordWrapper>

        <Button onClick={handleLogin}>로그인</Button>
        <SubButton onClick={() => navigate("/signup")}>회원가입</SubButton>
        <SubButton onClick={() => navigate("/reset-password")}>
          비밀번호 재설정
        </SubButton>
      </LoginBox>
    </Container>
  );
}

export default Login;
