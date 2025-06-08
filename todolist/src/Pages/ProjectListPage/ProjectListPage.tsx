// 기존 import 유지
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Pin,
  PinOff,
  Undo2,
  XCircle,
  Edit3,
  Check,
} from "lucide-react";
import {
  Container,
  Title,
  ProjectList,
  ProjectItem,
  CardGrid,
  CardItem,
  RecentBadge,
  InputRow,
  ProjectInput,
  AddButton,
  DeleteButton,
  PinButton,
  ActionGroup,
  DescriptionInput,
  EditInput,
  StyledLogoutButton,
  ViewToggleButton,
  ErrorMessage,
} from "./ProjectList.styled";
import { db, auth } from "../../Firebase/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface Project {
  id: string;
  name: string;
  description?: string;
  issueCount?: number;
  isPinned?: boolean;
  isDeleted?: boolean;
  lastViewedAt?: string;
  order?: number;
}

const ProjectListPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  const [search, setSearch] = useState("");
  const [recentProjectId, setRecentProjectId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "card">(() => {
    return (localStorage.getItem("viewMode") as "list" | "card") || "list";
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const fetchProjects = async () => {
    setLoading(true);
    const projectSnapshot = await getDocs(collection(db, "projects"));

    const data = await Promise.all(
      projectSnapshot.docs.map(async (docSnap) => {
        const projectId = docSnap.id;
        const data = docSnap.data();
        const issueSnapshot = await getDocs(collection(db, "issues"));
        const issueCount = issueSnapshot.docs.filter(
          (doc) => doc.data().projectId === projectId
        ).length;

        return {
          id: projectId,
          ...(data as any),
          issueCount,
          isPinned: data.isPinned || false,
          isDeleted: data.isDeleted || false,
          lastViewedAt: data.lastViewedAt || null,
          order: data.order ?? 0,
        } as Project;
      })
    );

    const filtered = data.filter((p) => p.isDeleted === showTrash);

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
  }, [showTrash]);

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
      setErrorMessage("동일한 이름의 프로젝트가 이미 존재합니다.");
      alert("동일한 이름의 프로젝트가 이미 존재합니다.");
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
      setErrorMessage("동일한 이름의 프로젝트가 이미 존재합니다.");
      return;
    }
    const maxOrder = projects.reduce(
      (max, p) => Math.max(max, p.order ?? 0),
      -1
    );
    await addDoc(collection(db, "projects"), {
      name: newProjectName.trim(),
      description: newDescription.trim(),
      isPinned: false,
      isDeleted: false,
      lastViewedAt: new Date().toISOString(),
      order: maxOrder + 1,
    });
    setErrorMessage("");
    setNewProjectName("");
    setNewDescription("");
    fetchProjects();
  };

  const softDeleteProject = async (projectId: string) => {
    const ok = window.confirm("이 프로젝트를 휴지통으로 보내시겠어요?");
    if (!ok) return;
    await updateDoc(doc(db, "projects", projectId), {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    });
    fetchProjects();
  };

  const restoreProject = async (projectId: string) => {
    await updateDoc(doc(db, "projects", projectId), {
      isDeleted: false,
      deletedAt: null,
    });
    fetchProjects();
  };

  const permanentlyDelete = async (projectId: string) => {
    const ok = window.confirm("정말로 완전히 삭제하시겠어요?");
    if (!ok) return;
    await deleteDoc(doc(db, "projects", projectId));
    fetchProjects();
  };

  const togglePin = async (projectId: string, isPinned: boolean) => {
    await updateDoc(doc(db, "projects", projectId), {
      isPinned: !isPinned,
    });
    fetchProjects();
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

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title>
          📁 프로젝트 목록{" "}
          <span style={{ fontSize: "16px", marginLeft: "8px", color: "#aaa" }}>
            ({filteredProjects.length}개)
          </span>
        </Title>
        <div style={{ display: "flex", gap: "8px" }}>
          <ViewToggleButton onClick={toggleViewMode}>
            {viewMode === "list" ? "카드형" : "리스트형"}
          </ViewToggleButton>
          <StyledLogoutButton onClick={handleSignOut}>
            로그아웃
          </StyledLogoutButton>
        </div>
      </div>

      <InputRow>
        <ProjectInput
          type="text"
          placeholder="프로젝트 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton onClick={() => setShowTrash((prev) => !prev)}>
          {showTrash ? "📂 일반 보기" : "🗑️ 휴지통 보기"}
        </AddButton>
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
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", fontSize: "18px" }}>
          불러오는 중...
        </div>
      ) : viewMode === "list" ? (
        <ProjectList>
          {filteredProjects.map((project) => (
            <ProjectItem
              key={project.id}
              draggable={!project.isPinned}
              onDragStart={() => handleDragStart(project.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(project.id)}
            >
              {editingId === project.id ? (
                <div>
                  <EditInput
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <EditInput
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                  />
                  <PinButton onClick={confirmEdit}>
                    <Check size={18} />
                  </PinButton>
                  <PinButton onClick={cancelEdit}>
                    <XCircle size={18} />
                  </PinButton>
                </div>
              ) : (
                <span
                  onClick={async () => {
                    await updateDoc(doc(db, "projects", project.id), {
                      lastViewedAt: new Date().toISOString(),
                    });
                    navigate(`/projects/${project.id}/issues`);
                  }}
                >
                  {project.name}
                  {project.id === recentProjectId && (
                    <RecentBadge>최근 본 프로젝트</RecentBadge>
                  )}
                  <span style={{ marginLeft: 8, fontSize: 14, color: "#ccc" }}>
                    ({project.issueCount ?? 0}건)
                  </span>
                  {project.description && (
                    <div style={{ fontSize: 12, color: "#aaa" }}>
                      {project.description}
                    </div>
                  )}
                </span>
              )}

              <ActionGroup>
                {!showTrash && editingId !== project.id && (
                  <PinButton onClick={() => startEdit(project)}>
                    <Edit3 size={18} />
                  </PinButton>
                )}
                {!showTrash && (
                  <PinButton
                    onClick={() =>
                      togglePin(project.id, project.isPinned ?? false)
                    }
                  >
                    {project.isPinned ? (
                      <PinOff size={20} />
                    ) : (
                      <Pin size={20} />
                    )}
                  </PinButton>
                )}
                {showTrash ? (
                  <>
                    <PinButton onClick={() => restoreProject(project.id)}>
                      <Undo2 size={20} />
                    </PinButton>
                    <DeleteButton onClick={() => permanentlyDelete(project.id)}>
                      <XCircle size={20} />
                    </DeleteButton>
                  </>
                ) : (
                  <DeleteButton onClick={() => softDeleteProject(project.id)}>
                    <Trash2 size={20} />
                  </DeleteButton>
                )}
              </ActionGroup>
            </ProjectItem>
          ))}
        </ProjectList>
      ) : (
        <CardGrid>
          {filteredProjects.map((project) => (
            <CardItem
              key={project.id}
              draggable={!project.isPinned}
              onDragStart={() => handleDragStart(project.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(project.id)}
            >
              {editingId === project.id ? (
                <div>
                  <EditInput
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <EditInput
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                  />
                  <PinButton onClick={confirmEdit}>
                    <Check size={18} />
                  </PinButton>
                  <PinButton onClick={cancelEdit}>
                    <XCircle size={18} />
                  </PinButton>
                </div>
              ) : (
                <span
                  onClick={async () => {
                    await updateDoc(doc(db, "projects", project.id), {
                      lastViewedAt: new Date().toISOString(),
                    });
                    navigate(`/projects/${project.id}/issues`);
                  }}
                >
                  {project.name}
                  {project.id === recentProjectId && (
                    <RecentBadge>최근 본 프로젝트</RecentBadge>
                  )}
                  <span style={{ marginLeft: 8, fontSize: 14, color: "#ccc" }}>
                    ({project.issueCount ?? 0}건)
                  </span>
                  {project.description && (
                    <div style={{ fontSize: 12, color: "#aaa" }}>
                      {project.description}
                    </div>
                  )}
                </span>
              )}

              <ActionGroup>
                {!showTrash && editingId !== project.id && (
                  <PinButton onClick={() => startEdit(project)}>
                    <Edit3 size={18} />
                  </PinButton>
                )}
                {!showTrash && (
                  <PinButton
                    onClick={() =>
                      togglePin(project.id, project.isPinned ?? false)
                    }
                  >
                    {project.isPinned ? (
                      <PinOff size={20} />
                    ) : (
                      <Pin size={20} />
                    )}
                  </PinButton>
                )}
                {showTrash ? (
                  <>
                    <PinButton onClick={() => restoreProject(project.id)}>
                      <Undo2 size={20} />
                    </PinButton>
                    <DeleteButton onClick={() => permanentlyDelete(project.id)}>
                      <XCircle size={20} />
                    </DeleteButton>
                  </>
                ) : (
                  <DeleteButton onClick={() => softDeleteProject(project.id)}>
                    <Trash2 size={20} />
                  </DeleteButton>
                )}
              </ActionGroup>
            </CardItem>
          ))}
        </CardGrid>
      )}
    </Container>
  );
};

export default ProjectListPage;
