import React, { useEffect, useState } from "react";
import {
  Container,
  List,
  Title,
  Todo,
  DeadlineTag,
  NoSelect,
  HeaderRow,
  SearchRow,
  StyledLogoutButton,
  StyledRegisterButton,
  SearchInput,
  SortSelect,
  CardWrapper,
  StatusBadge,
  CardTitle,
  CardDescription,
  CardMeta,
  CategoryTag,
  PriorityTag,
  ScrollableListWrapper,
  BackButton,
} from "./IssueList.styled";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../Firebase/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  where,
} from "firebase/firestore";
import IssueDetailModal from "./IssueDetailModal";
import { Circles } from "react-loader-spinner";

interface Issue {
  id: string;
  title: string;
  description: string;
  priority: string;
  category?: string;
  reporter?: string;
  deadline?: string;
  createdAt?: any;
  status?: string;
}

function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("기본순");
  const [statusFilter, setStatusFilter] = useState<string>("전체");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const fetchIssues = async () => {
    try {
      setIsLoading(true);

      if (!projectId) {
        console.warn("projectId가 없습니다.");
        setIssues([]);
        return;
      }

      const q = query(
        collection(db, "issues"),
        where("projectId", "==", projectId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Issue[];

      setIssues(data);
    } catch (e) {
      console.error("이슈 불러오기 실패:", e);
      setIssues([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [projectId]);

  const handleCardClick = (issue: Issue) => setSelectedIssue(issue);
  const handleCloseModal = () => setSelectedIssue(null);
  const handleEditIssue = (id: string, issue: Issue) => {
    navigate(`/edit/${id}`, { state: issue });
  };
  const handleDeleteIssue = async (id: string) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    await deleteDoc(doc(db, "issues", id));
    setIssues((prev) => prev.filter((i) => i.id !== id));
    setSelectedIssue(null);
  };

  const getDeadlineStatus = (deadline?: string) => {
    if (!deadline) return "";
    const today = new Date();
    const due = new Date(deadline);
    const diff = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff > 0) return `D-${diff}`;
    if (diff === 0) return "오늘 마감";
    return "마감 지남";
  };

  const getPriorityValue = (p: string) =>
    p === "높음" ? 3 : p === "중간" ? 2 : 1;

  const filtered = issues
    .filter(({ title, description, status }) => {
      const matchesSearch =
        title.toLowerCase().includes(searchInput.toLowerCase()) ||
        description.toLowerCase().includes(searchInput.toLowerCase());
      const matchesStatus = statusFilter === "전체" || status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOrder === "우선순위 높은순")
        return getPriorityValue(b.priority) - getPriorityValue(a.priority);
      if (sortOrder === "우선순위 낮은순")
        return getPriorityValue(a.priority) - getPriorityValue(b.priority);
      return 0;
    });

  return (
    <Container>
      <HeaderRow>
        <Title>이슈 목록</Title>
        <div style={{ display: "flex", gap: "10px" }}>
          <BackButton onClick={() => navigate("/projects")}>
            <ArrowLeft size={16} />
            프로젝트 목록
          </BackButton>
          <StyledLogoutButton onClick={() => signOut(auth)}>
            로그아웃
          </StyledLogoutButton>
        </div>
      </HeaderRow>

      <SearchRow>
        <SearchInput
          placeholder="제목 또는 설명 검색"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <StyledRegisterButton
          onClick={() => navigate(`/projects/${projectId}/register`)}
        >
          등록
        </StyledRegisterButton>
        <SortSelect
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="기본순">기본순</option>
          <option value="우선순위 높은순">우선순위 높은순</option>
          <option value="우선순위 낮은순">우선순위 낮은순</option>
        </SortSelect>
        <SortSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="전체">전체</option>
          <option value="할 일">할 일</option>
          <option value="진행 중">진행 중</option>
          <option value="완료">완료</option>
        </SortSelect>
      </SearchRow>

      <ScrollableListWrapper>
        {isLoading ? (
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 60 }}
          >
            <Circles height="80" width="80" color="#4fa94d" />
          </div>
        ) : filtered.length === 0 ? (
          <p style={{ color: "#ccc", textAlign: "center", marginTop: "40px" }}>
            등록된 이슈가 없습니다.
          </p>
        ) : (
          <List>
            {filtered.map((issue) => (
              <Todo key={issue.id} onClick={() => handleCardClick(issue)}>
                <NoSelect>
                  <CardWrapper>
                    <StatusBadge status={issue.status || "할 일"}>
                      {issue.status || "할 일"}
                    </StatusBadge>
                    <CardTitle>{issue.title}</CardTitle>
                    <CardDescription>{issue.description}</CardDescription>
                    <CardMeta>
                      {issue.category && (
                        <CategoryTag>{issue.category}</CategoryTag>
                      )}
                      <PriorityTag priority={issue.priority}>
                        {issue.priority}
                      </PriorityTag>
                    </CardMeta>
                    {issue.deadline && (
                      <DeadlineTag status={getDeadlineStatus(issue.deadline)}>
                        {getDeadlineStatus(issue.deadline)}
                      </DeadlineTag>
                    )}
                  </CardWrapper>
                </NoSelect>
              </Todo>
            ))}
          </List>
        )}
      </ScrollableListWrapper>

      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={handleCloseModal}
          onEdit={(id) => handleEditIssue(id, selectedIssue)}
          onDelete={handleDeleteIssue}
          onStatusChange={fetchIssues}
        />
      )}
    </Container>
  );
}

export default IssueList;
