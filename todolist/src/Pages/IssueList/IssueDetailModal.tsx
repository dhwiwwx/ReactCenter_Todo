import React, { useEffect, useState } from "react";
import {
  Backdrop,
  ButtonGroup,
  CloseButton,
  DeleteButton,
  EditButton,
  Field,
  Modal,
  Title,
  StatusBadge,
  DeadlineTag,
  StatusSelect,
  StatusRow,
  CommentSection,
  CommentInputRow,
  CommentList,
  CommentItem,
  CommentActionRow,
  Tag,
} from "./IssueDetailModal.styled";
import { db, auth } from "../../Firebase/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { logActivity } from "../../utils/activity";
import { useProjectView } from "../../context/ProjectViewContext";

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  authorId: string;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  priority: string;
  category?: string;
  reporter?: string;
  assignee?: string;
  deadline?: string;
  createdAt?: any;
  status?: string;
  comments?: Comment[];
  tags?: string[];
  projectId?: string;
}

interface Props {
  issue: Issue;
  onClose: () => void;
  onEdit: (id: string, issue: Issue) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (
    newStatus: string,
    previousStatus: string
  ) => Promise<void> | void;
  projectMembers?: string[];
}

export default function IssueDetailModal({
  issue,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  projectMembers = [],
}: Props) {
  const [status, setStatus] = useState(issue.status || "할 일");
  const [comments, setComments] = useState<Comment[]>(issue.comments || []);
  const [tags, setTags] = useState<string[]>(issue.tags || []);
  const [comment, setComment] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const currentUser = auth.currentUser;
  const { workflow } = useProjectView();
  const statusOptions = workflow.length > 0 ? workflow : ["할 일"];

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    setTags(issue.tags || []);
  }, [issue.tags]);

  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return "-";
    const date = timestamp.toDate();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return "-";
    const dateOnly = new Date(deadline).toISOString().split("T")[0];
    return dateOnly;
  };

  const getDeadlineStatus = (deadline?: string) => {
    if (!deadline) return "";
    const today = new Date();
    const due = new Date(deadline);
    const diff = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff > 0) return diff <= 3 ? `D-${diff} 임박` : `D-${diff}`;
    if (diff === 0) return "오늘 마감";
    return "마감 지남";
  };

  const handleStatusChange = async (newStatus: string) => {
    const previousStatus = status;
    setStatus(newStatus);
    try {
      await onStatusChange?.(newStatus, previousStatus);
    } catch (err) {
      console.error(err);
      setStatus(previousStatus);
      alert("상태 변경 실패");
    }
  };

  const handleAddComment = async () => {
    const trimmed = comment.trim();
    if (!trimmed || !currentUser) return;
    const newComment = {
      id: crypto.randomUUID(),
      text: trimmed,
      createdAt: new Date().toISOString(),
      authorId: currentUser.uid,
    };
    await updateDoc(doc(db, "issues", issue.id), {
      comments: arrayUnion(newComment),
    });
    setComments((prev) => [...prev, newComment]);
    setComment("");

    if (issue.projectId) {
      const actorName = currentUser.displayName || currentUser.email || "사용자";
      const snippet =
        trimmed.length > 60 ? `${trimmed.slice(0, 57)}…` : trimmed;
      await logActivity({
        projectId: issue.projectId,
        issueId: issue.id,
        type: "comment_added",
        message: `${actorName}님이 댓글을 추가했습니다: "${snippet}"`,
        actorId: currentUser.uid,
        actorEmail: currentUser.email,
        actorName,
        targetUserIds: projectMembers,
        metadata: { commentId: newComment.id },
      });
    }
  };

  const handleDeleteComment = async (id: string) => {
    const deletedComment = comments.find((c) => c.id === id);
    const filtered = comments.filter((c) => c.id !== id);
    await updateDoc(doc(db, "issues", issue.id), { comments: filtered });
    setComments(filtered);

    if (issue.projectId && currentUser) {
      const actorName = currentUser.displayName || currentUser.email || "사용자";
      await logActivity({
        projectId: issue.projectId,
        issueId: issue.id,
        type: "comment_deleted",
        message: `${actorName}님이 댓글을 삭제했습니다.`,
        actorId: currentUser.uid,
        actorEmail: currentUser.email,
        actorName,
        targetUserIds: projectMembers,
        metadata: { commentId: id, deletedText: deletedComment?.text ?? null },
      });
    }
  };

  const handleEditComment = async (id: string) => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    const updated = comments.map((c) =>
      c.id === id ? { ...c, text: trimmed } : c
    );
    await updateDoc(doc(db, "issues", issue.id), { comments: updated });
    setComments(updated);
    setEditIndex(null);
    setEditText("");

    if (issue.projectId && currentUser) {
      const actorName = currentUser.displayName || currentUser.email || "사용자";
      const snippet =
        trimmed.length > 60 ? `${trimmed.slice(0, 57)}…` : trimmed;
      await logActivity({
        projectId: issue.projectId,
        issueId: issue.id,
        type: "comment_updated",
        message: `${actorName}님이 댓글을 수정했습니다: "${snippet}"`,
        actorId: currentUser.uid,
        actorEmail: currentUser.email,
        actorName,
        targetUserIds: projectMembers,
        metadata: { commentId: id },
      });
    }
  };

  return (
    <Backdrop>
      <Modal>
        <Title>{issue.title}</Title>

        <StatusRow>
          <StatusBadge status={status}>{status}</StatusBadge>
          <StatusSelect
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </StatusSelect>
        </StatusRow>

        <Field>{issue.description}</Field>
        <Field>
          <span>우선순위:</span> {issue.priority}
        </Field>
        {tags.length > 0 && (
          <Field>
            <span>태그:</span>
            <div>
              {tags.map((tag, idx) => (
                <Tag key={idx}>#{tag}</Tag>
              ))}
            </div>
          </Field>
        )}
        {issue.category && (
          <Field>
            <span>카테고리:</span> {issue.category}
          </Field>
        )}
        {issue.reporter && (
          <Field>
            <span>작성자:</span> {issue.reporter}
          </Field>
        )}
        {issue.assignee && (
          <Field>
            <span>담당자:</span> {issue.assignee}
          </Field>
        )}
        {issue.createdAt && (
          <Field>
            <span>작성일:</span> {formatDate(issue.createdAt)}
          </Field>
        )}
        {issue.deadline && (
          <Field>
            <span>마감일:</span> {formatDeadline(issue.deadline)}
            <DeadlineTag status={getDeadlineStatus(issue.deadline)}>
              ({getDeadlineStatus(issue.deadline)})
            </DeadlineTag>
          </Field>
        )}

        <CommentSection>
          <h4 style={{ marginBottom: "8px" }}>💬 댓글</h4>
          <CommentList>
            {comments.map((c, idx) => (
              <CommentItem key={c.id}>
                {editIndex === idx ? (
                  <>
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <CommentActionRow>
                      <button
                        className="save"
                        onClick={() => handleEditComment(c.id)}
                      >
                        💾 저장
                      </button>
                      <button
                        className="cancel"
                        onClick={() => setEditIndex(null)}
                      >
                        ❌ 취소
                      </button>
                    </CommentActionRow>
                  </>
                ) : (
                  <>
                    <div>{c.text}</div>
                    <small>{c.createdAt.slice(0, 16).replace("T", " ")}</small>
                    {c.authorId === currentUser?.uid && (
                      <CommentActionRow>
                        <button
                          className="edit"
                          onClick={() => {
                            setEditIndex(idx);
                            setEditText(c.text);
                          }}
                        >
                          ✏️ 수정
                        </button>
                        <button
                          className="delete"
                          onClick={() => handleDeleteComment(c.id)}
                        >
                          🗑 삭제
                        </button>
                      </CommentActionRow>
                    )}
                  </>
                )}
              </CommentItem>
            ))}
          </CommentList>

          <CommentInputRow>
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글 입력"
            />
            <button onClick={handleAddComment}>등록</button>
          </CommentInputRow>
        </CommentSection>

        <ButtonGroup>
          <CloseButton onClick={onClose}>닫기</CloseButton>
          <EditButton onClick={() => onEdit(issue.id, issue)}>수정</EditButton>
          <DeleteButton onClick={() => onDelete(issue.id)}>삭제</DeleteButton>
        </ButtonGroup>
      </Modal>
    </Backdrop>
  );
}
