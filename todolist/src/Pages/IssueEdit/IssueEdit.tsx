import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  RegisterContainer,
  RegisterBox,
  RegisterTitle,
  Form,
  Input,
  TextArea,
  Select,
  StyledDatePicker,
  ButtonGroup,
  RegisterButton,
  CancelButton,
} from "../IssueRegister/IssueRegister.styled";
import { db } from "../../Firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function IssueEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const passedIssue = location.state;

  const [title, setTitle] = useState("");
  const [reporter, setReporter] = useState("");
  const [assignee, setAssignee] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("중간");
  const [category, setCategory] = useState("버그");
  const [deadline, setDeadline] = useState<Date | null>(null); // ✅ Date 타입
  const [status, setStatus] = useState("할 일");
  const [projectId, setProjectId] = useState<string>("");

  useEffect(() => {
    const applyData = (data: any) => {
      setTitle(data.title || "");
      setReporter(data.reporter || "");
      setAssignee(data.assignee || "");
      setDescription(data.description || "");
      setPriority(data.priority || "중간");
      setCategory(data.category || "버그");
      setDeadline(data.deadline ? new Date(data.deadline) : null); // ✅ 날짜 변환
      setStatus(data.status || "할 일");
      setProjectId(data.projectId || "");
    };

    if (passedIssue) {
      applyData(passedIssue);
    } else if (id) {
      const fetchIssue = async () => {
        const docRef = doc(db, "issues", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          applyData(docSnap.data());
        } else {
          alert("이슈를 찾을 수 없습니다.");
          navigate("/projects");
        }
      };
      fetchIssue();
    }
  }, [id, navigate, passedIssue]);

  const validateForm = () => {
    if (!title.trim()) return "제목을 입력해주세요.";
    if (!reporter.trim()) return "작성자 이름을 입력해주세요.";
    if (!description.trim()) return "상세 내용을 입력해주세요.";
    if (!assignee.trim()) return "담당자를 입력해주세요.";
    return null;
  };

  const handleUpdate = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    try {
      const docRef = doc(db, "issues", id!);
      await updateDoc(docRef, {
        title,
        reporter,
        description,
        priority,
        category,
        assignee,
        deadline: deadline ? deadline.toISOString() : null, // ✅ 저장 포맷
        status,
      });

      alert("이슈가 성공적으로 수정되었습니다.");
      navigate(`/projects/${projectId}/issues`);
    } catch (error) {
      console.error("이슈 수정 실패: ", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <RegisterContainer>
      <RegisterBox>
        <RegisterTitle>이슈 수정</RegisterTitle>
        <Form>
          <Input
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="작성자"
            value={reporter}
            onChange={(e) => setReporter(e.target.value)}
          />
          <Input
            placeholder="담당자"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          />
          <TextArea
            placeholder="상세 내용"
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

          {/* ✅ DatePicker 적용 */}
          <StyledDatePicker
            selected={deadline}
            onChange={(date: Date | null) => setDeadline(date)}
            placeholderText="마감일을 선택하세요"
            dateFormat="yyyy-MM-dd"
            minDate={new Date()} // 🔒 오늘 이전은 비활성화
          />

          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="할 일">할 일</option>
            <option value="진행 중">진행 중</option>
            <option value="완료">완료</option>
          </Select>

          <ButtonGroup>
            <CancelButton
              onClick={() => navigate(`/projects/${projectId}/issues`)}
            >
              취소
            </CancelButton>
            <RegisterButton type="button" onClick={handleUpdate}>
              저장
            </RegisterButton>
          </ButtonGroup>
        </Form>
      </RegisterBox>
    </RegisterContainer>
  );
}

export default IssueEdit;
