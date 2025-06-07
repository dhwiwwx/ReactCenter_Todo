import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import {
  Container,
  LoginBox,
  LogoSection,
  ServiceName,
  SubTitle,
  Input,
  Button,
} from "../Login/Login.styled";
import {
  CheckButton,
  EmailInput,
  EmailRow,
  LinkButton,
  InfoText,
} from "./Signup.styled";

function Signup() {
  const [email, setEmail] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmValid, setIsConfirmValid] = useState(false);
  const navigate = useNavigate();

  // ✅ 이메일 중복 확인
  const handleEmailCheck = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, trimmedEmail);

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
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password || !confirmPassword) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (!isEmailValid) {
      alert("유효한 이메일을 입력해주세요.");
      return;
    }

    if (!isPasswordValid) {
      alert("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (!isConfirmValid) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!emailChecked) {
      alert("이메일 중복 확인을 해주세요.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      alert("회원가입 성공! 로그인해주세요.");
      navigate("/");
    } catch (error: any) {
      let message = "회원가입 실패";
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "이미 사용 중인 이메일입니다.";
          break;
        case "auth/weak-password":
          message = "비밀번호는 최소 6자 이상이어야 합니다.";
          break;
        case "auth/invalid-email":
          message = "잘못된 이메일 형식입니다.";
          break;
      }
      alert(message);
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
              const value = e.target.value;
              const trimmedValue = value.trim();
              setEmail(value);
              setEmailChecked(false);
              const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (regex.test(trimmedValue)) {
                setEmailMessage("올바른 이메일 형식입니다.");
                setIsEmailValid(true);
              } else {
                setEmailMessage("유효한 이메일을 입력해주세요.");
                setIsEmailValid(false);
              }
            }}
          />
          <CheckButton onClick={handleEmailCheck}>중복확인</CheckButton>
        </EmailRow>
        <InfoText color={isEmailValid ? "#4fa94d" : "#ff6b6b"}>{emailMessage}</InfoText>
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => {
            const value = e.target.value;
            setPassword(value);
            if (value.length >= 6) {
              setPasswordMessage("사용 가능한 비밀번호입니다.");
              setIsPasswordValid(true);
            } else {
              setPasswordMessage("비밀번호는 최소 6자 이상이어야 합니다.");
              setIsPasswordValid(false);
            }
            if (confirmPassword) {
              if (value === confirmPassword) {
                setConfirmMessage("비밀번호가 일치합니다.");
                setIsConfirmValid(true);
              } else {
                setConfirmMessage("비밀번호가 일치하지 않습니다.");
                setIsConfirmValid(false);
              }
            }
          }}
        />
        <InfoText color={isPasswordValid ? "#4fa94d" : "#ff6b6b"}>{passwordMessage}</InfoText>
        <Input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => {
            const value = e.target.value;
            setConfirmPassword(value);
            if (password === value && value.length >= 6) {
              setConfirmMessage("비밀번호가 일치합니다.");
              setIsConfirmValid(true);
            } else {
              setConfirmMessage("비밀번호가 일치하지 않습니다.");
              setIsConfirmValid(false);
            }
          }}
        />
        <InfoText color={isConfirmValid ? "#4fa94d" : "#ff6b6b"}>{confirmMessage}</InfoText>

        <Button onClick={handleSignup}>회원가입</Button>
        <LinkButton onClick={() => navigate("/")}>
          이미 계정이 있으신가요? 로그인
        </LinkButton>
      </LoginBox>
    </Container>
  );
}

export default Signup;
