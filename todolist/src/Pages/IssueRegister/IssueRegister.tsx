import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  RegisterContainer,
  RegisterBox,
  AccentBar,
  RegisterHeader,
  HeaderTop,
  RegisterTitle,
  RegisterSubtitle,
  ProjectBadge,
  MetaBar,
  MetaItem,
  MetaLabel,
  MetaValue,
  PriorityBadge,
  CategoryBadge,
  Form,
  SectionTitle,
  FieldStack,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  Input,
  TextArea,
  Select as StyledSelect,
  Divider,
  TagWrapper,
  TagHint,
  TagList,
  EmptyTag,
  Tag,
  TagInput,
  FormFooter,
  FooterNote,
  ButtonGroup,
  RegisterButton,
  CancelButton,
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
      backgroundColor: "rgba(248, 250, 252, 0.9)",
      borderColor: state.isFocused ? "#6366f1" : "rgba(148, 163, 184, 0.5)",
      boxShadow: state.isFocused
        ? "0 0 0 4px rgba(99, 102, 241, 0.15)"
        : "none",
      borderRadius: 12,
      minHeight: "48px",
      paddingLeft: "2px",
      transition: "border 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        borderColor: "#6366f1",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "rgba(99, 102, 241, 0.08)" : "#fff",
      color: "#1f2937",
      padding: "10px 14px",
      fontSize: "14px",
      cursor: "pointer",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#1f2937",
      fontWeight: 600,
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "14px",
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: 12,
      boxShadow: "0 18px 32px rgba(15, 23, 42, 0.12)",
      zIndex: 6,
      overflow: "hidden",
    }),
    input: (provided: any) => ({
      ...provided,
      color: "#1f2937",
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

  const formattedDeadline = deadline
    ? new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(deadline)
    : "-";

  const deadlineBadge = (() => {
    if (!deadline) return "-";
    const diff = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "지연됨";
    if (diff === 0) return "오늘 마감";
    if (diff === 1) return "D-1";
    return `D-${diff}`;
  })();

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
        <AccentBar />
        <RegisterHeader>
          <HeaderTop>
            <div>
              <RegisterTitle>이슈 등록</RegisterTitle>
              <RegisterSubtitle>
                팀원들이 빠르게 이해할 수 있도록 핵심 정보와 맥락을 함께 입력해 주세요.
              </RegisterSubtitle>
            </div>
            {projectName && (
              <ProjectBadge>프로젝트 · {projectName}</ProjectBadge>
            )}
          </HeaderTop>
          <MetaBar>
            <MetaItem>
              <MetaLabel>생성 시각</MetaLabel>
              <MetaValue>🕒 {createdAtFormatted || "-"}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>예상 마감</MetaLabel>
              <MetaValue>
                📅 {formattedDeadline}
                {deadline && <span>({deadlineBadge})</span>}
              </MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>우선순위</MetaLabel>
              <MetaValue>
                <PriorityBadge level={priority as "높음" | "중간" | "낮음"}>
                  ⚡ {priority}
                </PriorityBadge>
              </MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>카테고리</MetaLabel>
              <MetaValue>
                <CategoryBadge>🏷️ {category}</CategoryBadge>
              </MetaValue>
            </MetaItem>
          </MetaBar>
        </RegisterHeader>

        <Form>
          <div>
            <SectionTitle>기본 정보</SectionTitle>
            <FieldStack>
              <FieldGroup>
                <FieldLabel htmlFor="issue-title">이슈 제목</FieldLabel>
                <FieldDescription>
                  명확한 제목은 검색과 협업에 큰 도움이 됩니다.
                </FieldDescription>
                <Input
                  id="issue-title"
                  placeholder="예) 결제 완료 후 확인 페이지가 표시되지 않음"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="issue-reporter">작성자</FieldLabel>
                <FieldDescription>
                  로그인된 계정으로 자동 입력되며 수정할 수 없습니다.
                </FieldDescription>
                <Input
                  id="issue-reporter"
                  placeholder="작성자 이름을 입력하세요"
                  value={reporter}
                  readOnly
                  disabled
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>담당자</FieldLabel>
                <FieldDescription>
                  이슈 해결을 책임질 팀원을 선택하세요.
                </FieldDescription>
                <Select
                  placeholder="담당자를 검색하세요"
                  options={userSuggestions}
                  value={assignee}
                  onChange={(value) => setAssignee(value)}
                  styles={customSelectStyles}
                  isClearable
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="issue-description">상세 내용</FieldLabel>
                <FieldDescription>
                  재현 경로, 기대 결과, 참고 자료 등을 구체적으로 남겨주세요.
                </FieldDescription>
                <TextArea
                  id="issue-description"
                  placeholder={`예)\n1. 결제 버튼 클릭\n2. 결제 완료 팝업 확인\n3. 브라우저가 흰 화면에서 멈춤`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FieldGroup>
            </FieldStack>
          </div>

          <Divider />

          <div>
            <SectionTitle>이슈 속성</SectionTitle>
            <FieldStack>
              <FieldGroup>
                <FieldLabel htmlFor="issue-priority">우선순위</FieldLabel>
                <FieldDescription>
                  마감일은 우선순위에 맞춰 자동 제안됩니다.
                </FieldDescription>
                <StyledSelect
                  id="issue-priority"
                  value={priority}
                  onChange={(e) =>
                    setPriority((e.target as HTMLSelectElement).value)
                  }
                >
                  <option value="높음">높음</option>
                  <option value="중간">중간</option>
                  <option value="낮음">낮음</option>
                </StyledSelect>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="issue-category">카테고리</FieldLabel>
                <FieldDescription>
                  이슈 유형을 분류하면 필터링이 쉬워집니다.
                </FieldDescription>
                <StyledSelect
                  id="issue-category"
                  value={category}
                  onChange={(e) =>
                    setCategory((e.target as HTMLSelectElement).value)
                  }
                >
                  <option value="버그">버그</option>
                  <option value="기능 요청">기능 요청</option>
                  <option value="UI 개선">UI 개선</option>
                  <option value="성능 개선">성능 개선</option>
                  <option value="기타">기타</option>
                </StyledSelect>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="issue-created-at">작성 시간</FieldLabel>
                <FieldDescription>등록 시각은 기록용으로 보관됩니다.</FieldDescription>
                <Input
                  id="issue-created-at"
                  value={createdAtFormatted}
                  disabled
                  readOnly
                />
              </FieldGroup>
            </FieldStack>
          </div>

          <Divider />

          <div>
            <SectionTitle>태그</SectionTitle>
            <FieldStack>
              <FieldGroup>
                <FieldLabel htmlFor="issue-tags">태그 목록</FieldLabel>
                <FieldDescription>
                  태그로 유사한 이슈를 빠르게 찾아보세요.
                </FieldDescription>
                <TagWrapper>
                  <TagList>
                    {tags.length > 0 ? (
                      tags.map((tag, idx) => (
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
                      ))
                    ) : (
                      <EmptyTag>아직 추가된 태그가 없습니다.</EmptyTag>
                    )}
                  </TagList>
                  <TagInput
                    id="issue-tags"
                    placeholder="태그를 입력 후 쉼표(,) 또는 엔터를 눌러 추가하세요"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                  />
                  <TagHint>예: 긴급, API, 고객문의</TagHint>
                </TagWrapper>
              </FieldGroup>
            </FieldStack>
          </div>

          <FormFooter>
            <FooterNote>등록 전에 필수 항목이 모두 채워졌는지 확인해주세요.</FooterNote>
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
          </FormFooter>
        </Form>
        <ToastContainer position="bottom-center" autoClose={2000} />
      </RegisterBox>
    </RegisterContainer>
  );
}

export default IssueRegister;
