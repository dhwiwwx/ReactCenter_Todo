import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("회원가입 성공! 로그인해주세요.");
      navigate("/");
    } catch (error) {
        if (error instanceof Error) {
          alert("회원가입 실패: " + error.message);
        } else {
          alert("회원가입 실패: 알 수 없는 오류가 발생했습니다.");
        }
      }
    };
      

  return (
    <div style={{ padding: "2rem" }}>
      <h2>회원가입</h2>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={handleSignup}>회원가입</button>
    </div>
  );
}

export default Signup;
