import React, { useEffect, useState } from "react";
import {
  RegisterContainer,
  RegisterBox,
  RegisterTitle,
  Form,
  Input,
  TextArea,
  Select,
  ButtonGroup,
  RegisterButton,
  CancelButton,
} from "./IssueRegister.styled";
import { db, auth } from "../../Firebase/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker"; // ✅ DatePicker import
import "react-datepicker/dist/react-datepicker.css";

function IssueRegister() {
  const [title, setTitle] = useState("");
  const [reporter, setReporter] = useState("");
  const [assignee, setAssignee] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("중간");
  const [category, setCategory] = useState("버그");
  const { projectId } = useParams<{ projectId: string }>();

  const [createdAtFormatted, setCreatedAtFormatted] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null); // ✅ 타입 변경

  const navigate = useNavigate();

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
    const currentUser = auth.currentUser;
    if (currentUser) {
      setReporter(currentUser.displayName || currentUser.email || "");
    }
    setCreatedAtFormatted(getFormattedDate());
  }, []);

  const validateForm = () => {
    if (!title.trim()) return "제목을 입력해주세요.";
    if (!reporter.trim()) return "작성자 정보가 없습니다.";
    if (!description.trim()) return "상세 내용을 입력해주세요.";
    if (!assignee.trim()) return "담당자를 입력해주세요.";
    if (!deadline) return "마감일을 선택해주세요.";
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
        assignee,
        projectId,
        deadline: deadline ? deadline.toISOString() : null, // ✅ 수정됨
        createdAt: Timestamp.now(),
        createdAtFormatted,
        status: "할 일",
      });
      alert("이슈가 성공적으로 등록되었습니다.");
      navigate(`/projects/${projectId}/issues`);
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
          <Input
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="작성자 이름을 입력하세요"
            value={reporter}
            readOnly
            disabled
          />
          <Input
            placeholder="담당자 이름을 입력하세요"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
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
          <Input value={createdAtFormatted} disabled readOnly />

          {/* ✅ 마감일 DatePicker 적용 */}
          <DatePicker
            selected={deadline}
            onChange={(date: Date | null) => setDeadline(date)}
            placeholderText="마감일을 선택하세요"
            dateFormat="yyyy-MM-dd"
            className="datepicker-input"
            minDate={new Date()}
          />

          <ButtonGroup>
            <CancelButton
              onClick={() => navigate(`/projects/${projectId}/issues`)}
            >
              취소
            </CancelButton>
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
