import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import {
  Container,
  Input,
  List,
  RowBox,
  Title,
  Todo,
  EditDiv,
  Button,
} from "./IssueList.styled";
import { useNavigate } from "react-router-dom";

function IssueList() {
  interface Issue {
    id: number;
    title: string;
    description: string;
  }

  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("issues") || "[]");
      setIssues(data);
    } catch (e) {
      console.error("Failed to load issues:", e);
    }
  }, []);

  const handleSearch = () => {
    setSearchKeyword(searchInput);

    const tempFiltered = issues.filter(
      ({ title, description }) =>
        title.toLowerCase().includes(searchInput.toLowerCase()) ||
        description.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (tempFiltered.length === 0) {
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
      <Title>이슈 목록</Title>
      <RowBox>
        <Input
          placeholder="이슈 제목 또는 설명"
          value={searchInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchInput(e.target.value)
          }
        />
        <Button onClick={handleSearch}>검색</Button>
        <Button onClick={() => navigate("/register")}>등록</Button>
      </RowBox>
      <List>
        {filteredIssues.map(({ id, title, description }) => (
          <Todo key={id}>
            <EditDiv>
              <strong>{title}</strong>
              <p>{description}</p>
            </EditDiv>
          </Todo>
        ))}
      </List>
    </Container>
  );
}

export default IssueList;
