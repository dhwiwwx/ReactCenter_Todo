import React, { useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import {
  Container,
  SignupBox,
  TitleWrapper,
  Title,
  SubTitle,
  Input,
  Button,
  LinkButton,
  InfoText,
  PasswordWrapper,
  TogglePasswordButton,
} from "./Signup.styled";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Signup() {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [emailMessage, setEmailMessage] = useState("");
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isConfirmValid, setIsConfirmValid] = useState(true);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [shakeEmail, setShakeEmail] = useState(false);
  const [shakeConfirm, setShakeConfirm] = useState(false);

  const navigate = useNavigate();

  // ✅ 이메일 유효성 + 중복 확인
  useEffect(() => {
    const delay = setTimeout(async () => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        setEmailMessage("");
        setEmailValid(true);
        return;
      }
      if (!regex.test(email)) {
        setEmailMessage("유효한 이메일을 입력해주세요.");
        setEmailValid(false);
        return;
      }
      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
          setEmailMessage("이미 사용 중인 이메일입니다.");
          setIsEmailAvailable(false);
        } else {
          setEmailMessage("사용 가능한 이메일입니다.");
          setIsEmailAvailable(true);
        }
        setEmailValid(true);
      } catch {
        setEmailMessage("이메일 확인 중 오류가 발생했습니다.");
        setEmailValid(false);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [email]);

  // ✅ 비밀번호 보안성 체크
  useEffect(() => {
    if (!password) {
      setPasswordStrength("");
    } else if (
      password.length >= 10 &&
      /[A-Z]/.test(password) &&
      /[\W]/.test(password)
    ) {
      setPasswordStrength("강함");
    } else if (password.length >= 8) {
      setPasswordStrength("보통");
    } else {
      setPasswordStrength("약함");
    }
  }, [password]);

  // ✅ 회원가입 처리
  const handleSignup = async () => {
    if (!emailValid || !isEmailAvailable) {
      setShakeEmail(true);
      setTimeout(() => setShakeEmail(false), 500);
      return;
    }
    if (password !== confirmPassword) {
      setIsConfirmValid(false);
      setShakeConfirm(true);
      setTimeout(() => setShakeConfirm(false), 500);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("회원가입 성공!");
      navigate("/");
    } catch {
      alert("회원가입 실패");
    }
  };

  return (
    <Container>
      <SignupBox>
        <TitleWrapper>
          <Title>TIMS</Title>
          <SubTitle>계정을 생성하려면 정보를 입력하세요</SubTitle>
        </TitleWrapper>

        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          hasError={!emailValid || !isEmailAvailable}
          shake={shakeEmail}
          ref={emailRef}
        />
        {emailMessage && (
          <InfoText color={isEmailAvailable ? "#4fa94d" : "#ff6b6b"}>
            {emailMessage}
          </InfoText>
        )}

        <PasswordWrapper>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            ref={passwordRef}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TogglePasswordButton
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </TogglePasswordButton>
        </PasswordWrapper>

        {password && (
          <InfoText
            color={
              passwordStrength === "강함"
                ? "#4fa94d"
                : passwordStrength === "보통"
                ? "#f1c40f"
                : "#ff6b6b"
            }
          >
            비밀번호 보안성: {passwordStrength}
          </InfoText>
        )}

        <PasswordWrapper>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="비밀번호 확인"
            ref={confirmRef}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setIsConfirmValid(e.target.value === password);
            }}
            hasError={!isConfirmValid}
            shake={shakeConfirm}
          />
          <TogglePasswordButton
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </TogglePasswordButton>
        </PasswordWrapper>

        {!isConfirmValid && (
          <InfoText color="#ff6b6b">비밀번호가 일치하지 않습니다.</InfoText>
        )}

        <Button onClick={handleSignup}>회원가입</Button>
        <LinkButton onClick={() => navigate("/")}>
          이미 계정이 있으신가요? 로그인
        </LinkButton>
      </SignupBox>
    </Container>
  );
}

export default Signup;
