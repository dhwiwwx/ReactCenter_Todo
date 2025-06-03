import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import {
  Container,
  Input,
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
} from "./IssueList.styled";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { db } from "./firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface Issue {
  id: string;
  title: string;
  description: string;
  priority: string;
}

function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("기본순");

  const navigate = useNavigate();

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
  };

  const getPriorityValue = (priority: string): number => {
    if (priority === "높음") return 3;
    if (priority === "중간") return 2;
    if (priority === "낮음") return 1;
    return 0;
  };

  const sortByPriority = (a: Issue, b: Issue): number =>
    getPriorityValue(b.priority) - getPriorityValue(a.priority);

  const sortByPriorityAsc = (a: Issue, b: Issue): number =>
    getPriorityValue(a.priority) - getPriorityValue(b.priority);

  const filteredIssues = issues
    .filter(
      ({ title, description }) =>
        title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        description.toLowerCase().includes(searchKeyword.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "우선순위 높은순") return sortByPriority(a, b);
      if (sortOrder === "우선순위 낮은순") return sortByPriorityAsc(a, b);
      return 0;
    });

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
        <List>
          {filteredIssues.map(({ id, title, description, priority }) => (
            <Todo key={id}>
              <NoSelect>
                <EditDiv>
                  <strong>{title}</strong>
                  <p>{description}</p>
                  <p>우선순위: {priority}</p>
                </EditDiv>
              </NoSelect>
            </Todo>
          ))}
        </List>
      )}
    </Container>
  );
}

export default IssueList;
