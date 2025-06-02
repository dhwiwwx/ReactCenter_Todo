// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IssueList from "./IssueList";
import Register from "./Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/list" element={<IssueList />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
