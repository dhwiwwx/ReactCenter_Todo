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
  InputRow,
  ProjectInput,
  AddButton,
  DeleteButton,
  PinButton,
  ActionGroup,
  DescriptionInput,
  EditInput,
  StyledLogoutButton,
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
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const fetchProjects = async () => {
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
        };
      })
    );

    const filtered = data.filter((p) => p.isDeleted === showTrash);
    const sorted = filtered.sort((a, b) => {
      const aTime = a.lastViewedAt ? new Date(a.lastViewedAt).getTime() : 0;
      const bTime = b.lastViewedAt ? new Date(b.lastViewedAt).getTime() : 0;
      return bTime - aTime;
    });

    setProjects(sorted);
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
    await updateDoc(doc(db, "projects", editingId), {
      name: editingName,
      description: editingDescription,
    });
    setEditingId(null);
    fetchProjects();
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const addProject = async () => {
    if (!newProjectName.trim()) return;
    await addDoc(collection(db, "projects"), {
      name: newProjectName.trim(),
      description: newDescription.trim(),
      isPinned: false,
      isDeleted: false,
      lastViewedAt: new Date().toISOString(),
    });
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
        <Title>📁 프로젝트 목록</Title>
        <StyledLogoutButton onClick={handleSignOut}>
          로그아웃
        </StyledLogoutButton>
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

      <ProjectList>
        {filteredProjects.map((project) => (
          <ProjectItem key={project.id}>
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
              <span onClick={() => navigate(`/projects/${project.id}/issues`)}>
                {project.name}
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
                  {project.isPinned ? <PinOff size={20} /> : <Pin size={20} />}
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
    </Container>
  );
};

export default ProjectListPage;
