import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import IssueList from "./IssueList";
import IssueRegister from "./Register";
import Signup from "./Signup";
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
          element={user ? <Navigate to="/list" /> : <Login />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/list"
          element={user ? <IssueList /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={user ? <IssueRegister /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
