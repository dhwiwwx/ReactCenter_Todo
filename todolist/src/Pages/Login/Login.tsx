import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../../Firebase/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
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
  SNSButton,
  SubButtonRow,
  ShakeWrapper,
} from "./Login.styled";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [shouldShake, setShouldShake] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);



  const triggerShake = () => {
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 500);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    toast.error(message);
    triggerShake();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("유효한 이메일 형식을 입력해주세요.");
      return;
    }

    if (password.length < 6) {
      showError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    try {
      setErrorMessage("");
      setLoading(true);
      await setPersistence(
        auth,
        keepLoggedIn ? browserLocalPersistence : browserSessionPersistence
      );
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          email: cred.user.email,
        });
      }
      navigate("/projects");
    } catch (error: any) {
      switch (error.code) {
        case "auth/user-not-found":
          showError("존재하지 않는 이메일입니다.");
          break;
        case "auth/wrong-password":
          showError("비밀번호가 일치하지 않습니다.");
          break;
        case "auth/invalid-email":
          showError("잘못된 이메일 형식입니다.");
          break;
        case "auth/too-many-requests":
          showError("잠시 후 다시 시도해주세요.");
          break;
        default:
          showError("로그인 실패");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    next?: () => void
  ) => {
    if (e.key === "Enter") {
      if (next) next();
      else handleLogin();
    }
  };

  const handleSNSLogin = async () => {
    try {
      setErrorMessage("");
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          email: cred.user.email,
        });
      }
      navigate("/projects");
    } catch (err) {
      showError("SNS 로그인 실패");
    }
  };

  return (
    <Container>
      <LoginBox>
        <LogoSection>
          <ServiceName>TIMS</ServiceName>
          <SubTitle>계속하려면 로그인하세요</SubTitle>
        </LogoSection>

        <ShakeWrapper className={shouldShake ? "shake" : ""}>
          <Input
            ref={emailRef}
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) =>
              handleKeyDown(e, () => passwordRef.current?.focus())
            }
            autoComplete="email"
          />


          <PasswordWrapper>
            <Input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
            <TogglePassword onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </TogglePassword>
          </PasswordWrapper>
        </ShakeWrapper>

        <CheckboxLabel>
          <input
            type="checkbox"
            checked={keepLoggedIn}
            onChange={() => setKeepLoggedIn((prev) => !prev)}
          />
          로그인 유지하기
        </CheckboxLabel>

        {/* 에러 메시지 텍스트 제거됨. 토스트로만 표시됨 */}

        <Button onClick={handleLogin} disabled={loading}>
          {loading ? <Loader2 size={20} className="animate-spin" /> : "로그인"}
        </Button>

        <SNSButton onClick={handleSNSLogin}>
          <FcGoogle size={18} style={{ marginRight: 6 }} />
          Google 로그인
        </SNSButton>

        <SubButtonRow>
          <SubButton onClick={() => navigate("/signup")}>회원가입</SubButton>
          <SubButton onClick={() => navigate("/reset-password")}>
            비밀번호 재설정
          </SubButton>
        </SubButtonRow>
      </LoginBox>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </Container>
  );
}

export default Login;
