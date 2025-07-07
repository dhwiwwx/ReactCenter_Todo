import React, { useEffect, useState } from "react";
import { auth, db } from "../../Firebase/firebase";
import { deleteUser, signOut } from "firebase/auth";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PageContainer,
  Title,
  InfoText,
  DeleteButton,
  LogoutButton,
} from "./MyPage.styled";

function MyPage() {
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("로그인 후 이용해주세요.");
      navigate("/");
      return;
    }

    getDoc(doc(db, "users", user.uid)).then((docSnap) => {
      if (docSnap.exists()) {
        setEmail(docSnap.data().email);
      } else {
        setEmail(user.email);
      }
    });
  }, [navigate]);

  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("로그인 상태가 아닙니다.");
        return;
      }

      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);

      toast.success("탈퇴가 완료되었습니다.");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/requires-recent-login") {
        toast.error("탈퇴하려면 다시 로그인하세요.");
      } else {
        toast.error("탈퇴 실패: " + error.message);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <PageContainer>
      <Title>마이페이지</Title>
      <InfoText>이메일: {email}</InfoText>

      <DeleteButton onClick={handleDeleteAccount}>회원 탈퇴</DeleteButton>
      <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>

      <ToastContainer position="top-center" autoClose={2500} />
    </PageContainer>
  );
}

export default MyPage;
