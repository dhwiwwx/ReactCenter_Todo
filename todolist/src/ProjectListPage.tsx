import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import {
  Container,
  Title,
  ProjectList,
  ProjectItem,
  InputRow,
  ProjectInput,
  AddButton,
  DeleteButton,
} from "./ProjectList.styled";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

interface Project {
  id: string;
  name: string;
  issueCount?: number;
  lastViewedAt?: string | null;
}

const ProjectListPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const projectSnapshot = await getDocs(collection(db, "projects"));

    const data = await Promise.all(
      projectSnapshot.docs.map(async (docSnap) => {
        const projectId = docSnap.id;
        const issueSnapshot = await getDocs(collection(db, "issues"));
        const issueCount = issueSnapshot.docs.filter(
          (doc) => doc.data().projectId === projectId
        ).length;

        const projectData = docSnap.data() as {
          name: string;
          lastViewedAt?: string;
        };
        return {
          id: projectId,
          name: projectData.name,
          lastViewedAt: projectData.lastViewedAt || null,
          issueCount,
        };
      })
    );

    // 정렬: 최근 열람 순
    const sorted = data.sort((a, b) => {
      const aTime = a.lastViewedAt ? new Date(a.lastViewedAt).getTime() : 0;
      const bTime = b.lastViewedAt ? new Date(b.lastViewedAt).getTime() : 0;
      return bTime - aTime;
    });

    setProjects(sorted);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async () => {
    if (!newProjectName.trim()) return;

    await addDoc(collection(db, "projects"), {
      name: newProjectName.trim(),
      lastViewedAt: new Date().toISOString(),
    });

    setNewProjectName("");
    fetchProjects();
  };

  const deleteProject = async (projectId: string) => {
    const ok = window.confirm("정말 이 프로젝트를 삭제하시겠어요?");
    if (!ok) return;

    await deleteDoc(doc(db, "projects", projectId));
    fetchProjects();
  };

  const handleNavigateToProject = async (projectId: string) => {
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, {
      lastViewedAt: new Date().toISOString(),
    });

    navigate(`/projects/${projectId}/issues`);
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <AddButton onClick={addProject}>+ 추가</AddButton>
      </InputRow>

      <InputRow>
        <ProjectInput
          type="text"
          placeholder="프로젝트 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputRow>

      <ProjectList>
        {filteredProjects.map((project) => (
          <ProjectItem key={project.id}>
            <span onClick={() => handleNavigateToProject(project.id)}>
              {project.name}
              <span style={{ marginLeft: 8, fontSize: 14, color: "#ccc" }}>
                ({project.issueCount ?? 0}건)
              </span>
            </span>
            <DeleteButton onClick={() => deleteProject(project.id)}>
              <Trash2 size={20} />
            </DeleteButton>
          </ProjectItem>
        ))}
      </ProjectList>
    </Container>
  );
};

export default ProjectListPage;
