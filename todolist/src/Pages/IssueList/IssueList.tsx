import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  List,
  Title,
  Todo,
  DeadlineTag,
  NoSelect,
  TopButtonRow,
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
  ListBackground,
  CategoryTag,
  PriorityTag,
  ScrollableListWrapper,
  BackButton,
  ProgressContainer,
  ProgressBar,
  Initial,
  CommentCount,
  Tag,
  OutlineButton,
  ViewToggleButton,
  BoardWrapper,
  KanbanContainer,
  KanbanColumn,
  KanbanHeader,
  KanbanTitle,
  KanbanCount,
  KanbanList,
  KanbanCard,
  KanbanEmpty,
} from "./IssueList.styled";
import styled from "styled-components";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../Firebase/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  where,
  updateDoc,
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
  assignee?: string;
  deadline?: string;
  createdAt?: any;
  status?: string;
  comments?: Comment[];
  tags?: string[];
}
interface Comment {
  id: string;
  text: string;
  createdAt: string;
  authorId: string;
}

const STATUS_ORDER = ["할 일", "진행 중", "완료"] as const;
type CoreStatus = (typeof STATUS_ORDER)[number];

function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("기본순");
  const [statusFilter, setStatusFilter] = useState<string>("전체");
  const [tagFilter, setTagFilter] = useState<string>("전체");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const LOAD_INCREMENT = 10;
  const [visibleCount, setVisibleCount] = useState(LOAD_INCREMENT);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<CoreStatus | null>(null);
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const normalizeStatus = (status?: string): CoreStatus => {
    if (STATUS_ORDER.includes(status as CoreStatus)) {
      return status as CoreStatus;
    }
    return "할 일";
  };

  useEffect(() => {
    setIsLoading(true);

    if (!projectId) {
      console.warn("projectId가 없습니다.");
      setIssues([]);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, "issues"),
      where("projectId", "==", projectId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Issue[];
        setIssues(data);
        setVisibleCount(LOAD_INCREMENT);
        setIsLoading(false);
      },
      (error) => {
        console.error("이슈 불러오기 실패:", error);
        setIssues([]);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [projectId]);

  useEffect(() => {
    setVisibleCount(LOAD_INCREMENT);
  }, [searchInput, sortOrder, statusFilter, tagFilter, viewMode]);

  useEffect(() => {
    if (viewMode === "kanban" && statusFilter !== "전체") {
      setStatusFilter("전체");
    }
  }, [viewMode, statusFilter]);

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

  const handleStatusChange = async (id: string, newStatus: CoreStatus) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, status: newStatus } : issue
      )
    );
    try {
      await updateDoc(doc(db, "issues", id), { status: newStatus });
    } catch (error) {
      console.error("이슈 상태 변경 실패:", error);
    }
  };

  const handleDropOnColumn = async (status: CoreStatus) => {
    if (!draggedIssueId) return;
    await handleStatusChange(draggedIssueId, status);
    setDraggedIssueId(null);
    setDragOverStatus(null);
  };

  const getDeadlineStatus = (deadline?: string) => {
    if (!deadline) return "";
    const today = new Date();
    const due = new Date(deadline);
    const diff = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff > 0) return diff <= 3 ? `D-${diff} 임박` : `D-${diff}`;
    if (diff === 0) return "오늘 마감";
    return "마감 지남";
  };

  const getPriorityValue = (p: string) =>
    p === "높음" ? 3 : p === "중간" ? 2 : 1;

  const filtered = useMemo(() => {
    return issues
      .filter(({ title, description, status, tags }) => {
        const matchesSearch =
          title.toLowerCase().includes(searchInput.toLowerCase()) ||
          description.toLowerCase().includes(searchInput.toLowerCase());
        const matchesStatus =
          statusFilter === "전체" || status === statusFilter;
        const matchesTag =
          tagFilter === "전체" || (tags && tags.includes(tagFilter));
        return matchesSearch && matchesStatus && matchesTag;
      })
      .sort((a, b) => {
        if (sortOrder === "우선순위 높은순")
          return getPriorityValue(b.priority) - getPriorityValue(a.priority);
        if (sortOrder === "우선순위 낮은순")
          return getPriorityValue(a.priority) - getPriorityValue(b.priority);
        return 0;
      });
  }, [issues, searchInput, statusFilter, tagFilter, sortOrder]);

  const groupedIssues = useMemo(() => {
    const map: Record<CoreStatus, Issue[]> = {
      "할 일": [],
      "진행 중": [],
      "완료": [],
    };
    filtered.forEach((issue) => {
      const status = normalizeStatus(issue.status);
      map[status].push(issue);
    });
    return map;
  }, [filtered]);

  const progress =
    issues.length === 0
      ? 0
      : (issues.filter((i) => i.status === "완료").length / issues.length) *
        100;

  const allTags = Array.from(new Set(issues.flatMap((i) => i.tags || [])));

  // Infinite scroll: load more when the observer element enters view
  useEffect(() => {
    if (viewMode !== "list") return;
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) =>
          Math.min(prev + LOAD_INCREMENT, filtered.length)
        );
      }
    });
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [filtered.length, viewMode]);

  const visibleIssues = filtered.slice(0, visibleCount);
  const isKanbanView = viewMode === "kanban";

  return (
    <Container>
      <Title>이슈 목록</Title>
      <TopButtonRow>
        <ViewToggleButton
          onClick={() =>
            setViewMode((prev) => (prev === "list" ? "kanban" : "list"))
          }
        >
          {isKanbanView ? "리스트 보기" : "칸반 보기"}
        </ViewToggleButton>
        <div style={{ display: "flex", gap: "10px" }}>
          <BackButton onClick={() => navigate("/projects")}>
            <ArrowLeft size={16} /> 프로젝트 목록
          </BackButton>
          <StyledLogoutButton onClick={() => signOut(auth)}>
            로그아웃
          </StyledLogoutButton>
        </div>
      </TopButtonRow>

      <SearchRow>
        <SearchInput
          placeholder="제목 또는 설명 검색"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
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
          disabled={isKanbanView}
        >
          <option value="전체">전체</option>
          <option value="할 일">할 일</option>
          <option value="진행 중">진행 중</option>
          <option value="완료">완료</option>
        </SortSelect>
        <SortSelect
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        >
          <option value="전체">전체 태그</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              #{tag}
            </option>
          ))}
        </SortSelect>
        <StyledRegisterButton
          onClick={() => navigate(`/projects/${projectId}/register`)}
        >
          등록
        </StyledRegisterButton>
      </SearchRow>

      <ProgressContainer>
        <ProgressBar percent={progress} />
      </ProgressContainer>

      {isKanbanView ? (
        <BoardWrapper>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 40,
              }}
            >
              <Circles height="80" width="80" color="#4fa94d" />
            </div>
          ) : filtered.length === 0 ? (
            <KanbanEmpty>등록된 이슈가 없습니다.</KanbanEmpty>
          ) : (
            <KanbanContainer>
              {STATUS_ORDER.map((status) => (
                <KanbanColumn
                  key={status}
                  isActive={dragOverStatus === status}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={() => handleDropOnColumn(status)}
                  onDragEnter={() => {
                    if (draggedIssueId) {
                      setDragOverStatus(status);
                    }
                  }}
                  onDragLeave={() => {
                    setDragOverStatus((prev) => (prev === status ? null : prev));
                  }}
                >
                  <KanbanHeader>
                    <KanbanTitle>{status}</KanbanTitle>
                    <KanbanCount>{groupedIssues[status].length}건</KanbanCount>
                  </KanbanHeader>
                  <KanbanList>
                    {groupedIssues[status].length === 0 ? (
                      <KanbanEmpty>이슈가 없습니다.</KanbanEmpty>
                    ) : (
                      groupedIssues[status].map((issue) => (
                        <KanbanCard
                          key={issue.id}
                          draggable
                          onDragStart={() => setDraggedIssueId(issue.id)}
                          onDragEnd={() => {
                            setDraggedIssueId(null);
                            setDragOverStatus(null);
                          }}
                          onClick={() => handleCardClick(issue)}
                        >
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
                            {issue.tags?.map((tag, idx) => (
                              <Tag key={idx}>#{tag}</Tag>
                            ))}
                          </CardMeta>
                          {issue.deadline && (
                            <DeadlineTag status={getDeadlineStatus(issue.deadline)}>
                              {getDeadlineStatus(issue.deadline)}
                            </DeadlineTag>
                          )}
                        </KanbanCard>
                      ))
                    )}
                  </KanbanList>
                </KanbanColumn>
              ))}
            </KanbanContainer>
          )}
        </BoardWrapper>
      ) : (
        <ListBackground>
          <ScrollableListWrapper>
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 60,
                }}
              >
                <Circles height="80" width="80" color="#4fa94d" />
              </div>
            ) : filtered.length === 0 ? (
              <p
                style={{
                  color: "#ccc",
                  textAlign: "center",
                  marginTop: "40px",
                }}
              >
                등록된 이슈가 없습니다.
              </p>
            ) : (
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
                        <CardMeta>
                          {issue.category && (
                            <CategoryTag>{issue.category}</CategoryTag>
                          )}
                          <PriorityTag priority={issue.priority}>
                            {issue.priority}
                          </PriorityTag>
                          {issue.tags?.map((tag, idx) => (
                            <Tag key={idx}>#{tag}</Tag>
                          ))}
                          {issue.assignee && (
                            <Initial title={issue.assignee}>
                              {issue.assignee.charAt(0).toUpperCase()}
                            </Initial>
                          )}
                          <CommentCount>
                            💬 {issue.comments?.length || 0}
                          </CommentCount>
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
          {visibleCount < filtered.length && (
            <div ref={loadMoreRef} style={{ textAlign: "center", marginTop: 20 }}>
              <OutlineButton
                onClick={() => setVisibleCount((v) => v + LOAD_INCREMENT)}
              >
                더 보기
              </OutlineButton>
            </div>
          )}
        </ListBackground>
      )}

      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={handleCloseModal}
          onEdit={(id) => handleEditIssue(id, selectedIssue)}
          onDelete={handleDeleteIssue}
        />
      )}
    </Container>
  );
}

export default IssueList;
