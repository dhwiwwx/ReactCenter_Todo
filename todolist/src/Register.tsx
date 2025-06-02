import React, { useState } from "react";
import {
  RegisterContainer,
  RegisterTitle,
  Form,
  Input as StyledInput,
  TextArea,
  Select,
  ButtonGroup,
  RegisterButton,
  CancelButton,
} from "./IssueRegister.styled";

import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function IssueRegister() {
  const [title, setTitle] = useState("");
  const [reporter, setReporter] = useState(""); // 작성자 필드 추가
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("중간");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim() || !reporter.trim() || !description.trim()) {
      alert("제목, 작성자, 설명을 모두 입력해주세요.");
      return;
    }

    try {
      await addDoc(collection(db, "issues"), {
        title,
        reporter,
        description,
        priority,
        createdAt: Timestamp.now(),
      });
      alert("이슈가 성공적으로 등록되었습니다.");

      // 입력값 초기화
      setTitle("");
      setReporter("");
      setDescription("");
      setPriority("중간");

      // 이슈 목록 페이지로 이동
      navigate("/list");
    } catch (error) {
      console.error("이슈 등록 실패: ", error);
      alert("이슈 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <RegisterContainer>
      <RegisterTitle>이슈 등록</RegisterTitle>
      <Form>
        <StyledInput
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <StyledInput
          placeholder="작성자 이름을 입력하세요"
          value={reporter}
          onChange={(e) => setReporter(e.target.value)}
        />
        <TextArea
          placeholder="상세 내용을 입력하세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="높음">높음</option>
          <option value="중간">중간</option>
          <option value="낮음">낮음</option>
        </Select>
        <ButtonGroup>
          <CancelButton onClick={() => navigate("/list")}>취소</CancelButton>
          <RegisterButton type="button" onClick={handleSubmit}>
            등록
          </RegisterButton>
        </ButtonGroup>
      </Form>
    </RegisterContainer>
  );
}

export default IssueRegister;
