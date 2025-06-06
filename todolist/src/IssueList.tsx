import React, { useEffect, useState } from "react";
import {
  Container,
  List,
  Title,
  Todo,
  EditDiv,
  NoSelect,
  HeaderRow,
  SearchRow,
  StyledLogoutButton,
  StyledRegisterButton,
  StyledSearchButton,
  SearchInput,
  SortSelect,
  CardWrapper,
  StatusBadge,
  CardTitle,
  CardDescription,
  CardMeta,
  PaginationWrapper,
  PageButton,
} from "./IssueList.styled";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import IssueDetailModal from "./IssueDetailModal";

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
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("기본순");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;
  const navigate = useNavigate();

  const handleCardClick = (issue: Issue) => setSelectedIssue(issue);
  const handleCloseModal = () => setSelectedIssue(null);
  const handleEditIssue = (id: string) => navigate(`/edit/${id}`);

  const handleDeleteIssue = async (id: string) => {
    const ok = window.confirm("정말 이 이슈를 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "issues", id));
      setIssues((prev) => prev.filter((issue) => issue.id !== id));
      setSelectedIssue(null);
    } catch (error) {
      console.error("삭제 중 오류:", error);
      alert("이슈 삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const q = query(collection(db, "issues"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Issue[];

        setIssues(data);
      } catch (e) {
        console.error("이슈 불러오기 실패:", e);
      }
    };

    fetchIssues();
  }, []);

  const handleSearch = () => {
    setSearchKeyword(searchInput.trim());
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const getPriorityValue = (priority: string): number => {
    if (priority === "높음") return 3;
    if (priority === "중간") return 2;
    if (priority === "낮음") return 1;
    return 0;
  };

  const filteredIssues = issues
    .filter(
      ({ title, description }) =>
        title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        description.toLowerCase().includes(searchKeyword.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "우선순위 높은순")
        return getPriorityValue(b.priority) - getPriorityValue(a.priority);
      if (sortOrder === "우선순위 낮은순")
        return getPriorityValue(a.priority) - getPriorityValue(b.priority);
      return 0;
    });

  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const visibleIssues = filteredIssues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container>
      <HeaderRow>
        <Title>이슈 목록</Title>
        <StyledLogoutButton onClick={() => signOut(auth)}>
          로그아웃
        </StyledLogoutButton>
      </HeaderRow>

      <SearchRow>
        <SearchInput
          placeholder="이슈 제목 또는 설명"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <StyledSearchButton onClick={handleSearch}>검색</StyledSearchButton>
        <StyledRegisterButton onClick={() => navigate("/register")}>
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
      </SearchRow>

      {filteredIssues.length === 0 ? (
        <p style={{ color: "#ccc", textAlign: "center", marginTop: "40px" }}>
          등록된 이슈가 없습니다.
        </p>
      ) : (
        <>
          <List>
            {visibleIssues.map((issue) => (
              <Todo key={issue.id} onClick={() => handleCardClick(issue)}>
                <NoSelect>
                  <CardWrapper>
                    <StatusBadge status={issue.status || "할 일"}>
                      {issue.status || "할 일"}
                    </StatusBadge>
                    <CardTitle>{issue.title}</CardTitle>
                    <CardDescription>{issue.description}</CardDescription>
                    <CardMeta>우선순위: {issue.priority}</CardMeta>
                  </CardWrapper>
                </NoSelect>
              </Todo>
            ))}
          </List>

          <PaginationWrapper>
            <PageButton
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              이전
            </PageButton>

            {[...Array(totalPages)].map((_, i) => (
              <PageButton
                key={i}
                active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PageButton>
            ))}

            <PageButton
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              다음
            </PageButton>
          </PaginationWrapper>
        </>
      )}

      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={handleCloseModal}
          onEdit={handleEditIssue}
          onDelete={handleDeleteIssue}
        />
      )}
    </Container>
  );
}

export default IssueList;
