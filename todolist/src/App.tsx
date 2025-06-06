import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import IssueRegister from "./Register";
import IssueEdit from "./IssueEdit";
import ProjectListPage from "./ProjectListPage";
import IssueList from "./IssueList";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>로딩 중...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/projects" /> : <Login />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/projects"
          element={user ? <ProjectListPage /> : <Navigate to="/" />}
        />
        <Route
          path="/projects/:projectId/issues"
          element={user ? <IssueList /> : <Navigate to="/" />}
        />
        <Route
          path="/projects/:projectId/register"
          element={user ? <IssueRegister /> : <Navigate to="/" />}
        />
        <Route
          path="/edit/:id"
          element={user ? <IssueEdit /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
