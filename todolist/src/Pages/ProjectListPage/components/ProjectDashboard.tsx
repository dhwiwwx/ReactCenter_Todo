import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { addDays, format, isSameDay, startOfDay } from "date-fns";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
} from "recharts";
import { db } from "../../../Firebase/firebase";
import { useProjectView } from "../../../context/ProjectViewContext";

interface Issue {
  id: string;
  title?: string;
  status?: string;
  priority?: string;
  deadline?: string;
}

const STATUS_ORDER = ["할 일", "진행 중", "완료"] as const;
const PRIORITY_ORDER = ["긴급", "높음", "보통", "낮음"] as const;

const STATUS_COLORS: Record<(typeof STATUS_ORDER)[number], string> = {
  "할 일": "#60a5fa",
  "진행 중": "#f97316",
  완료: "#22c55e",
};

const PRIORITY_COLORS: Record<string, string> = {
  긴급: "#ef4444",
  높음: "#f97316",
  보통: "#eab308",
  낮음: "#3b82f6",
  기타: "#a855f7",
};

const normalizeStatus = (status?: string) => {
  if (STATUS_ORDER.includes(status as (typeof STATUS_ORDER)[number])) {
    return status as (typeof STATUS_ORDER)[number];
  }
  return "할 일";
};

const normalizePriority = (priority?: string) => {
  if (PRIORITY_ORDER.includes(priority as (typeof PRIORITY_ORDER)[number])) {
    return priority as string;
  }
  return priority ?? "기타";
};

const parseDeadline = (deadline?: string) => {
  if (!deadline) return null;
  const parsed = Date.parse(deadline);
  if (Number.isNaN(parsed)) return null;
  return startOfDay(new Date(parsed));
};

const formatDateLabel = (date: Date) => format(date, "MM/dd");

const ProjectDashboard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { viewMode, toggleViewMode } = useProjectView();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!projectId) {
      setIssues([]);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, "issues"),
      where("projectId", "==", projectId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const next = snapshot.docs.map((doc) => {
          // Firestore 문서에서 id 중복 방지
          const { id: _ignored, ...rest } = doc.data() as Issue;
          return {
            ...rest,
            id: doc.id, // Firestore 문서의 id를 최종적으로 사용
          };
        });

        setIssues(next);
        setIsLoading(false);
      },
      () => {
        setIssues([]);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [projectId]);

  const totalIssues = issues.length;
  const statusCounts = useMemo(() => {
    return STATUS_ORDER.map((status) => ({
      status,
      count: issues.filter((issue) => normalizeStatus(issue.status) === status)
        .length,
    }));
  }, [issues]);

  const priorityDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach((issue) => {
      const priority = normalizePriority(issue.priority);
      counts[priority] = (counts[priority] ?? 0) + 1;
    });
    return Object.entries(counts).map(([priority, value]) => ({
      priority,
      value,
    }));
  }, [issues]);

  const completedCount = useMemo(
    () =>
      issues.filter((issue) => normalizeStatus(issue.status) === "완료").length,
    [issues]
  );
  const completionRate = totalIssues
    ? Math.round((completedCount / totalIssues) * 100)
    : 0;

  const burnDownData = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 7 }).map((_, index) => {
      const date = addDays(today, index);
      const remaining = issues.filter((issue) => {
        const status = normalizeStatus(issue.status);
        if (status === "완료") {
          return false;
        }
        const deadline = parseDeadline(issue.deadline);
        if (!deadline) {
          return true;
        }
        return deadline >= date;
      }).length;

      const dueToday = issues.filter((issue) => {
        const deadline = parseDeadline(issue.deadline);
        return deadline ? isSameDay(deadline, date) : false;
      }).length;

      return {
        date: formatDateLabel(date),
        remaining,
        due: dueToday,
      };
    });
  }, [issues]);

  return (
    <DashboardWrapper>
      <HeaderRow>
        <HeaderTitle>프로젝트 대시보드</HeaderTitle>
        <ViewToggle onClick={toggleViewMode}>
          {viewMode === "list" ? "칸반 보기" : "리스트 보기"}
        </ViewToggle>
      </HeaderRow>
      <SummaryGrid>
        <SummaryCard>
          <SummaryLabel>총 이슈</SummaryLabel>
          <SummaryValue>{totalIssues}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>완료됨</SummaryLabel>
          <SummaryValue>{completedCount}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>완료율</SummaryLabel>
          <SummaryValue>{completionRate}%</SummaryValue>
        </SummaryCard>
      </SummaryGrid>
      {isLoading ? (
        <EmptyState>데이터를 불러오는 중입니다...</EmptyState>
      ) : totalIssues === 0 ? (
        <EmptyState>
          아직 등록된 이슈가 없습니다. 새로운 이슈를 추가해보세요.
        </EmptyState>
      ) : (
        <ChartGrid>
          <ChartCard>
            <ChartTitle>상태별 이슈 수</ChartTitle>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={statusCounts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusCounts.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard>
            <ChartTitle>우선순위 분포</ChartTitle>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={priorityDistribution}
                  dataKey="value"
                  nameKey="priority"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  label
                >
                  {priorityDistribution.map((entry) => (
                    <Cell
                      key={entry.priority}
                      fill={
                        PRIORITY_COLORS[entry.priority] ??
                        PRIORITY_COLORS["기타"]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard style={{ gridColumn: "1 / -1" }}>
            <ChartTitle>마감일 기준 번다운 추세</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={burnDownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="remaining"
                  name="남은 이슈"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="due"
                  name="해당일 마감"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </ChartGrid>
      )}
    </DashboardWrapper>
  );
};

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  color: #f8fafc;
`;

const ViewToggle = styled.button`
  border: none;
  background: #334155;
  color: #e2e8f0;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #1e293b;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
`;

const SummaryCard = styled.div`
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SummaryLabel = styled.span`
  font-size: 14px;
  color: #94a3b8;
`;

const SummaryValue = styled.span`
  font-size: 28px;
  font-weight: 600;
  color: #f8fafc;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
`;

const ChartCard = styled.div`
  background: rgba(15, 23, 42, 0.8);
  border-radius: 18px;
  padding: 20px;
  border: 1px solid rgba(30, 41, 59, 0.8);
  box-shadow: 0 10px 40px rgba(15, 23, 42, 0.35);
`;

const ChartTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: #e2e8f0;
`;

const EmptyState = styled.div`
  border-radius: 18px;
  padding: 48px 24px;
  text-align: center;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(30, 41, 59, 0.6);
  color: #94a3b8;
  font-size: 16px;
`;

export default ProjectDashboard;
