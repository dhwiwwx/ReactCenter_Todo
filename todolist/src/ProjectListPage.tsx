import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react"; // 상단에 import 추가
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
} from "firebase/firestore";

interface Project {
  id: string;
  name: string;
}

const ProjectListPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const snapshot = await getDocs(collection(db, "projects"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as { name: string }),
    }));
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async () => {
    if (!newProjectName.trim()) return;

    await addDoc(collection(db, "projects"), {
      name: newProjectName.trim(),
    });

    setNewProjectName("");
    fetchProjects(); // 등록 후 리스트 다시 불러오기
  };

  const deleteProject = async (projectId: string) => {
    const ok = window.confirm("정말 이 프로젝트를 삭제하시겠어요?");
    if (!ok) return;

    await deleteDoc(doc(db, "projects", projectId));
    fetchProjects();
  };

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

      <ProjectList>
        {projects.map((project) => (
          <ProjectItem key={project.id}>
            <span onClick={() => navigate(`/projects/${project.id}/issues`)}>
              {project.name}
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
