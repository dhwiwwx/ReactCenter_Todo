import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase";
import { ProjectViewProvider } from "../../context/ProjectViewContext";

const ProjectViewLayout: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [projectName, setProjectName] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!projectId) return;
    const unsubscribe = onSnapshot(doc(db, "projects", projectId), (snapshot) => {
      const data = snapshot.data() as { name?: string } | undefined;
      setProjectName(data?.name ?? "");
    });

    return unsubscribe;
  }, [projectId]);

  if (!projectId) {
    return <CenteredMessage>프로젝트 정보를 불러올 수 없습니다.</CenteredMessage>;
  }

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const activePath = location.pathname;

  return (
    <ProjectViewProvider projectId={projectId}>
      <LayoutWrapper>
        <HeaderRow>
          <HeaderInfo>
            <BackButton onClick={() => navigate("/projects")}>뒤로</BackButton>
            <ProjectTitle>{projectName || "프로젝트"}</ProjectTitle>
          </HeaderInfo>
          <HeaderActions>
            <NavigateButton onClick={() => navigate(`/projects/${projectId}/register`)}>
              새 이슈 등록
            </NavigateButton>
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
          </HeaderActions>
        </HeaderRow>
        <TabList>
          <TabItem $active={activePath.includes("/dashboard")} to={`/projects/${projectId}/dashboard`}>
            대시보드
          </TabItem>
          <TabItem $active={activePath.includes("/issues")} to={`/projects/${projectId}/issues`}>
            이슈
          </TabItem>
        </TabList>
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </LayoutWrapper>
    </ProjectViewProvider>
  );
};

const CenteredMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: #e2e8f0;
`;

const LayoutWrapper = styled.div`
  padding: 32px 48px;
  color: #e2e8f0;
  min-height: 100vh;
  background: radial-gradient(circle at top, #1e293b, #0f172a 60%);
`;

const HeaderRow = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProjectTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  color: #f8fafc;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const buttonBase = `
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
`;

const BackButton = styled.button.attrs({ type: "button" })`
  ${buttonBase}
  background: rgba(15, 23, 42, 0.8);
  color: #cbd5f5;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 16px rgba(15, 23, 42, 0.4);
  }
`;

const NavigateButton = styled.button.attrs({ type: "button" })`
  ${buttonBase}
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.35);
  }
`;

const LogoutButton = styled.button.attrs({ type: "button" })`
  ${buttonBase}
  background: rgba(148, 163, 184, 0.15);
  color: #e2e8f0;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 16px rgba(148, 163, 184, 0.3);
  }
`;

const TabList = styled.nav`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const StyledTabLink = styled(NavLink)<{ $active: boolean }>`
  text-decoration: none;
`;

const TabItem = styled(StyledTabLink)`
  ${buttonBase}
  background: ${({ $active }) => ($active ? "#1d4ed8" : "rgba(30, 41, 59, 0.7)")};
  color: #f8fafc;
  border-radius: 12px;
  padding: 10px 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(30, 64, 175, 0.4);
  }
`;

const ContentWrapper = styled.section`
  background: rgba(15, 23, 42, 0.75);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(30, 41, 59, 0.6);
`;

export default ProjectViewLayout;
