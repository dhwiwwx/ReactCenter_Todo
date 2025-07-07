import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  sendEmailVerification,
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
  const [capsLockOn, setCapsLockOn] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [failCount, setFailCount] = useState<number>(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);

  useEffect(() => {
    emailRef.current?.focus();

    const savedLockUntil = localStorage.getItem("lockUntil");
    if (savedLockUntil) {
      setLockUntil(Number(savedLockUntil));
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (!user.emailVerified) {
          toast.error("이메일 인증 후 이용 가능합니다.");
          auth.signOut(); // 인증 안 됐으면 로그아웃
          return;
        }
        navigate("/projects");
      }
    });

    return unsubscribe;
  }, [navigate]);

  useEffect(() => {
    if (lockUntil) {
      localStorage.setItem("lockUntil", lockUntil.toString());
      const timer = setInterval(() => {
        if (lockUntil <= Date.now()) {
          setLockUntil(null);
          setFailCount(0);
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    } else {
      localStorage.removeItem("lockUntil");
    }
  }, [lockUntil]);

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
    if (lockUntil && lockUntil > Date.now()) {
      const secondsLeft = Math.ceil((lockUntil - Date.now()) / 1000);
      showError(`잠금 상태입니다. ${secondsLeft}초 후 다시 시도해주세요.`);
      return;
    }

    if (!email || !password) {
      showError("이메일과 비밀번호를 입력해주세요.");
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

      if (!cred.user.emailVerified) {
        await sendEmailVerification(cred.user);
        showError(
          "이메일 인증 후 로그인해주세요. 인증 메일을 다시 보냈습니다."
        );

        await auth.signOut(); // 인증 안 된 경우 강제 로그아웃
        return;
      }

      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          email: cred.user.email,
        });
      }

      console.log(`로그인 알림: ${cred.user.email} 로그인`);
      toast.success(`환영합니다, ${cred.user.email}님!`, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "colored",
      });

      setFailCount(0);
      setLockUntil(null);

      setTimeout(() => {
        setLoading(false); // 이동 직전에 로딩 풀기
        navigate("/projects");
      }, 2000);
    } catch (error: unknown) {
      console.error(error);
      setFailCount((prev) => prev + 1);

      if (failCount + 1 >= 5) {
        const lockTime = Date.now() + 60 * 1000;
        setLockUntil(lockTime);
        showError("5회 이상 실패하여 1분간 로그인 잠금됩니다.");
      } else {
        if (error instanceof Error && "code" in error) {
          switch ((error as any).code) {
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
        } else {
          showError("알 수 없는 에러 발생");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    next?: () => void
  ) => {
    setCapsLockOn(e.getModifierState("CapsLock"));
    if (e.key === "Enter") {
      if (next) next();
      else handleLogin();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState("CapsLock"));
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
      console.error(err);
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
            onKeyUp={handleKeyUp}
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
              onKeyUp={handleKeyUp}
              autoComplete="current-password"
            />
            <TogglePassword onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </TogglePassword>
          </PasswordWrapper>
        </ShakeWrapper>

        {capsLockOn && (
          <div style={{ color: "orange", marginBottom: "10px" }}>
            CapsLock이 켜져 있습니다.
          </div>
        )}

        <CheckboxLabel>
          <input
            type="checkbox"
            checked={keepLoggedIn}
            onChange={() => setKeepLoggedIn((prev) => !prev)}
          />
          로그인 유지하기
        </CheckboxLabel>

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
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable={false}
        theme="colored"
      />
    </Container>
  );
}

export default Login;
