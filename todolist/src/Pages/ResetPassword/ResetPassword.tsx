import React, { useState, useEffect } from "react";
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
  const [emailValid, setEmailValid] = useState(true);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
      setEmailValid(true);
    } else {
      setEmailValid(regex.test(email));
    }
  }, [email]);

  const handleReset = async () => {
    if (!emailValid || email === "") {
      setMessage("유효한 이메일을 입력해주세요.");
      setIsSuccess(false);
      return;
    }

    try {
      setIsSubmitting(true);
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "비밀번호 재설정 이메일을 발송했습니다. 메일함을 확인해주세요."
      );
      setIsSuccess(true);
    } catch (error) {
      setMessage("이메일 전송에 실패했습니다. 다시 시도해주세요.");
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleReset();
    }
  };

  return (
    <Container>
      <LoginBox>
        <LogoSection>
          <ServiceName>TIMS</ServiceName>
          <SubTitle>비밀번호 재설정</SubTitle>
        </LogoSection>
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {message && (
          <p
            style={{
              color: isSuccess ? "#4fa94d" : "#ff6b6b",
              fontSize: "13px",
              marginBottom: "12px",
              marginTop: "-6px",
            }}
          >
            {message}
          </p>
        )}
        <Button onClick={handleReset} disabled={!emailValid || isSubmitting}>
          {isSubmitting ? "전송 중..." : "이메일 발송"}
        </Button>
        <SubButton onClick={() => navigate("/")}>로그인으로 돌아가기</SubButton>
      </LoginBox>
    </Container>
  );
}

export default ResetPassword;
