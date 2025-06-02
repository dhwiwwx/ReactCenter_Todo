import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import {
  Container,
  Input,
  List,
  Title,
  Todo,
  EditDiv,
  Button,
  NoSelect,       
  HorizontalRow,  
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

    const results = issues.filter(
      ({ title, description }) =>
        title.toLowerCase().includes(searchInput.toLowerCase()) ||
        description.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (results.length === 0) {
      alert("검색 결과가 없습니다.");
    }
  };

  const filteredIssues = issues.filter(
    ({ title, description }) =>
      title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      description.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <Container>
      <HorizontalRow>
      <Title>이슈 목록</Title>
      <Button onClick={() => signOut(auth)}>로그아웃</Button>
      </HorizontalRow>
      {/* 가로 정렬 적용 */}
      <HorizontalRow>
        <Input
          placeholder="이슈 제목 또는 설명"
          value={searchInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchInput(e.target.value)
          }
        />
        <Button onClick={handleSearch}>검색</Button>
        <Button onClick={() => navigate("/register")}>등록</Button>
      </HorizontalRow>

      <List>
        {filteredIssues.map(({ id, title, description, priority }) => (
          <Todo key={id}>
            {/* 텍스트 드래그 방지 적용 */}
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
    </Container>
  );
}

export default IssueList;
