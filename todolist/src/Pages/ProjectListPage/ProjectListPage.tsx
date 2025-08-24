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
  ToggleButton,
  DescriptionInput,
  StyledLogoutButton,
  ViewToggleButton,
  ErrorMessage,
  PinnedBar,
  HeaderRow,
  HeaderActions,
} from "./ProjectList.styled";
import ProjectItemContent from "./ProjectItemContent";
import { db, auth } from "../../Firebase/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  arrayUnion,
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

const ProfileAvatar = ({ onClick }: { onClick: () => void }) => {
  const [profileImage, setProfileImage] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setProfileImage(docSnap.data().profileImage || "");
        }
      } catch (error) {
        console.error("프로필 이미지 로드 실패:", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <img
      src={profileImage || "https://placekitten.com/200/200"}
      alt="프로필"
      onClick={onClick}
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        cursor: "pointer",
        objectFit: "cover",
      }}
    />
  );
};

const ProjectListPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
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
    const snap = await getDocs(collection(db, "users"));
    const list = snap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) }));
    setUsers(list);
  };

  const fetchProjects = async () => {
    setLoading(true);
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setProjects([]);
      setLoading(false);
      return;
    }
    const projectQuery = query(
      collection(db, "projects"),
      where("memberIds", "array-contains", uid)
    );
    const projectSnapshot = await getDocs(projectQuery);

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
          issueCount > 0 ? Math.round((finishedCount / issueCount) * 100) : 0;

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

    const filtered = data.filter(
      (p) => p.isDeleted === showTrash && p.isArchived === showArchive
    );

    const sorted = filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      const aTime = a.lastViewedAt ? new Date(a.lastViewedAt).getTime() : 0;
      const bTime = b.lastViewedAt ? new Date(b.lastViewedAt).getTime() : 0;
      return bTime - aTime;
    });

    const mostRecent = filtered.reduce<Project | null>((prev, cur) => {
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

    setLoading(false);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => {
      const next = prev === "list" ? "card" : "list";
      localStorage.setItem("viewMode", next);
      return next;
    });
  };

  useEffect(() => {
    fetchProjects();
  }, [showTrash, showArchive]);

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
    await updateDoc(doc(db, "projects", editingId), {
      name: editingName,
      description: editingDescription,
    });
    setErrorMessage("");
    setEditingId(null);
    fetchProjects();
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
    fetchProjects();
  };

  const [confirmState, setConfirmState] = useState<
    { message: string; onConfirm: () => Promise<void> } | null
  >(null);

  const softDeleteProject = (projectId: string) => {
    setConfirmState({
      message: "이 프로젝트를 휴지통으로 보내시겠어요?",
      onConfirm: async () => {
        await updateDoc(doc(db, "projects", projectId), {
          isDeleted: true,
          deletedAt: new Date().toISOString(),
        });
        fetchProjects();
      },
    });
  };

  const restoreProject = (projectId: string) => {
    setConfirmState({
      message: "이 프로젝트를 복원하시겠어요?",
      onConfirm: async () => {
        await updateDoc(doc(db, "projects", projectId), {
          isDeleted: false,
          deletedAt: null,
        });
        fetchProjects();
      },
    });
  };

  const archiveProject = (projectId: string) => {
    setConfirmState({
      message: "이 프로젝트를 보관하시겠어요?",
      onConfirm: async () => {
        await updateDoc(doc(db, "projects", projectId), {
          isArchived: true,
        });
        fetchProjects();
      },
    });
  };

  const unarchiveProject = (projectId: string) => {
    setConfirmState({
      message: "이 프로젝트를 보관 해제하시겠어요?",
      onConfirm: async () => {
        await updateDoc(doc(db, "projects", projectId), {
          isArchived: false,
        });
        fetchProjects();
      },
    });
  };

  const permanentlyDelete = (projectId: string) => {
    setConfirmState({
      message: "정말로 완전히 삭제하시겠어요?",
      onConfirm: async () => {
        await deleteDoc(doc(db, "projects", projectId));
        fetchProjects();
      },
    });
  };

  const togglePin = async (projectId: string, isPinned: boolean) => {
    await updateDoc(doc(db, "projects", projectId), {
      isPinned: !isPinned,
    });
    fetchProjects();
  };

  const openShareModal = (projectId: string) => {
    setShareProjectId(projectId);
  };

    const handleAddMember = async (uid: string) => {
      if (!shareProjectId) return;
      await updateDoc(doc(db, "projects", shareProjectId), {
        memberIds: arrayUnion(uid),
      });
      setShareProjectId(null);
      fetchProjects();
    };

    const handleProjectClick = async (projectId: string) => {
      await updateDoc(doc(db, "projects", projectId), {
        lastViewedAt: new Date().toISOString(),
      });
      navigate(`/projects/${projectId}/issues`);
    };

    const saveProjectOrder = async (list: Project[]) => {
      await Promise.all(
        list.map((p, index) =>
          updateDoc(doc(db, "projects", p.id), { order: index })
        )
    );
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
          <span style={{ fontSize: "16px", marginLeft: "8px", color: "#aaa" }}>
            ({filteredProjects.length}개)
          </span>
        </Title>
        <HeaderActions>
          <ViewToggleButton onClick={toggleViewMode}>
            {viewMode === "list" ? "카드형" : "리스트형"}
          </ViewToggleButton>
          <ProfileAvatar onClick={() => navigate("/mypage")} />
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
        <ToggleButton onClick={() => setShowTrash((prev) => !prev)}>
          {showTrash ? "📂 일반 보기" : "🗑️ 휴지통 보기"}
        </ToggleButton>
        <ToggleButton onClick={() => setShowArchive((prev) => !prev)}>
          {showArchive ? "📁 프로젝트" : "📁 보관함"}
        </ToggleButton>
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
        <div style={{ textAlign: "center", padding: "40px", fontSize: "18px" }}>
          불러오는 중...
        </div>
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
                  archiveProject={archiveProject}
                  unarchiveProject={unarchiveProject}
                  restoreProject={restoreProject}
                  permanentlyDelete={permanentlyDelete}
                  softDeleteProject={softDeleteProject}
                  showTrash={showTrash}
                  showArchive={showArchive}
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
                  archiveProject={archiveProject}
                  unarchiveProject={unarchiveProject}
                  restoreProject={restoreProject}
                  permanentlyDelete={permanentlyDelete}
                  softDeleteProject={softDeleteProject}
                  showTrash={showTrash}
                  showArchive={showArchive}
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
