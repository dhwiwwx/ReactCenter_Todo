import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
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
  CheckboxLabel,
} from "./Login.styled";
import { Eye, EyeOff } from "lucide-react";
import { Circles } from "react-loader-spinner";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("유효한 이메일 형식을 입력해주세요.");
      return;
    }

    if (password.length < 6) {
      alert("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    try {
      setLoading(true);
      await setPersistence(
        auth,
        keepLoggedIn ? browserLocalPersistence : browserSessionPersistence
      );
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/projects");
    } catch (error: any) {
      let message = "로그인 실패";
      switch (error.code) {
        case "auth/user-not-found":
          message = "존재하지 않는 이메일입니다.";
          break;
        case "auth/wrong-password":
          message = "비밀번호가 일치하지 않습니다.";
          break;
        case "auth/invalid-email":
          message = "잘못된 이메일 형식입니다.";
          break;
        case "auth/too-many-requests":
          message = "잠시 후 다시 시도해주세요.";
          break;
      }
      alert(message);
    } finally {
      setLoading(false);
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

        <CheckboxLabel>
          <input
            type="checkbox"
            checked={keepLoggedIn}
            onChange={() => setKeepLoggedIn((prev) => !prev)}
          />
          로그인 유지하기
        </CheckboxLabel>

        <Button onClick={handleLogin} disabled={loading}>
          {loading ? <Circles height="20" width="20" color="#fff" /> : "로그인"}
        </Button>
        <SubButton onClick={() => navigate("/signup")}>회원가입</SubButton>
        <SubButton onClick={() => navigate("/reset-password")}>
          비밀번호 재설정
        </SubButton>
      </LoginBox>
    </Container>
  );
}

export default Login;
