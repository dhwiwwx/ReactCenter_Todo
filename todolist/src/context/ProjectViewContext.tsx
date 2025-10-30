import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase/firebase";

type ViewMode = "list" | "kanban";

interface ProjectViewContextValue {
  projectId: string;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode | ((prev: ViewMode) => ViewMode)) => void;
  toggleViewMode: () => void;
  workflow: string[];
}

const ProjectViewContext = createContext<ProjectViewContextValue | null>(null);

interface ProviderProps {
  projectId: string;
  children: React.ReactNode;
}

const DEFAULT_WORKFLOW = ["할 일", "진행 중", "완료"] as const;

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
  const [workflow, setWorkflow] = useState<string[]>([...DEFAULT_WORKFLOW]);

  useEffect(() => {
    const projectRef = doc(db, "projects", projectId);
    const unsubscribe = onSnapshot(
      projectRef,
      (snapshot) => {
        const data = snapshot.data() as { workflow?: string[] } | undefined;
        if (!data?.workflow || !Array.isArray(data.workflow)) {
          setWorkflow([...DEFAULT_WORKFLOW]);
          return;
        }

        const sanitized = data.workflow
          .map((status) =>
            typeof status === "string" ? status.trim() : ""
          )
          .filter((status) => status.length > 0);

        if (sanitized.length === 0) {
          setWorkflow([...DEFAULT_WORKFLOW]);
          return;
        }

        setWorkflow(sanitized);
      },
      () => {
        setWorkflow([...DEFAULT_WORKFLOW]);
      }
    );

    return () => unsubscribe();
  }, [projectId]);

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
    () => ({ projectId, viewMode, setViewMode, toggleViewMode, workflow }),
    [projectId, viewMode, setViewMode, toggleViewMode, workflow]
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
