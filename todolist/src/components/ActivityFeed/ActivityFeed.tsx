import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  ActivityCard,
  ActivityMessage,
  ActivityMeta,
  CloseButton,
  Content,
  Drawer,
  EmptyState,
  Header,
  Overlay,
  Title,
  UnreadDot,
  FilterBar,
  FilterRow,
  FilterSelect,
  FilterSearch,
  ClearFiltersButton,
} from "./ActivityFeed.styled";
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface ActivityDocData {
  message: string;
  createdAt?: Timestamp;
  readBy?: string[];
  actorName?: string | null;
  actorEmail?: string | null;
  type: string;
  projectId?: string;
}

type ActivityDoc = ActivityDocData & { id: string };

interface ActivityFeedProject {
  id: string;
  name: string;
}

interface ActivityFeedProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string | null;
  projects?: ActivityFeedProject[];
  onUnreadChange?: (count: number) => void;
}

const TYPE_LABELS: Record<string, string> = {
  issue_created: "이슈 생성",
  issue_status_changed: "상태 변경",
  issue_deleted: "이슈 삭제",
  comment_added: "댓글 추가",
  comment_updated: "댓글 수정",
  comment_deleted: "댓글 삭제",
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  isOpen,
  onClose,
  currentUserId,
  projects = [],
  onUnreadChange,
}) => {
  const [activities, setActivities] = useState<ActivityDoc[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const projectLookup = useMemo(() => {
    return new Map(projects.map((project) => [project.id, project.name]));
  }, [projects]);

  useEffect(() => {
    if (!currentUserId) {
      setActivities([]);
      onUnreadChange?.(0);
      return;
    }

    const activityQuery = query(
      collection(db, "activity"),
      where("targetUserIds", "array-contains", currentUserId),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(activityQuery, (snapshot) => {
      const docs = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data() as ActivityDocData;
          return {
            id: docSnap.id,
            ...data,
          } as ActivityDoc;
        })
        .sort((a, b) => {
          const aTime = a.createdAt ? a.createdAt.toDate().getTime() : 0;
          const bTime = b.createdAt ? b.createdAt.toDate().getTime() : 0;
          return bTime - aTime;
        });

      setActivities(docs);

      if (currentUserId) {
        const unreadCount = docs.filter(
          (item) => !(item.readBy ?? []).includes(currentUserId)
        ).length;
        onUnreadChange?.(unreadCount);
      }
    });

    return () => unsubscribe();
  }, [currentUserId, onUnreadChange]);

  useEffect(() => {
    if (!isOpen || !currentUserId) return;
    const unread = activities.filter(
      (activity) => !(activity.readBy ?? []).includes(currentUserId)
    );
    if (unread.length === 0) return;

    Promise.all(
      unread.map((activity) =>
        updateDoc(doc(db, "activity", activity.id), {
          readBy: arrayUnion(currentUserId),
        })
      )
    ).catch((error) => console.error("활동 읽음 처리 실패", error));
  }, [activities, currentUserId, isOpen]);

  const formattedActivities = useMemo(
    () =>
      activities.map((activity) => ({
        ...activity,
        projectName:
          projectLookup.get(activity.projectId ?? "") ?? "전체 프로젝트",
        typeLabel: TYPE_LABELS[activity.type] ?? activity.type,
        timestamp: activity.createdAt?.toDate?.()
          ? formatDistanceToNow(activity.createdAt.toDate(), {
              addSuffix: true,
              locale: ko,
            })
          : "방금 전",
      })),
    [activities, projectLookup]
  );

  const availableTypes = useMemo(() => {
    const typeSet = new Set<string>();
    activities.forEach((activity) => typeSet.add(activity.type));
    return Array.from(typeSet).sort();
  }, [activities]);

  const filteredActivities = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    return formattedActivities.filter((activity) => {
      if (
        selectedProjectId !== "all" &&
        (activity.projectId ?? "") !== selectedProjectId
      ) {
        return false;
      }

      if (selectedType !== "all" && activity.type !== selectedType) {
        return false;
      }

      if (keyword.length > 0) {
        const haystack = `${activity.message} ${activity.actorName ?? ""} ${
          activity.actorEmail ?? ""
        }`;
        if (!haystack.toLowerCase().includes(keyword)) {
          return false;
        }
      }

      return true;
    });
  }, [
    formattedActivities,
    searchKeyword,
    selectedProjectId,
    selectedType,
  ]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const resetFilters = () => {
    setSelectedProjectId("all");
    setSelectedType("all");
    setSearchKeyword("");
  };

  return (
    <Overlay isOpen={isOpen} onClick={handleOverlayClick}>
      <Drawer isOpen={isOpen} role="dialog" aria-label="프로젝트 활동 알림">
        <Header>
          <Title>최근 활동</Title>
          <CloseButton onClick={onClose} aria-label="활동 피드 닫기">
            <X size={18} />
          </CloseButton>
        </Header>
        <FilterBar>
          <FilterRow>
            <FilterSelect
              value={selectedProjectId}
              onChange={(event) => setSelectedProjectId(event.target.value)}
              aria-label="프로젝트별 필터"
            >
              <option value="all">전체 프로젝트</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              aria-label="활동 유형 필터"
            >
              <option value="all">전체 유형</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {TYPE_LABELS[type] ?? type}
                </option>
              ))}
            </FilterSelect>
          </FilterRow>
          <FilterRow>
            <FilterSearch
              type="search"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="메시지 또는 작성자 검색"
            />
            <ClearFiltersButton
              type="button"
              onClick={resetFilters}
              disabled={
                selectedProjectId === "all" &&
                selectedType === "all" &&
                searchKeyword.trim().length === 0
              }
            >
              필터 초기화
            </ClearFiltersButton>
          </FilterRow>
        </FilterBar>
        <Content>
          {filteredActivities.length === 0 ? (
            <EmptyState>
              아직 표시할 활동이 없습니다.
              <br />
              프로젝트의 이슈가 생성되거나 업데이트되면 이곳에 표시됩니다.
            </EmptyState>
          ) : (
            filteredActivities.map((activity) => {
              const unread = !(activity.readBy ?? []).includes(currentUserId ?? "");
              const actor = activity.actorName || activity.actorEmail || "사용자";
              return (
                <ActivityCard key={activity.id} unread={unread}>
                  <ActivityMessage>{activity.message}</ActivityMessage>
                  <ActivityMeta>
                    {unread && <UnreadDot aria-hidden />}
                    <span>{activity.projectName}</span>
                    <span>·</span>
                    <span>{activity.typeLabel}</span>
                    <span>·</span>
                    <span>{actor}</span>
                    <span>·</span>
                    <span>{activity.timestamp}</span>
                  </ActivityMeta>
                </ActivityCard>
              );
            })
          )}
        </Content>
      </Drawer>
    </Overlay>
  );
};

export default ActivityFeed;
