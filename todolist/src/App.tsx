import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import IssueRegister from "./Pages/IssueRegister/IssueRegister";
import IssueEdit from "./Pages/IssueEdit/IssueEdit";
import ProjectListPage from "./Pages/ProjectListPage/ProjectListPage";
import IssueList from "./Pages/IssueList/IssueList";
import MyPage from "./Pages/MyPage/MyPage"; // ✅ 추가
import NotFound from "./Pages/NotFound/NotFound";
import { auth } from "./Firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ProjectViewLayout from "./Pages/ProjectView/ProjectViewLayout";
import ProjectDashboard from "./Pages/ProjectListPage/components/ProjectDashboard";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>로딩 중...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 루트 */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/projects" /> : <Navigate to="/login" />
          }
        />

        {/* 명시적 로그인 경로 */}
        <Route
          path="/login"
          element={user ? <Navigate to="/projects" /> : <Login />}
        />

        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 보호된 라우트들 */}
        <Route
          path="/projects"
          element={user ? <ProjectListPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/projects/:projectId"
          element={user ? <ProjectViewLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ProjectDashboard />} />
          <Route path="issues" element={<IssueList />} />
          <Route path="register" element={<IssueRegister />} />
        </Route>
        <Route
          path="/edit/:id"
          element={user ? <IssueEdit /> : <Navigate to="/login" />}
        />

        {/* ✅ 마이페이지 추가 */}
        <Route
          path="/mypage"
          element={user ? <MyPage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
