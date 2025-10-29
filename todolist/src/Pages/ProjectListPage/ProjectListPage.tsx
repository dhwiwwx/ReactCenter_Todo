// 기존 import 유지
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  ProjectList,
  ProjectItem,
  CardGrid,
  CardItem,
  InputRow,
  ProjectInput,
  AddButton,
  DescriptionInput,
  StyledLogoutButton,
  ViewToggleButton,
  ErrorMessage,
  PinnedBar,
  HeaderRow,
  HeaderActions,
  ProjectCount,
  LoadingMessage,
  DashboardSection,
  DashboardHeader,
  DashboardTitle,
  DashboardSubtitle,
  DashboardGrid,
  MetricCard,
  MetricLabel,
  MetricValue,
  MetricCaption,
  DashboardSplit,
  TrendCard,
  TrendTitle,
  TrendList,
  TrendItem,
  TrendLabelRow,
  TrendBar,
  ActivityList,
  ActivityItem,
  ActivityTitle,
  ActivityMeta,
} from "./ProjectList.styled";
import ProjectItemContent from "./ProjectItemContent";
import { db, auth } from "../../Firebase/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import ProjectShareModal from "./ProjectShareModal";
import ConfirmModal from "./ConfirmModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface Project {
  id: string;
  name: string;
  userId?: string;
  memberIds?: string[];
  description?: string;
  issueCount?: number;
  isPinned?: boolean;
  isDeleted?: boolean;
  isArchived?: boolean;
  lastViewedAt?: string;
  order?: number;
  completionRate?: number;
}

const ProjectListPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [search, setSearch] = useState("");
  const [recentProjectId, setRecentProjectId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<
    Record<string, boolean>
  >({});
  const [viewMode, setViewMode] = useState<"list" | "card">(() => {
    return (localStorage.getItem("viewMode") as "list" | "card") || "list";
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{ uid: string; email: string | null }[]>(
    []
  );
  const [shareProjectId, setShareProjectId] = useState<string | null>(null);

  const navigate = useNavigate();

  const totalProjects = projects.length;
  const totalIssues = useMemo(
    () => projects.reduce((acc, project) => acc + (project.issueCount ?? 0), 0),
    [projects]
  );
  const activeProjects = useMemo(
    () => projects.filter((project) => (project.issueCount ?? 0) > 0).length,
    [projects]
  );
  const averageCompletion = useMemo(() => {
    if (projects.length === 0) {
      return 0;
    }
    const sum = projects.reduce(
      (acc, project) => acc + (project.completionRate ?? 0),
      0
    );
    return Math.round(sum / projects.length);
  }, [projects]);

  const pinnedCount = useMemo(
    () => projects.filter((project) => project.isPinned).length,
    [projects]
  );

  const completionLeaders = useMemo(
    () =>
      [...projects]
        .filter((project) => (project.issueCount ?? 0) > 0)
        .sort(
          (a, b) => (b.completionRate ?? 0) - (a.completionRate ?? 0)
        )
        .slice(0, 5),
    [projects]
  );

  const issueLeaders = useMemo(
    () =>
      [...projects]
        .sort((a, b) => (b.issueCount ?? 0) - (a.issueCount ?? 0))
        .slice(0, 5),
    [projects]
  );

  const recentActivity = useMemo(
    () =>
      [...projects]
        .filter((project) => project.lastViewedAt)
        .sort((a, b) => {
          const aTime = a.lastViewedAt
            ? new Date(a.lastViewedAt).getTime()
            : 0;
          const bTime = b.lastViewedAt
            ? new Date(b.lastViewedAt).getTime()
            : 0;
          return bTime - aTime;
        })
        .slice(0, 6),
    [projects]
  );

  const bestCompletionProject = completionLeaders[0];
  const busiestProject = issueLeaders[0];
  const latestActivityProject = recentActivity[0];

  const formatRelativeTime = (iso?: string | null) => {
    if (!iso) return "최근 기록 없음";
    const target = new Date(iso).getTime();
    if (Number.isNaN(target)) return "최근 기록 없음";
    const diffMs = Date.now() - target;
    const minutes = Math.floor(diffMs / (1000 * 60));
    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}일 전`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks}주 전`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}개월 전`;
    const years = Math.floor(days / 365);
    return `${years}년 전`;
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const fetchUsers = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) }));
      setUsers(list);
    } catch (error) {
      console.error("사용자 목록 로드 실패:", error);
      setErrorMessage("사용자 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  const fetchProjects = () => {
    setLoading(true);
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setProjects([]);
      setLoading(false);
      return () => {};
    }
    const projectQuery = query(
      collection(db, "projects"),
      where("memberIds", "array-contains", uid),
      where("isDeleted", "==", false),
      where("isArchived", "==", false)
    );
    const unsubscribe = onSnapshot(
      projectQuery,
      async (projectSnapshot) => {
        try {
          const data = await Promise.all(
            projectSnapshot.docs.map(async (docSnap) => {
              const projectId = docSnap.id;
              const data = docSnap.data();
              const q = query(
                collection(db, "issues"),
                where("projectId", "==", projectId)
              );
              const issueSnapshot = await getDocs(q);
              const issueCount = issueSnapshot.size;

              const finishedSnapshot = await getDocs(
                query(
                  collection(db, "issues"),
                  where("projectId", "==", projectId),
                  where("status", "==", "완료")
                )
              );
              const finishedCount = finishedSnapshot.size;
              const completionRate =
                issueCount > 0
                  ? Math.round((finishedCount / issueCount) * 100)
                  : 0;

              return {
                id: projectId,
                ...(data as any),
                issueCount,
                completionRate,
                isPinned: data.isPinned || false,
                isDeleted: data.isDeleted || false,
                isArchived: data.isArchived || false,
                lastViewedAt: data.lastViewedAt || null,
                order: data.order ?? 0,
              } as Project;
            })
          );

          const sorted = data.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            if (a.order !== undefined && b.order !== undefined) {
              return a.order - b.order;
            }
            const aTime = a.lastViewedAt
              ? new Date(a.lastViewedAt).getTime()
              : 0;
            const bTime = b.lastViewedAt
              ? new Date(b.lastViewedAt).getTime()
              : 0;
            return bTime - aTime;
          });

          const mostRecent = sorted.reduce<Project | null>((prev, cur) => {
            if (!prev) return cur;
            const prevTime = prev.lastViewedAt
              ? new Date(prev.lastViewedAt).getTime()
              : 0;
            const curTime = cur.lastViewedAt
              ? new Date(cur.lastViewedAt).getTime()
              : 0;
            return curTime > prevTime ? cur : prev;
          }, null);

          setRecentProjectId(mostRecent ? mostRecent.id : null);
          setProjects(sorted);
        } catch (error) {
          console.error("프로젝트 목록 로드 실패:", error);
          setErrorMessage("프로젝트를 불러오는 중 오류가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("프로젝트 목록 로드 실패:", error);
        setErrorMessage("프로젝트를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    );
    return unsubscribe;
  };

  const toggleViewMode = () => {
    setViewMode((prev) => {
      const next = prev === "list" ? "card" : "list";
      localStorage.setItem("viewMode", next);
      return next;
    });
  };

  useEffect(() => {
    const unsubscribe = fetchProjects();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setEditingName(project.name);
    setEditingDescription(project.description || "");
  };

  const confirmEdit = async () => {
    if (!editingId) return;
    if (
      projects.some((p) => p.id !== editingId && p.name === editingName.trim())
    ) {
      const message = "동일한 이름의 프로젝트가 이미 존재합니다.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }
    try {
      await updateDoc(doc(db, "projects", editingId), {
        name: editingName,
        description: editingDescription,
      });
      setErrorMessage("");
      setEditingId(null);
    } catch (error) {
      console.error("프로젝트 수정 실패:", error);
      setErrorMessage("프로젝트를 수정하는 중 오류가 발생했습니다.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setErrorMessage("");
  };

  const addProject = async () => {
    if (!newProjectName.trim()) return;
    if (projects.some((p) => p.name === newProjectName.trim())) {
      const message = "동일한 이름의 프로젝트가 이미 존재합니다.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const maxOrder = projects.reduce(
      (max, p) => Math.max(max, p.order ?? 0),
      -1
    );
    try {
      await addDoc(collection(db, "projects"), {
        userId: uid,

        memberIds: [uid],

        name: newProjectName.trim(),
        description: newDescription.trim(),
        isPinned: false,
        isDeleted: false,
        isArchived: false,
        lastViewedAt: new Date().toISOString(),
        order: maxOrder + 1,
      });
      setErrorMessage("");
      setNewProjectName("");
      setNewDescription("");
    } catch (error) {
      console.error("프로젝트 추가 실패:", error);
      setErrorMessage("프로젝트를 추가하는 중 오류가 발생했습니다.");
    }
  };

  const [confirmState, setConfirmState] = useState<
    { message: string; onConfirm: () => Promise<void> } | null
  >(null);

  const permanentlyDelete = (projectId: string) => {
    setConfirmState({
      message: "정말로 프로젝트를 삭제하시겠어요?",
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "projects", projectId));
        } catch (error) {
          console.error("프로젝트 완전 삭제 실패:", error);
          setErrorMessage("프로젝트를 완전히 삭제하는 중 오류가 발생했습니다.");
        }
      },
    });
  };

  const togglePin = async (projectId: string, isPinned: boolean) => {
    try {
      await updateDoc(doc(db, "projects", projectId), {
        isPinned: !isPinned,
      });
    } catch (error) {
      console.error("프로젝트 고정 상태 변경 실패:", error);
      setErrorMessage("프로젝트 고정 상태 변경 중 오류가 발생했습니다.");
    }
  };

  const openShareModal = (projectId: string) => {
    setShareProjectId(projectId);
  };

  const handleAddMember = async (uid: string) => {
    if (!shareProjectId) return;
    try {
      await updateDoc(doc(db, "projects", shareProjectId), {
        memberIds: arrayUnion(uid),
      });
      setShareProjectId(null);
    } catch (error) {
      console.error("프로젝트 멤버 추가 실패:", error);
      setErrorMessage("멤버를 추가하는 중 오류가 발생했습니다.");
    }
  };

  const handleProjectClick = async (projectId: string) => {
    try {
      await updateDoc(doc(db, "projects", projectId), {
        lastViewedAt: new Date().toISOString(),
      });
      navigate(`/projects/${projectId}/issues`);
    } catch (error) {
      console.error("프로젝트 이동 실패:", error);
      setErrorMessage("프로젝트를 여는 중 오류가 발생했습니다.");
    }
  };

  const saveProjectOrder = async (list: Project[]) => {
    try {
      await Promise.all(
        list.map((p, index) =>
          updateDoc(doc(db, "projects", p.id), { order: index })
        )
      );
    } catch (error) {
      console.error("프로젝트 순서 저장 실패:", error);
      setErrorMessage("프로젝트 순서를 저장하는 중 오류가 발생했습니다.");
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };

  const handleDrop = (id: string) => {
    if (!draggedId || draggedId === id) return;
    const dragItem = projects.find((p) => p.id === draggedId);
    const dropIndex = projects.findIndex((p) => p.id === id);
    const dragIndex = projects.findIndex((p) => p.id === draggedId);
    if (!dragItem || dragItem.isPinned || projects[dropIndex].isPinned) return;
    const newList = [...projects];
    newList.splice(dragIndex, 1);
    newList.splice(dropIndex, 0, dragItem);
    setProjects(newList);
    saveProjectOrder(newList);
    setDraggedId(null);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      (project.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const pinnedProjects = filteredProjects.filter((p) => p.isPinned);
  const otherProjects = filteredProjects.filter((p) => !p.isPinned);

  return (
    <Container>
      <DashboardSection>
        <DashboardHeader>
          <DashboardTitle>프로젝트 개요</DashboardTitle>
          <DashboardSubtitle>
            전체 프로젝트 상태와 최근 활동을 한눈에 확인하세요.
          </DashboardSubtitle>
        </DashboardHeader>
        <DashboardGrid>
          <MetricCard>
            <MetricLabel>전체 프로젝트</MetricLabel>
            <MetricValue>{totalProjects}</MetricValue>
            <MetricCaption>{pinnedCount}개 고정됨</MetricCaption>
          </MetricCard>
          <MetricCard>
            <MetricLabel>이슈 누적</MetricLabel>
            <MetricValue>{totalIssues}</MetricValue>
            <MetricCaption>
              가장 바쁜 팀: {busiestProject ? busiestProject.name : "-"}
            </MetricCaption>
          </MetricCard>
          <MetricCard>
            <MetricLabel>평균 완료율</MetricLabel>
            <MetricValue>{averageCompletion}%</MetricValue>
            <MetricCaption>
              최고 성과: {bestCompletionProject
                ? `${bestCompletionProject.name} (${bestCompletionProject.completionRate}%)`
                : "데이터 없음"}
            </MetricCaption>
          </MetricCard>
          <MetricCard>
            <MetricLabel>활성 프로젝트</MetricLabel>
            <MetricValue>{activeProjects}</MetricValue>
            <MetricCaption>
              최근 열람: {latestActivityProject
                ? latestActivityProject.name
                : "-"}
            </MetricCaption>
          </MetricCard>
        </DashboardGrid>
        <DashboardSplit>
          <TrendCard>
            <TrendTitle>완료율 상위 프로젝트</TrendTitle>
            {completionLeaders.length === 0 ? (
              <MetricCaption>완료 데이터가 없습니다.</MetricCaption>
            ) : (
              <TrendList>
                {completionLeaders.map((project) => (
                  <TrendItem key={project.id}>
                    <TrendLabelRow>
                      <span>{project.name}</span>
                      <span>{project.completionRate ?? 0}%</span>
                    </TrendLabelRow>
                    <TrendBar width={project.completionRate ?? 0} />
                  </TrendItem>
                ))}
              </TrendList>
            )}
          </TrendCard>
          <TrendCard>
            <TrendTitle>이슈 볼륨 Top 5</TrendTitle>
            {issueLeaders.length === 0 ? (
              <MetricCaption>등록된 프로젝트가 없습니다.</MetricCaption>
            ) : (
              <TrendList>
                {(() => {
                  const maxIssueCount = Math.max(
                    ...issueLeaders.map((project) => project.issueCount ?? 0),
                    1
                  );
                  return issueLeaders.map((project) => (
                    <TrendItem key={project.id}>
                      <TrendLabelRow>
                        <span>{project.name}</span>
                        <span>{project.issueCount ?? 0}건</span>
                      </TrendLabelRow>
                      <TrendBar
                        width={
                          ((project.issueCount ?? 0) / maxIssueCount) * 100
                        }
                      />
                    </TrendItem>
                  ));
                })()}
              </TrendList>
            )}
          </TrendCard>
          <TrendCard>
            <TrendTitle>최근 열람 활동</TrendTitle>
            {recentActivity.length === 0 ? (
              <MetricCaption>최근 열람 기록이 없습니다.</MetricCaption>
            ) : (
              <ActivityList>
                {recentActivity.map((project) => (
                  <ActivityItem key={project.id}>
                    <ActivityTitle>{project.name}</ActivityTitle>
                    <ActivityMeta>
                      마지막 열람 · {formatRelativeTime(project.lastViewedAt)}
                    </ActivityMeta>
                    {project.description && (
                      <MetricCaption>{project.description}</MetricCaption>
                    )}
                  </ActivityItem>
                ))}
              </ActivityList>
            )}
          </TrendCard>
        </DashboardSplit>
      </DashboardSection>
      <HeaderRow>
          <Title>
            📁 프로젝트 목록{" "}
            <ProjectCount>({filteredProjects.length}개)</ProjectCount>
          </Title>
        <HeaderActions>
          <ViewToggleButton onClick={toggleViewMode}>
            {viewMode === "list" ? "카드형" : "리스트형"}
          </ViewToggleButton>
          <StyledLogoutButton onClick={handleSignOut}>
            로그아웃
          </StyledLogoutButton>
        </HeaderActions>
      </HeaderRow>

      <InputRow>
        <ProjectInput
          type="text"
          placeholder="프로젝트 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputRow>

      <InputRow>
        <ProjectInput
          type="text"
          placeholder="새 프로젝트 이름"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
        <DescriptionInput
          type="text"
          placeholder="설명"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <AddButton onClick={addProject}>+ 추가</AddButton>
      </InputRow>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {pinnedProjects.length > 0 && (
        <PinnedBar>
          고정: {pinnedProjects.map((p) => p.name).join(", ")}
        </PinnedBar>
      )}
        {loading ? (
          <LoadingMessage>불러오는 중...</LoadingMessage>
        ) : viewMode === "list" ? (
        <ProjectList>
            {[...pinnedProjects, ...otherProjects].map((project) => (
              <ProjectItem
                key={project.id}
                draggable={!project.isPinned}
                onDragStart={() => handleDragStart(project.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(project.id)}
              >
                <ProjectItemContent
                  project={project}
                  mode="list"
                  isEditing={editingId === project.id}
                  editingName={editingName}
                  editingDescription={editingDescription}
                  onNameChange={(e) => setEditingName(e.target.value)}
                  onDescriptionChange={(e) => setEditingDescription(e.target.value)}
                  onConfirmEdit={confirmEdit}
                  onCancelEdit={cancelEdit}
                  onProjectClick={handleProjectClick}
                  isRecent={project.id === recentProjectId}
                  expanded={!!expandedProjects[project.id]}
                  onToggleExpand={() =>
                    setExpandedProjects((prev) => ({
                      ...prev,
                      [project.id]: !prev[project.id],
                    }))
                  }
                  startEdit={startEdit}
                  togglePin={togglePin}
                  openShareModal={openShareModal}
                  permanentlyDelete={permanentlyDelete}
                />
              </ProjectItem>
            ))}
          </ProjectList>
      ) : (
          <CardGrid>
            {[...pinnedProjects, ...otherProjects].map((project) => (
              <CardItem
                key={project.id}
                draggable={!project.isPinned}
                onDragStart={() => handleDragStart(project.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(project.id)}
              >
                <ProjectItemContent
                  project={project}
                  mode="card"
                  isEditing={editingId === project.id}
                  editingName={editingName}
                  editingDescription={editingDescription}
                  onNameChange={(e) => setEditingName(e.target.value)}
                  onDescriptionChange={(e) => setEditingDescription(e.target.value)}
                  onConfirmEdit={confirmEdit}
                  onCancelEdit={cancelEdit}
                  onProjectClick={handleProjectClick}
                  isRecent={project.id === recentProjectId}
                  expanded={!!expandedProjects[project.id]}
                  onToggleExpand={() =>
                    setExpandedProjects((prev) => ({
                      ...prev,
                      [project.id]: !prev[project.id],
                    }))
                  }
                  startEdit={startEdit}
                  togglePin={togglePin}
                  openShareModal={openShareModal}
                  permanentlyDelete={permanentlyDelete}
                />
              </CardItem>
            ))}
          </CardGrid>
        )}
      {shareProjectId && (
        <ProjectShareModal
          users={users.filter((u) => u.uid !== auth.currentUser?.uid)}
          onAdd={handleAddMember}
          onClose={() => setShareProjectId(null)}
        />
      )}
      {confirmState && (
        <ConfirmModal
          message={confirmState.message}
          onConfirm={async () => {
            await confirmState.onConfirm();
            setConfirmState(null);
          }}
          onCancel={() => setConfirmState(null)}
        />
      )}
      <ToastContainer position="top-center" autoClose={2500} />
    </Container>
  );
};

export default ProjectListPage;
