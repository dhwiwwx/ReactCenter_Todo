// 기존 import 유지
import React, { useEffect, useMemo, useState } from "react";
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
  DashboardSection,
  DashboardHeader,
  DashboardTitle,
  DashboardSubtitle,
  DashboardGrid,
  MetricCard,
  MetricLabel,
  MetricValue,
  MetricCaption,
  DashboardSplit,
  TrendCard,
  TrendTitle,
  TrendList,
  TrendItem,
  TrendLabelRow,
  TrendBar,
  ColoredTrendBar,
  TrendLegend,
  TrendLegendItem,
  LegendDot,
  DualBar,
  DualBarSegment,
  MetricEmptyState,
  ActivityList,
  ActivityItem,
  ActivityTitle,
  ActivityMeta,
  NotificationButton,
  NotificationBadge,
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
  Timestamp,
} from "firebase/firestore";
import ProjectShareModal from "./ProjectShareModal";
import ConfirmModal from "./ConfirmModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bell } from "lucide-react";
import ActivityFeed from "../../components/ActivityFeed/ActivityFeed";
import { format, startOfDay, subDays } from "date-fns";

type WeeklySnapshot = {
  dateKey: string;
  created: number;
  completed: number;
};

type CategoryCounts = Record<string, number>;
type PriorityCounts = Record<string, number>;

const DEFAULT_WORKFLOW = ["할 일", "진행 중", "완료"] as const;
const PRIORITY_COLOR_MAP: Record<string, string> = {
  긴급: "#ef4444",
  높음: "#f97316",
  보통: "#eab308",
  낮음: "#3b82f6",
  미지정: "#6366f1",
};

const CATEGORY_COLOR_PALETTE = [
  "#38bdf8",
  "#34d399",
  "#a855f7",
  "#f97316",
  "#facc15",
];

type IssueDocSummary = {
  status?: string;
  priority?: string;
  category?: string;
  createdAt?: unknown;
  completedAt?: unknown;
  deadline?: string;
};

const sanitizeWorkflow = (workflow?: unknown): string[] => {
  if (!Array.isArray(workflow)) {
    return [...DEFAULT_WORKFLOW];
  }

  const normalized = workflow
    .map((status) => (typeof status === "string" ? status.trim() : ""))
    .filter((status) => status.length > 0);

  return normalized.length > 0 ? normalized : [...DEFAULT_WORKFLOW];
};

const createWeekTemplate = () => {
  const today = startOfDay(new Date());
  return Array.from({ length: 7 }, (_, index) => {
    const date = subDays(today, 6 - index);
    const key = format(date, "yyyy-MM-dd");
    return { date, key };
  });
};

const getDateKey = (value: unknown): string | null => {
  if (!value) return null;
  if (value instanceof Timestamp) {
    return format(startOfDay(value.toDate()), "yyyy-MM-dd");
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return format(startOfDay(new Date(parsed)), "yyyy-MM-dd");
    }
  }
  return null;
};

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
  workflow?: string[];
  categoryCounts?: CategoryCounts;
  priorityCounts?: PriorityCounts;
  weeklyActivity?: WeeklySnapshot[];
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
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [unreadActivityCount, setUnreadActivityCount] = useState(0);

  const navigate = useNavigate();

  const totalProjects = projects.length;
  const totalIssues = useMemo(
    () => projects.reduce((acc, project) => acc + (project.issueCount ?? 0), 0),
    [projects]
  );
  const activeProjects = useMemo(
    () => projects.filter((project) => (project.issueCount ?? 0) > 0).length,
    [projects]
  );
  const averageCompletion = useMemo(() => {
    if (projects.length === 0) {
      return 0;
    }
    const sum = projects.reduce(
      (acc, project) => acc + (project.completionRate ?? 0),
      0
    );
    return Math.round(sum / projects.length);
  }, [projects]);

  const pinnedCount = useMemo(
    () => projects.filter((project) => project.isPinned).length,
    [projects]
  );

  const completionLeaders = useMemo(
    () =>
      [...projects]
        .filter((project) => (project.issueCount ?? 0) > 0)
        .sort(
          (a, b) => (b.completionRate ?? 0) - (a.completionRate ?? 0)
        )
        .slice(0, 5),
    [projects]
  );

  const issueLeaders = useMemo(
    () =>
      [...projects]
        .sort((a, b) => (b.issueCount ?? 0) - (a.issueCount ?? 0))
        .slice(0, 5),
    [projects]
  );

  const recentActivity = useMemo(
    () =>
      [...projects]
        .filter((project) => project.lastViewedAt)
        .sort((a, b) => {
          const aTime = a.lastViewedAt
            ? new Date(a.lastViewedAt).getTime()
            : 0;
          const bTime = b.lastViewedAt
            ? new Date(b.lastViewedAt).getTime()
            : 0;
          return bTime - aTime;
        })
        .slice(0, 6),
    [projects]
  );

  const categorySummary = useMemo(
    () => {
      const totals: CategoryCounts = {};
      projects.forEach((project) => {
        const counts = project.categoryCounts ?? {};
        Object.entries(counts).forEach(([category, count]) => {
          totals[category] = (totals[category] ?? 0) + count;
        });
      });

      const grandTotal = Object.values(totals).reduce(
        (acc, value) => acc + value,
        0
      );

      return Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([category, count], index) => ({
          category,
          count,
          ratio: grandTotal > 0 ? Math.round((count / grandTotal) * 100) : 0,
          color: CATEGORY_COLOR_PALETTE[index % CATEGORY_COLOR_PALETTE.length],
        }));
    },
    [projects]
  );

  const prioritySummary = useMemo(
    () => {
      const totals: PriorityCounts = {};
      projects.forEach((project) => {
        const counts = project.priorityCounts ?? {};
        Object.entries(counts).forEach(([priority, count]) => {
          totals[priority] = (totals[priority] ?? 0) + count;
        });
      });

      const grandTotal = Object.values(totals).reduce(
        (acc, value) => acc + value,
        0
      );

      return Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .map(([priority, count]) => ({
          priority,
          count,
          ratio: grandTotal > 0 ? Math.round((count / grandTotal) * 100) : 0,
          color: PRIORITY_COLOR_MAP[priority] ?? "#475569",
        }));
    },
    [projects]
  );

  const weeklyTrend = useMemo(() => {
    const template = createWeekTemplate();
    const aggregated = template.reduce<Record<
      string,
      { created: number; completed: number }
    >>(
      (acc, { key }) => {
        acc[key] = { created: 0, completed: 0 };
        return acc;
      },
      {}
    );

    projects.forEach((project) => {
      (project.weeklyActivity ?? []).forEach((point) => {
        if (!aggregated[point.dateKey]) return;
        aggregated[point.dateKey].created += point.created;
        aggregated[point.dateKey].completed += point.completed;
      });
    });

    return template.map(({ key, date }) => ({
      dateKey: key,
      label: format(date, "MM/dd"),
      created: aggregated[key]?.created ?? 0,
      completed: aggregated[key]?.completed ?? 0,
    }));
  }, [projects]);

  const bestCompletionProject = completionLeaders[0];
  const busiestProject = issueLeaders[0];
  const latestActivityProject = recentActivity[0];
  const topCategory = categorySummary[0];
  const topPriority = prioritySummary[0];
  const totalCreatedThisWeek = weeklyTrend.reduce(
    (acc, item) => acc + item.created,
    0
  );
  const totalCompletedThisWeek = weeklyTrend.reduce(
    (acc, item) => acc + item.completed,
    0
  );
  const maxWeeklyValue =
    weeklyTrend.reduce(
      (max, item) => Math.max(max, item.created, item.completed),
      0
    ) || 1;

  const formatRelativeTime = (iso?: string | null) => {
    if (!iso) return "최근 기록 없음";
    const target = new Date(iso).getTime();
    if (Number.isNaN(target)) return "최근 기록 없음";
    const diffMs = Date.now() - target;
    const minutes = Math.floor(diffMs / (1000 * 60));
    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}일 전`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks}주 전`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}개월 전`;
    const years = Math.floor(days / 365);
    return `${years}년 전`;
  };

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
      where("memberIds", "array-contains", uid),
      where("isDeleted", "==", false),
      where("isArchived", "==", false)
    );
    const unsubscribe = onSnapshot(
      projectQuery,
      async (projectSnapshot) => {
        try {
          const data = await Promise.all(
            projectSnapshot.docs.map(async (docSnap) => {
              const projectId = docSnap.id;
              const data = docSnap.data();
              const workflow = sanitizeWorkflow(data.workflow);
              const finalStatus = workflow[workflow.length - 1] ?? "완료";
              const q = query(
                collection(db, "issues"),
                where("projectId", "==", projectId)
              );
              const issueSnapshot = await getDocs(q);
              const issuesData = issueSnapshot.docs.map((issueDoc) => ({
                id: issueDoc.id,
                ...(issueDoc.data() as IssueDocSummary),
              }));

              const issueCount = issuesData.length;

              const categoryCounts: CategoryCounts = {};
              const priorityCounts: PriorityCounts = {};
              const weekTemplate = createWeekTemplate();
              const weekMap = weekTemplate.reduce<Record<string, { created: number; completed: number }>>(
                (acc, { key }) => {
                  acc[key] = { created: 0, completed: 0 };
                  return acc;
                },
                {}
              );

              let finishedCount = 0;

              issuesData.forEach((issue) => {
                const status = typeof issue.status === "string" ? issue.status : "";
                if (status === finalStatus) {
                  finishedCount += 1;
                }

                const category =
                  typeof issue.category === "string" && issue.category.trim().length > 0
                    ? issue.category.trim()
                    : "기타";
                categoryCounts[category] = (categoryCounts[category] ?? 0) + 1;

                const priority =
                  typeof issue.priority === "string" && issue.priority.trim().length > 0
                    ? issue.priority.trim()
                    : "미지정";
                priorityCounts[priority] = (priorityCounts[priority] ?? 0) + 1;

                const createdKey = getDateKey(issue.createdAt);
                if (createdKey && weekMap[createdKey]) {
                  weekMap[createdKey].created += 1;
                }

                const completedKey = getDateKey(issue.completedAt);
                if (completedKey && weekMap[completedKey]) {
                  weekMap[completedKey].completed += 1;
                }
              });

              const completionRate =
                issueCount > 0
                  ? Math.round((finishedCount / issueCount) * 100)
                  : 0;

              const weeklyActivity = weekTemplate.map(({ key }) => ({
                dateKey: key,
                created: weekMap[key]?.created ?? 0,
                completed: weekMap[key]?.completed ?? 0,
              }));

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
                workflow,
                categoryCounts,
                priorityCounts,
                weeklyActivity,
              } as Project;
            })
          );

          const sorted = data.sort((a, b) => {
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
        workflow: [...DEFAULT_WORKFLOW],
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

  const permanentlyDelete = (projectId: string) => {
    setConfirmState({
      message: "정말로 프로젝트를 삭제하시겠어요?",
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "projects", projectId));
        } catch (error) {
          console.error("프로젝트 완전 삭제 실패:", error);
          setErrorMessage("프로젝트를 완전히 삭제하는 중 오류가 발생했습니다.");
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
      navigate(`/projects/${projectId}/dashboard`);
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
      <DashboardSection>
        <DashboardHeader>
          <DashboardTitle>프로젝트 개요</DashboardTitle>
          <DashboardSubtitle>
            전체 프로젝트 상태와 최근 활동을 한눈에 확인하세요.
          </DashboardSubtitle>
        </DashboardHeader>
        <DashboardGrid>
          <MetricCard>
            <MetricLabel>전체 프로젝트</MetricLabel>
            <MetricValue>{totalProjects}</MetricValue>
            <MetricCaption>{pinnedCount}개 고정됨</MetricCaption>
          </MetricCard>
          <MetricCard>
            <MetricLabel>이슈 누적</MetricLabel>
            <MetricValue>{totalIssues}</MetricValue>
            <MetricCaption>
              가장 바쁜 팀: {busiestProject ? busiestProject.name : "-"}
            </MetricCaption>
          </MetricCard>
          <MetricCard>
            <MetricLabel>평균 완료율</MetricLabel>
            <MetricValue>{averageCompletion}%</MetricValue>
            <MetricCaption>
              최고 성과: {bestCompletionProject
                ? `${bestCompletionProject.name} (${bestCompletionProject.completionRate}%)`
                : "데이터 없음"}
            </MetricCaption>
          </MetricCard>
          <MetricCard>
            <MetricLabel>활성 프로젝트</MetricLabel>
            <MetricValue>{activeProjects}</MetricValue>
            <MetricCaption>
              최근 열람: {latestActivityProject
                ? latestActivityProject.name
                : "-"}
            </MetricCaption>
          </MetricCard>
          <MetricCard>
            <MetricLabel>주요 카테고리</MetricLabel>
            <MetricValue>{topCategory ? topCategory.category : "-"}</MetricValue>
            <MetricCaption>
              {topCategory
                ? `${topCategory.ratio}% · ${topCategory.count}건`
                : "최근 7일 기준 데이터 없음"}
            </MetricCaption>
          </MetricCard>
          <MetricCard>
            <MetricLabel>우선순위 집중</MetricLabel>
            <MetricValue>{topPriority ? topPriority.priority : "-"}</MetricValue>
            <MetricCaption>
              {topPriority
                ? `${topPriority.ratio}% (${topPriority.count}건)`
                : "등록된 이슈가 없습니다."}
            </MetricCaption>
          </MetricCard>
          <MetricCard>
            <MetricLabel>주간 처리량</MetricLabel>
            <MetricValue>{totalCompletedThisWeek}</MetricValue>
            <MetricCaption>
              생성 {totalCreatedThisWeek}건 · 완료 {totalCompletedThisWeek}건
            </MetricCaption>
          </MetricCard>
        </DashboardGrid>
        <DashboardSplit>
          <TrendCard>
            <TrendTitle>완료율 상위 프로젝트</TrendTitle>
            {completionLeaders.length === 0 ? (
              <MetricEmptyState>완료 데이터가 없습니다.</MetricEmptyState>
            ) : (
              <TrendList>
                {completionLeaders.map((project) => (
                  <TrendItem key={project.id}>
                    <TrendLabelRow>
                      <span>{project.name}</span>
                      <span>{project.completionRate ?? 0}%</span>
                    </TrendLabelRow>
                    <TrendBar width={project.completionRate ?? 0} />
                  </TrendItem>
                ))}
              </TrendList>
            )}
          </TrendCard>
          <TrendCard>
            <TrendTitle>카테고리 상위 5</TrendTitle>
            {categorySummary.length === 0 ? (
              <MetricEmptyState>카테고리 데이터가 없습니다.</MetricEmptyState>
            ) : (
              <TrendList>
                {categorySummary.map((entry) => (
                  <TrendItem key={entry.category}>
                    <TrendLabelRow>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <LegendDot color={entry.color} />
                        {entry.category}
                      </span>
                      <span>
                        {entry.count}건 ({entry.ratio}%)
                      </span>
                    </TrendLabelRow>
                    <ColoredTrendBar width={entry.ratio} color={entry.color} />
                  </TrendItem>
                ))}
              </TrendList>
            )}
          </TrendCard>
          <TrendCard>
            <TrendTitle>우선순위 분포</TrendTitle>
            {prioritySummary.length === 0 ? (
              <MetricEmptyState>우선순위 데이터가 없습니다.</MetricEmptyState>
            ) : (
              <TrendList>
                {prioritySummary.map((entry) => (
                  <TrendItem key={entry.priority}>
                    <TrendLabelRow>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <LegendDot color={entry.color} />
                        {entry.priority}
                      </span>
                      <span>
                        {entry.count}건 ({entry.ratio}%)
                      </span>
                    </TrendLabelRow>
                    <ColoredTrendBar width={entry.ratio} color={entry.color} />
                  </TrendItem>
                ))}
              </TrendList>
            )}
          </TrendCard>
          <TrendCard>
            <TrendTitle>이슈 볼륨 Top 5</TrendTitle>
            {issueLeaders.length === 0 ? (
              <MetricEmptyState>등록된 프로젝트가 없습니다.</MetricEmptyState>
            ) : (
              <TrendList>
                {(() => {
                  const maxIssueCount = Math.max(
                    ...issueLeaders.map((project) => project.issueCount ?? 0),
                    1
                  );
                  return issueLeaders.map((project) => (
                    <TrendItem key={project.id}>
                      <TrendLabelRow>
                        <span>{project.name}</span>
                        <span>{project.issueCount ?? 0}건</span>
                      </TrendLabelRow>
                      <TrendBar
                        width={
                          ((project.issueCount ?? 0) / maxIssueCount) * 100
                        }
                      />
                    </TrendItem>
                  ));
                })()}
              </TrendList>
            )}
          </TrendCard>
          <TrendCard>
            <TrendTitle>주간 생성·해결 추세</TrendTitle>
            {weeklyTrend.every(
              (item) => item.created === 0 && item.completed === 0
            ) ? (
              <MetricEmptyState>최근 7일간 활동이 없습니다.</MetricEmptyState>
            ) : (
              <TrendList>
                {weeklyTrend.map((point) => (
                  <TrendItem key={point.dateKey}>
                    <TrendLabelRow>
                      <span>{point.label}</span>
                      <span>
                        생성 {point.created} · 해결 {point.completed}
                      </span>
                    </TrendLabelRow>
                    <DualBar>
                      <DualBarSegment
                        width={(point.created / maxWeeklyValue) * 100}
                        color="#3b82f6"
                        aria-label={`생성 ${point.created}건`}
                      />
                      <DualBarSegment
                        width={(point.completed / maxWeeklyValue) * 100}
                        color="#22c55e"
                        aria-label={`해결 ${point.completed}건`}
                      />
                    </DualBar>
                  </TrendItem>
                ))}
              </TrendList>
            )}
            <TrendLegend>
              <TrendLegendItem>
                <LegendDot color="#3b82f6" /> 생성
              </TrendLegendItem>
              <TrendLegendItem>
                <LegendDot color="#22c55e" /> 해결
              </TrendLegendItem>
            </TrendLegend>
          </TrendCard>
          <TrendCard>
            <TrendTitle>최근 열람 활동</TrendTitle>
            {recentActivity.length === 0 ? (
              <MetricEmptyState>최근 열람 기록이 없습니다.</MetricEmptyState>
            ) : (
              <ActivityList>
                {recentActivity.map((project) => (
                  <ActivityItem key={project.id}>
                    <ActivityTitle>{project.name}</ActivityTitle>
                    <ActivityMeta>
                      마지막 열람 · {formatRelativeTime(project.lastViewedAt)}
                    </ActivityMeta>
                    {project.description && (
                      <MetricCaption>{project.description}</MetricCaption>
                    )}
                  </ActivityItem>
                ))}
              </ActivityList>
            )}
          </TrendCard>
        </DashboardSplit>
      </DashboardSection>
      <HeaderRow>
        <Title>
          📁 프로젝트 목록{" "}
          <ProjectCount>({filteredProjects.length}개)</ProjectCount>
        </Title>
        <HeaderActions>
          <NotificationButton
            type="button"
            aria-label="활동 알림 열기"
            onClick={() => setIsActivityOpen(true)}
          >
            <Bell size={18} />
            {unreadActivityCount > 0 && (
              <NotificationBadge>
                {unreadActivityCount > 99 ? "99+" : unreadActivityCount}
              </NotificationBadge>
            )}
          </NotificationButton>
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
                  permanentlyDelete={permanentlyDelete}
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
                  permanentlyDelete={permanentlyDelete}
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
      <ActivityFeed
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        currentUserId={auth.currentUser?.uid}
        projects={projects.map((project) => ({
          id: project.id,
          name: project.name,
        }))}
        onUnreadChange={setUnreadActivityCount}
      />
      <ToastContainer position="top-center" autoClose={2500} />
    </Container>
  );
};

export default ProjectListPage;
