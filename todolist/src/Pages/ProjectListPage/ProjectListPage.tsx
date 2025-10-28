// 기존 import 유지
import React, { useEffect, useState } from "react";
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
      where("memberIds", "array-contains", uid)
    );
    const unsubscribe = onSnapshot(
      projectQuery,
      async (projectSnapshot) => {
        try {
          const data = await Promise.all(
            projectSnapshot.docs.map(async (docSnap) => {
              const projectId = docSnap.id;
              const data = docSnap.data();
              const isDeleted = (data as any).isDeleted ?? false;
              const isArchived = (data as any).isArchived ?? false;
              if (isDeleted || isArchived) {
                return null;
              }

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
                lastViewedAt: data.lastViewedAt || null,
                order: data.order ?? 0,
              } as Project;
            })
          );

          const activeProjects = data.filter(
            (project): project is Project => project !== null
          );

          const sorted = activeProjects.sort((a, b) => {
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

  const deleteProject = (projectId: string) => {
    setConfirmState({
      message: "정말로 이 프로젝트를 삭제하시겠어요?",
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "projects", projectId));
        } catch (error) {
          console.error("프로젝트 삭제 실패:", error);
          setErrorMessage("프로젝트를 삭제하는 중 오류가 발생했습니다.");
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
                  deleteProject={deleteProject}
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
                  deleteProject={deleteProject}
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
