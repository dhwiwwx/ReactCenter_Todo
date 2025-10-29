import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ViewMode = "list" | "kanban";

interface ProjectViewContextValue {
  projectId: string;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode | ((prev: ViewMode) => ViewMode)) => void;
  toggleViewMode: () => void;
}

const ProjectViewContext = createContext<ProjectViewContextValue | null>(null);

interface ProviderProps {
  projectId: string;
  children: React.ReactNode;
}

const getInitialViewMode = (projectId: string): ViewMode => {
  if (typeof window === "undefined") {
    return "list";
  }
  const stored = window.localStorage.getItem(
    `project:${projectId}:viewMode`
  ) as ViewMode | null;
  return stored === "kanban" ? "kanban" : "list";
};

export const ProjectViewProvider: React.FC<ProviderProps> = ({
  projectId,
  children,
}) => {
  const [viewMode, setViewModeState] = useState<ViewMode>(() =>
    getInitialViewMode(projectId)
  );

  const setViewMode = useCallback(
    (mode: ViewMode | ((prev: ViewMode) => ViewMode)) => {
      setViewModeState((prev) => {
        const next = typeof mode === "function" ? mode(prev) : mode;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(`project:${projectId}:viewMode`, next);
        }
        return next;
      });
    },
    [projectId]
  );

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "list" ? "kanban" : "list"));
  }, [setViewMode]);

  const value = useMemo(
    () => ({ projectId, viewMode, setViewMode, toggleViewMode }),
    [projectId, viewMode, setViewMode, toggleViewMode]
  );

  return (
    <ProjectViewContext.Provider value={value}>
      {children}
    </ProjectViewContext.Provider>
  );
};

export const useProjectView = () => {
  const context = useContext(ProjectViewContext);
  if (!context) {
    throw new Error(
      "useProjectView는 ProjectViewProvider 내부에서만 사용할 수 있습니다."
    );
  }
  return context;
};

export default ProjectViewContext;
