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

function IssueRegister() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("중간"); // 기본값 중간

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    // 등록 로직 (예: 서버 전송 또는 상태 관리)
    console.log({ title, description, priority });
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
          <CancelButton>취소</CancelButton>
          <RegisterButton onClick={handleSubmit}>등록</RegisterButton>
        </ButtonGroup>
      </Form>
    </RegisterContainer>
  );
}

export default IssueRegister;
