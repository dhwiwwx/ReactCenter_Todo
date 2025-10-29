import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase/firebase";

export type ActivityType =
  | "issue_created"
  | "issue_status_changed"
  | "issue_deleted"
  | "comment_added"
  | "comment_updated"
  | "comment_deleted";

export interface ActivityPayload {
  projectId: string;
  issueId?: string | null;
  type: ActivityType;
  message: string;
  actorId: string;
  actorEmail?: string | null;
  actorName?: string | null;
  targetUserIds?: string[];
  metadata?: Record<string, unknown>;
}

export const logActivity = async ({
  projectId,
  issueId = null,
  type,
  message,
  actorId,
  actorEmail = null,
  actorName = null,
  targetUserIds = [],
  metadata = {},
}: ActivityPayload) => {
  if (!projectId || !actorId) {
    console.warn("프로젝트 ID 또는 사용자 ID가 없어 활동을 기록하지 않습니다.");
    return;
  }

  const normalizedTargets = Array.from(
    new Set(targetUserIds.filter((id): id is string => Boolean(id)))
  );

  try {
    await addDoc(collection(db, "activity"), {
      projectId,
      issueId,
      type,
      message,
      metadata,
      actorId,
      actorEmail,
      actorName,
      targetUserIds: normalizedTargets,
      readBy: [actorId],
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("활동 기록 실패", error);
  }
};
