import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import {
  Container,
  LoginBox,
  LogoSection,
  ServiceName,
  SubTitle,
  Input,
  Button,
} from "./Login.styled";
import { CheckButton, EmailInput, EmailRow } from "./Signup.styled";

function Signup() {
  const [email, setEmail] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // ✅ 이메일 중복 확인
  const handleEmailCheck = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }
  
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
  
      if (methods.length > 0) {
        alert("이미 사용 중인 이메일입니다.");
        setEmailChecked(false);
      } else {
        alert("사용 가능한 이메일입니다.");
        setEmailChecked(true);
      }
    } catch (error) {
      alert("이메일 확인 중 오류가 발생했습니다.");
      setEmailChecked(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (!emailChecked) {
      alert("이메일 중복 확인을 해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("회원가입 성공! 로그인해주세요.");
      navigate("/");
    } catch (error) {
      alert("회원가입 실패: 이미 가입된 이메일일 수 있습니다.");
    }
  };

  return (
    <Container>
      <LoginBox>
        <LogoSection>
          <ServiceName>TIMS</ServiceName>
          <SubTitle>계정을 생성하려면 정보를 입력하세요</SubTitle>
        </LogoSection>

        <EmailRow>
  <EmailInput
    type="email"
    placeholder="이메일"
    value={email}
    onChange={(e) => {
      setEmail(e.target.value);
      setEmailChecked(false);
    }}
  />
  <CheckButton onClick={handleEmailCheck}>중복확인</CheckButton>
</EmailRow>
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button onClick={handleSignup}>회원가입</Button>
      </LoginBox>
    </Container>
  );
}

export default Signup;
