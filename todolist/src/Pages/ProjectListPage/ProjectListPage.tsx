import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Pin, PinOff, Undo2, XCircle } from "lucide-react";
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
  SearchInput,
  DescriptionInput,
} from "./ProjectList.styled";
import { db } from "../../Firebase/firebase";
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
  const [showTrash, setShowTrash] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

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
      <Title>📁 프로젝트 목록</Title>
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

      <SearchInput
        placeholder="프로젝트 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <AddButton onClick={() => setShowTrash((prev) => !prev)}>
        {showTrash ? "📂 일반 보기" : "🗑️ 휴지통 보기"}
      </AddButton>

      <ProjectList>
        {filteredProjects.map((project) => (
          <ProjectItem key={project.id}>
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
            <ActionGroup>
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
