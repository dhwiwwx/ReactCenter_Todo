import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
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
} from "../Login/Login.styled";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("비밀번호 재설정 이메일을 전송했습니다.");
      navigate("/");
    } catch (error) {
      alert("비밀번호 재설정에 실패했습니다.");
    }
  };

  return (
    <Container>
      <LoginBox>
        <LogoSection>
          <ServiceName>TIMS</ServiceName>
          <SubTitle>비밀번호 재설정을 위해 이메일을 입력하세요</SubTitle>
        </LogoSection>
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleReset}>재설정 메일 보내기</Button>
        <SubButton onClick={() => navigate("/")}>로그인으로 돌아가기</SubButton>
      </LoginBox>
    </Container>
  );
}

export default ResetPassword;
