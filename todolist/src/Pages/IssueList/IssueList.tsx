import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Timestamp,
} from "firebase/firestore";
import IssueDetailModal from "./IssueDetailModal";
import { Circles } from "react-loader-spinner";
import { logActivity } from "../../utils/activity";
import { useProjectView } from "../../context/ProjectViewContext";

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
  projectId?: string;
}
interface Comment {
  id: string;
  text: string;
  createdAt: string;
  authorId: string;
}

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
  const { viewMode, setViewMode, workflow } = useProjectView();
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);
  const [projectMembers, setProjectMembers] = useState<string[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const defaultStatus = workflow[0] ?? "할 일";
  const finalStatus = workflow[workflow.length - 1] ?? defaultStatus;

  useEffect(() => {
    if (!projectId) return;
    const projectRef = doc(db, "projects", projectId);
    const unsubscribe = onSnapshot(projectRef, (snapshot) => {
      const data = snapshot.data() as
        | { name?: string; userId?: string; memberIds?: string[] }
        | undefined;
      if (!data) return;
      const participantSet = new Set<string>();
      if (data.userId) participantSet.add(data.userId);
      (data.memberIds ?? []).forEach((memberId) => participantSet.add(memberId));
      if (auth.currentUser?.uid) {
        participantSet.add(auth.currentUser.uid);
      }
      setProjectMembers(Array.from(participantSet));
      setProjectName(data.name ?? "");
    });

    return () => unsubscribe();
  }, [projectId]);

  const normalizeStatus = useCallback(
    (status?: string): string => {
      const fallback = workflow[0] ?? "할 일";
      if (status && workflow.includes(status)) {
        return status;
      }
      return fallback;
    },
    [workflow]
  );

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

  useEffect(() => {
    if (statusFilter !== "전체" && !workflow.includes(statusFilter)) {
      setStatusFilter("전체");
    }
  }, [workflow, statusFilter]);

  const handleCardClick = (issue: Issue) => setSelectedIssue(issue);
  const handleCloseModal = () => setSelectedIssue(null);
  const handleEditIssue = (id: string, issue: Issue) => {
    navigate(`/edit/${id}`, { state: issue });
  };
  const handleDeleteIssue = async (id: string) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    const issueToDelete = issues.find((issue) => issue.id === id);
    await deleteDoc(doc(db, "issues", id));
    setIssues((prev) => prev.filter((i) => i.id !== id));
    setSelectedIssue(null);

    const currentUser = auth.currentUser;
    if (projectId && currentUser) {
      const actorName = currentUser.displayName || currentUser.email || "사용자";
      await logActivity({
        projectId,
        issueId: id,
        type: "issue_deleted",
        message: `${actorName}님이 "${
          issueToDelete?.title ?? "이슈"
        }" 이슈를 삭제했습니다.`,
        actorId: currentUser.uid,
        actorEmail: currentUser.email,
        actorName,
        targetUserIds: projectMembers,
        metadata: {
          issueTitle: issueToDelete?.title ?? null,
        },
      });
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: string,
    previousStatus?: string
  ) => {
    const issue = issues.find((item) => item.id === id);
    const fromStatus = previousStatus ?? normalizeStatus(issue?.status);
    if (fromStatus === newStatus) {
      return;
    }

    setIssues((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
    setSelectedIssue((prev) =>
      prev && prev.id === id ? { ...prev, status: newStatus } : prev
    );
    try {
      const updates: { status: string; completedAt?: Timestamp | null } = {
        status: newStatus,
      };
      if (newStatus === finalStatus) {
        updates.completedAt = Timestamp.now();
      } else if (fromStatus === finalStatus) {
        updates.completedAt = null;
      }

      await updateDoc(doc(db, "issues", id), updates);
      const currentUser = auth.currentUser;
      if (projectId && currentUser) {
        const actorName = currentUser.displayName || currentUser.email || "사용자";
        await logActivity({
          projectId,
          issueId: id,
          type: "issue_status_changed",
          message: `${actorName}님이 "${
            issue?.title ?? "이슈"
          }" 상태를 ${fromStatus}에서 ${newStatus}(으)로 변경했습니다.`,
          actorId: currentUser.uid,
          actorEmail: currentUser.email,
          actorName,
          targetUserIds: projectMembers,
          metadata: {
            from: fromStatus,
            to: newStatus,
            projectName,
          },
        });
      }
    } catch (error) {
      console.error("이슈 상태 변경 실패:", error);
    }
  };

  const handleDropOnColumn = async (status: string) => {
    if (!draggedIssueId) return;
    const draggedIssue = issues.find((issue) => issue.id === draggedIssueId);
    if (!draggedIssue) {
      setDraggedIssueId(null);
      setDragOverStatus(null);
      return;
    }
    const prevStatus = normalizeStatus(draggedIssue.status);
    await handleStatusChange(draggedIssueId, status, prevStatus);
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
        const normalizedStatus = normalizeStatus(status);
        const matchesStatus =
          statusFilter === "전체" || normalizedStatus === statusFilter;
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
  }, [
    issues,
    searchInput,
    statusFilter,
    tagFilter,
    sortOrder,
    normalizeStatus,
  ]);

  const groupedIssues = useMemo(() => {
    const base = workflow.reduce<Record<string, Issue[]>>((acc, status) => {
      acc[status] = [];
      return acc;
    }, {});

    filtered.forEach((issue) => {
      const status = normalizeStatus(issue.status);
      if (!base[status]) {
        base[status] = [];
      }
      base[status].push(issue);
    });

    return base;
  }, [filtered, workflow, normalizeStatus]);

  const progress =
    issues.length === 0
      ? 0
      : (issues.filter((i) => normalizeStatus(i.status) === finalStatus).length /
          issues.length) *
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
          {workflow.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
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
          {(workflow.length ? workflow : [defaultStatus]).map((status) => (
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
                    <KanbanCount>
                      {(groupedIssues[status]?.length ?? 0)}건
                    </KanbanCount>
                  </KanbanHeader>
                  <KanbanList>
                    {(groupedIssues[status]?.length ?? 0) === 0 ? (
                      <KanbanEmpty>이슈가 없습니다.</KanbanEmpty>
                    ) : (
                      (groupedIssues[status] ?? []).map((issue) => (
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
                          <StatusBadge status={normalizeStatus(issue.status)}>
                            {normalizeStatus(issue.status)}
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
                        <StatusBadge status={normalizeStatus(issue.status)}>
                          {normalizeStatus(issue.status)}
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
          projectMembers={projectMembers}
          onStatusChange={(nextStatus, previousStatus) =>
            handleStatusChange(selectedIssue.id, nextStatus, previousStatus)
          }
        />
      )}
    </Container>
  );
}

export default IssueList;
