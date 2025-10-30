import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { auth, db, storage } from "../../Firebase/firebase";
import {
  deleteUser,
  signOut,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
} from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PageContainer,
  CardGrid,
  CardItem,
  Title,
  InfoText,
  InputRow,
  TextInput,
  SaveButton,
  LogoutButton,
  DeleteButton,
  AvatarWrapper,
  AvatarImage,
  AvatarPlaceholder,
  AvatarButton,
  HiddenFileInput,
  SectionDivider,
  SectionTitle,
  ToggleRow,
  ToggleLabel,
  ToggleButton,
  HistoryList,
  HistoryItem,
  HistoryLabel,
  HistoryValue,
} from "./MyPage.styled";

function MyPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [newDisplayName, setNewDisplayName] = useState<string>("");
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState<boolean>(false);
  const [loginHistory, setLoginHistory] = useState<
    { label: string; value: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const avatarInitial = useMemo(() => {
    const source = (displayName || email || "?").trim();
    return source ? source.charAt(0).toUpperCase() : "?";
  }, [displayName, email]);

  const formatDateTime = useCallback((value?: string | null) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "-";
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsed);
  }, []);

  useEffect(() => {
    const initializeProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        toast.error("로그인 후 이용해주세요.");
        navigate("/");
        return;
      }

      try {
        await user.reload();
      } catch (error) {
        console.error("사용자 정보 갱신 실패", error);
      }

      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        const data = snapshot.exists() ? snapshot.data() : {};
        const resolvedEmail = (data as any).email ?? user.email ?? null;
        const resolvedDisplayName =
          (data as any).displayName ?? user.displayName ?? "";
        const resolvedPhoto = (data as any).photoURL ?? user.photoURL ?? null;
        const resolvedTwoFactor = Boolean((data as any).twoFactorEnabled);

        setEmail(resolvedEmail);
        setNewEmail("");
        setDisplayName(resolvedDisplayName);
        setNewDisplayName(resolvedDisplayName);
        setPhotoURL(resolvedPhoto);
        setTwoFactorEnabled(resolvedTwoFactor);

        const providers = user.providerData
          .map((provider) => provider.providerId)
          .filter(Boolean)
          .join(", ");

        setLoginHistory([
          { label: "계정 생성일", value: formatDateTime(user.metadata.creationTime) },
          { label: "마지막 로그인", value: formatDateTime(user.metadata.lastSignInTime) },
          { label: "인증 제공자", value: providers || "-" },
        ]);
      } catch (error) {
        console.error("프로필 정보 불러오기 실패", error);
        toast.error("프로필 정보를 불러오지 못했습니다.");
      }
    };

    void initializeProfile();
  }, [formatDateTime, navigate]);

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
      setNewEmail("");
      toast.success("이메일이 변경되었습니다.");
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login")
        toast.error("다시 로그인하세요.");
      else toast.error("이메일 변경 실패: " + error.message);
    }
  };

  const handleChangePassword = async () => {
    const user = auth.currentUser;
    if (!user || !currentPassword || !newPassword) return;
    try {
      const credential = EmailAuthProvider.credential(
        user.email || "",
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("비밀번호가 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login")
        toast.error("다시 로그인하세요.");
      else toast.error("비밀번호 변경 실패: " + error.message);
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

  const handleChangeDisplayName = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const trimmed = newDisplayName.trim();
    try {
      await updateProfile(user, { displayName: trimmed || null });
      await setDoc(
        doc(db, "users", user.uid),
        { displayName: trimmed },
        { merge: true }
      );
      setDisplayName(trimmed);
      setNewDisplayName(trimmed);
      toast.success("표시 이름이 변경되었습니다.");
    } catch (error: any) {
      toast.error(`표시 이름 변경 실패: ${error.message ?? "알 수 없는 오류"}`);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const user = auth.currentUser;
    if (!user) return;
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const avatarRef = ref(storage, `profiles/${user.uid}`);
      await uploadBytes(avatarRef, file);
      const downloadURL = await getDownloadURL(avatarRef);
      await updateProfile(user, { photoURL: downloadURL });
      await setDoc(
        doc(db, "users", user.uid),
        { photoURL: downloadURL },
        { merge: true }
      );
      setPhotoURL(downloadURL);
      toast.success("프로필 이미지가 업데이트되었습니다.");
    } catch (error) {
      console.error("프로필 이미지 업로드 실패", error);
      toast.error("프로필 이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleToggleTwoFactor = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setTwoFactorLoading(true);
    const nextValue = !twoFactorEnabled;
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { twoFactorEnabled: nextValue },
        { merge: true }
      );
      setTwoFactorEnabled(nextValue);
      toast.success(
        nextValue
          ? "2단계 인증이 사용 설정되었습니다."
          : "2단계 인증이 해제되었습니다."
      );
    } catch (error) {
      console.error("2단계 인증 설정 변경 실패", error);
      toast.error("2단계 인증 설정 변경에 실패했습니다.");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  return (
    <PageContainer>
      <Title>마이페이지</Title>
      <CardGrid>
        <CardItem>
          <AvatarWrapper>
            {photoURL ? (
              <AvatarImage src={photoURL} alt="프로필 이미지" />
            ) : (
              <AvatarPlaceholder>{avatarInitial}</AvatarPlaceholder>
            )}
            <AvatarButton
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
            >
              {isUploadingAvatar ? "업로드 중..." : "이미지 변경"}
            </AvatarButton>
            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </AvatarWrapper>

          <SectionDivider />
          <SectionTitle>기본 정보</SectionTitle>
          <InputRow>
            <TextInput
              type="text"
              placeholder="표시 이름"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
            />
            <SaveButton onClick={handleChangeDisplayName}>이름 변경</SaveButton>
          </InputRow>

          <InfoText>이메일: {email ?? "-"}</InfoText>
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
            <TextInput
              type="password"
              placeholder="현재 비밀번호"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </InputRow>
          <InputRow>
            <TextInput
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <SaveButton onClick={handleChangePassword}>비밀번호 변경</SaveButton>
          </InputRow>

          <SectionDivider />
          <SectionTitle>보안</SectionTitle>
          <ToggleRow>
            <ToggleLabel>
              2단계 인증
              <InfoText style={{ marginBottom: 0 }}>
                추가적인 인증 단계를 통해 계정을 더 안전하게 보호하세요.
              </InfoText>
            </ToggleLabel>
            <ToggleButton
              type="button"
              onClick={handleToggleTwoFactor}
              $active={twoFactorEnabled}
              disabled={twoFactorLoading}
            >
              {twoFactorEnabled ? "ON" : "OFF"}
            </ToggleButton>
          </ToggleRow>

          <SectionDivider />
          <SectionTitle>로그인 기록</SectionTitle>
          <HistoryList>
            {loginHistory.map((item) => (
              <HistoryItem key={item.label}>
                <HistoryLabel>{item.label}</HistoryLabel>
                <HistoryValue>{item.value}</HistoryValue>
              </HistoryItem>
            ))}
          </HistoryList>

          <SectionDivider />
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
