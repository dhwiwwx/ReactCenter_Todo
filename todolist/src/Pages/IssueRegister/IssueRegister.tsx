import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  RegisterContainer,
  RegisterBox,
  RegisterTitle,
  Form,
  Input,
  TextArea,
  Select as StyledSelect,
  ButtonGroup,
  RegisterButton,
  CancelButton,
  TagList,
  Tag,
  TagInput,
  TagWrapper,
} from "./IssueRegister.styled";
import { db, auth } from "../../Firebase/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logActivity } from "../../utils/activity";

interface OptionType {
  value: string;
  label: string;
}

function IssueRegister() {
  const [title, setTitle] = useState<string>("");
  const [reporter, setReporter] = useState<string>("");
  const [assignee, setAssignee] = useState<OptionType | null>(null);
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<string>("중간");
  const [category, setCategory] = useState<string>("버그");
  const { projectId } = useParams<{ projectId: string }>();

  const [createdAtFormatted, setCreatedAtFormatted] = useState<string>("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [userSuggestions, setUserSuggestions] = useState<OptionType[]>([]);
  const [projectMembers, setProjectMembers] = useState<string[]>([]);
  const [projectName, setProjectName] = useState<string>("");

  const navigate = useNavigate();

  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "#fff",
      borderColor: state.isFocused ? "#6c5ce7" : "#ccc",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(108, 92, 231, 0.2)" : "none",
      borderRadius: 8,
      minHeight: "44px",
      "&:hover": {
        borderColor: "#6c5ce7",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#f1f3f5" : "#fff",
      color: "#222",
      padding: "10px 14px",
      fontSize: "14px",
      cursor: "pointer",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#222",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#aaa",
      fontSize: "14px",
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: 8,
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      zIndex: 5,
    }),
    input: (provided: any) => ({
      ...provided,
      color: "#222",
    }),
  };

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

  useEffect(() => {
    const now = new Date();
    let daysToAdd = 3;
    if (priority === "높음") daysToAdd = 1;
    else if (priority === "중간") daysToAdd = 3;
    else if (priority === "낮음") daysToAdd = 7;

    const newDeadline = new Date(now);
    newDeadline.setDate(now.getDate() + daysToAdd);
    setDeadline(newDeadline);
  }, [priority]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const emails = snapshot.docs.map((doc) => doc.data().email || "");
      setUserSuggestions(emails.map((e) => ({ value: e, label: e })));
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProjectMembers = async () => {
      if (!projectId) return;
      const projectSnap = await getDoc(doc(db, "projects", projectId));
      if (!projectSnap.exists()) return;
      const data = projectSnap.data() as {
        memberIds?: string[];
        userId?: string;
        name?: string;
      };
      const participants = new Set<string>();
      if (data.userId) participants.add(data.userId);
      (data.memberIds ?? []).forEach((memberId) => participants.add(memberId));
      if (auth.currentUser?.uid) participants.add(auth.currentUser.uid);
      setProjectMembers(Array.from(participants));
      setProjectName(data.name ?? "");
    };
    fetchProjectMembers();
  }, [projectId]);

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      if (tagInput.trim()) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const validateForm = () => {
    if (!title.trim()) return "제목을 입력해주세요.";
    if (!reporter.trim()) return "작성자 정보가 없습니다.";
    if (!description.trim()) return "상세 내용을 입력해주세요.";
    if (!assignee) return "담당자를 선택해주세요.";
    if (!deadline) return "마감일이 없습니다.";
    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    if (!projectId) {
      toast.error("프로젝트 정보가 없습니다.");
      return;
    }

    try {
      const currentUser = auth.currentUser;
      const docRef = await addDoc(collection(db, "issues"), {
        title,
        reporter,
        description,
        priority,
        category,
        assignee: assignee?.value,
        tags,
        projectId,
        deadline: deadline?.toISOString(),
        createdAt: Timestamp.now(),
        createdAtFormatted,
        status: "할 일",
      });
      if (currentUser) {
        const actorName = currentUser.displayName || currentUser.email || "사용자";
        await logActivity({
          projectId,
          issueId: docRef.id,
          type: "issue_created",
          message: `${actorName}님이 "${title}" 이슈를 생성했습니다.`,
          actorId: currentUser.uid,
          actorEmail: currentUser.email,
          actorName,
          targetUserIds: projectMembers,
          metadata: {
            priority,
            deadline: deadline?.toISOString() ?? null,
            projectName,
          },
        });
      }
      toast.success("이슈가 성공적으로 등록되었습니다.");
      setTimeout(() => navigate(`/projects/${projectId}/issues`), 1500);
    } catch (error) {
      console.error("이슈 등록 실패: ", error);
      toast.error("이슈 등록 중 오류가 발생했습니다.");
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

          <Select
            placeholder="담당자 선택"
            options={userSuggestions}
            value={assignee}
            onChange={(value) => setAssignee(value)}
            styles={customSelectStyles}
            isClearable
          />

          <TextArea
            placeholder="상세 내용을 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <StyledSelect
            value={priority}
            onChange={(e) => setPriority((e.target as HTMLSelectElement).value)}
          >
            <option value="높음">높음</option>
            <option value="중간">중간</option>
            <option value="낮음">낮음</option>
          </StyledSelect>

          <StyledSelect
            value={category}
            onChange={(e) => setCategory((e.target as HTMLSelectElement).value)}
          >
            <option value="버그">버그</option>
            <option value="기능 요청">기능 요청</option>
            <option value="UI 개선">UI 개선</option>
            <option value="성능 개선">성능 개선</option>
            <option value="기타">기타</option>
          </StyledSelect>

          <Input value={createdAtFormatted} disabled readOnly />

          <TagWrapper>
            <TagList>
              {tags.map((tag, idx) => (
                <Tag key={idx}>
                  #{tag}
                  <span
                    onClick={() => {
                      const newTags = [...tags];
                      newTags.splice(idx, 1);
                      setTags(newTags);
                    }}
                  >
                    ×
                  </span>
                </Tag>
              ))}
            </TagList>
            <TagInput
              placeholder="태그를 입력 후 쉼표(,) 또는 엔터"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
            />
          </TagWrapper>

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
        <ToastContainer position="bottom-center" autoClose={2000} />
      </RegisterBox>
    </RegisterContainer>
  );
}

export default IssueRegister;
