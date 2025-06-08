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
  StatusRow, // ✅ styled-components로 만든 select (없으면 기본 select로 사용 가능)
} from "./IssueDetailModal.styled";
import { db } from "../../Firebase/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

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
  comments?: { text: string; createdAt: string }[];
}

interface Props {
  issue: Issue;
  onClose: () => void;
  onEdit: (id: string, issue: Issue) => void;
  onDelete: (id: string) => void;
  onStatusChange?: () => void;
}

export default function IssueDetailModal({
  issue,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) {
  const [status, setStatus] = useState(issue.status || "할 일");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

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
    if (diff > 0) {
      return diff <= 3 ? `D-${diff} 임박` : `D-${diff}`;
    }
    if (diff === 0) return "오늘 마감";
    return "마감 지남";
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateDoc(doc(db, "issues", issue.id), { status: newStatus });
      setStatus(newStatus);
      if (onStatusChange) onStatusChange(); // ✅ 리스트 리프레시 요청
    } catch (err) {
      alert("상태 변경 실패");
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await updateDoc(doc(db, "issues", issue.id), {
        comments: arrayUnion({ text: comment, createdAt: new Date().toISOString() }),
      });
      setComment("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Backdrop onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>{issue.title}</Title>

        <StatusRow>
          <StatusBadge status={status}>{status}</StatusBadge>
          <StatusSelect
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="할 일">할 일</option>
            <option value="진행 중">진행 중</option>
            <option value="완료">완료</option>
          </StatusSelect>
        </StatusRow>

        <Field>{issue.description}</Field>

        <Field>
          <span>우선순위:</span> {issue.priority}
        </Field>

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

        {issue.comments && issue.comments.length > 0 && (
          <div>
            {issue.comments.map((c, idx) => (
              <Field key={idx}>{c.text}</Field>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <input
            style={{ flex: 1 }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="댓글 입력"
          />
          <button onClick={handleAddComment}>등록</button>
        </div>

        <ButtonGroup>
          <CloseButton onClick={onClose}>닫기</CloseButton>
          <EditButton onClick={() => onEdit(issue.id, issue)}>수정</EditButton>
          <DeleteButton onClick={() => onDelete(issue.id)}>삭제</DeleteButton>
        </ButtonGroup>
      </Modal>
    </Backdrop>
  );
}
