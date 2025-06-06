import React, { useEffect, useState } from "react";
import {
  RegisterContainer,
  RegisterBox,
  RegisterTitle,
  Form,
  Input,
  TextArea,
  Select,
  DeadlineInput,
  ButtonGroup,
  RegisterButton,
  CancelButton,
} from "./IssueRegister.styled";
import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function IssueRegister() {
  const [title, setTitle] = useState("");
  const [reporter, setReporter] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("중간");
  const [category, setCategory] = useState("버그");

  // 생성일(읽기 전용)용 문자열
  const [createdAtFormatted, setCreatedAtFormatted] = useState("");

  // 마감일은 문자열(YYYY-MM-DD) 형태로 관리
  const [deadline, setDeadline] = useState("");

  const navigate = useNavigate();

  // 현재 시각을 YYYY-MM-DD HH:mm 형태로 만들어줌
  const getFormattedDate = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  };

  useEffect(() => {
    setCreatedAtFormatted(getFormattedDate());
  }, []);

  const validateForm = () => {
    if (!title.trim()) return "제목을 입력해주세요.";
    if (!reporter.trim()) return "작성자 이름을 입력해주세요.";
    if (!description.trim()) return "상세 내용을 입력해주세요.";
    if (!deadline.trim()) return "마감일을 선택해주세요.";
    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    try {
      await addDoc(collection(db, "issues"), {
        title,
        reporter,
        description,
        priority,
        category,
        // 만약 빈 문자열이면 null로 저장
        deadline: deadline ? new Date(deadline).toISOString() : null,
        createdAt: Timestamp.now(),
        createdAtFormatted,
        status: "할 일",
      });
      alert("이슈가 성공적으로 등록되었습니다.");
      navigate("/list");
    } catch (error) {
      console.error("이슈 등록 실패: ", error);
      alert("이슈 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <RegisterContainer>
      <RegisterBox>
        <RegisterTitle>이슈 등록</RegisterTitle>
        <Form>
          {/* 제목 */}
          <Input
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* 작성자 이름 */}
          <Input
            placeholder="작성자 이름을 입력하세요"
            value={reporter}
            onChange={(e) => setReporter(e.target.value)}
          />

          {/* 상세 내용 */}
          <TextArea
            placeholder="상세 내용을 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* 우선순위 */}
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="높음">높음</option>
            <option value="중간">중간</option>
            <option value="낮음">낮음</option>
          </Select>

          {/* 카테고리 */}
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="버그">버그</option>
            <option value="기능 요청">기능 요청</option>
            <option value="UI 개선">UI 개선</option>
            <option value="성능 개선">성능 개선</option>
            <option value="기타">기타</option>
          </Select>

          {/* 생성일 (읽기 전용) */}
          <Input value={createdAtFormatted} disabled readOnly />

          {/* 마감일 선택 */}
          <DeadlineInput
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="마감일을 선택하세요"
          />

          {/* 버튼 그룹 */}
          <ButtonGroup>
            <CancelButton onClick={() => navigate("/list")}>취소</CancelButton>
            <RegisterButton type="button" onClick={handleSubmit}>
              등록
            </RegisterButton>
          </ButtonGroup>
        </Form>
      </RegisterBox>
    </RegisterContainer>
  );
}

export default IssueRegister;
