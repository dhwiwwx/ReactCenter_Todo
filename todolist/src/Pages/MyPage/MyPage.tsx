import React, { useEffect, useState } from "react";
import { auth, db } from "../../Firebase/firebase";
import { deleteUser, signOut, updateEmail } from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PageContainer,
  CardGrid,
  CardItem,
  Title,
  InfoText,
  ProfileImage,
  InputRow,
  TextInput,
  SaveButton,
  LogoutButton,
  DeleteButton,
} from "./MyPage.styled";

function MyPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
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
        const data = docSnap.data();
        setEmail(data.email);
        setProfileImage(data.profileImage || "");
      } else {
        setEmail(user.email);
      }
    });
  }, [navigate]);

  const handleSaveImage = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { profileImage: imageUrl },
        { merge: true }
      );
      setProfileImage(imageUrl);
      toast.success("프로필 이미지가 변경되었습니다.");
    } catch {
      toast.error("이미지 저장 실패");
    }
  };

  const handleChangeEmail = async () => {
    const user = auth.currentUser;
    if (!user || !newEmail) return;
    try {
      await updateEmail(user, newEmail);
      await setDoc(
        doc(db, "users", user.uid),
        { email: newEmail },
        { merge: true }
      );
      setEmail(newEmail);
      toast.success("이메일이 변경되었습니다.");
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login")
        toast.error("다시 로그인하세요.");
      else toast.error("이메일 변경 실패: " + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      toast.success("탈퇴가 완료되었습니다.");
      navigate("/");
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login")
        toast.error("다시 로그인하세요.");
      else toast.error("탈퇴 실패: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <PageContainer>
      <Title>마이페이지</Title>
      <CardGrid>
        <CardItem>
          <ProfileImage
            src={profileImage || "https://placekitten.com/200/200"}
            alt="프로필"
          />
          <InfoText>이메일: {email}</InfoText>

          <InputRow>
            <TextInput
              type="text"
              placeholder="프로필 이미지 URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <SaveButton onClick={handleSaveImage}>이미지 저장</SaveButton>
          </InputRow>

          <InputRow>
            <TextInput
              type="email"
              placeholder="새 이메일 입력"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <SaveButton onClick={handleChangeEmail}>이메일 변경</SaveButton>
          </InputRow>

          <InputRow>
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
            <DeleteButton onClick={handleDeleteAccount}>회원 탈퇴</DeleteButton>
          </InputRow>
        </CardItem>
      </CardGrid>
      <ToastContainer position="top-center" autoClose={2500} />
    </PageContainer>
  );
}

export default MyPage;
