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
}

type ActivityDoc = ActivityDocData & { id: string };

interface ActivityFeedProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string | null;
  projectIds?: string[];
  onUnreadChange?: (count: number) => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  isOpen,
  onClose,
  currentUserId,
  projectIds = [],
  onUnreadChange,
}) => {
  const [activities, setActivities] = useState<ActivityDoc[]>([]);
  const projectsSignature = useMemo(
    () => projectIds.join(","),
    [projectIds]
  );

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
  }, [currentUserId, onUnreadChange, projectsSignature]);

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
        timestamp: activity.createdAt?.toDate?.()
          ? formatDistanceToNow(activity.createdAt.toDate(), {
              addSuffix: true,
              locale: ko,
            })
          : "방금 전",
      })),
    [activities]
  );

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
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
        <Content>
          {formattedActivities.length === 0 ? (
            <EmptyState>
              아직 표시할 활동이 없습니다.
              <br />
              프로젝트의 이슈가 생성되거나 업데이트되면 이곳에 표시됩니다.
            </EmptyState>
          ) : (
            formattedActivities.map((activity) => {
              const unread = !(activity.readBy ?? []).includes(currentUserId ?? "");
              const actor = activity.actorName || activity.actorEmail || "사용자";
              return (
                <ActivityCard key={activity.id} unread={unread}>
                  <ActivityMessage>{activity.message}</ActivityMessage>
                  <ActivityMeta>
                    {unread && <UnreadDot aria-hidden />}
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
