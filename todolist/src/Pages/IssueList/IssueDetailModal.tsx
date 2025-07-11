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
  const [comments, setComments] = useState<Comment[]>(issue.comments || []);
  const [tags, setTags] = useState<string[]>(issue.tags || []);
  const [comment, setComment] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const currentUser = auth.currentUser;

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
    try {
      await updateDoc(doc(db, "issues", issue.id), { status: newStatus });
      setStatus(newStatus);
      onStatusChange?.();
    } catch (err) {
      alert("상태 변경 실패");
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !currentUser) return;
    const newComment = {
      id: crypto.randomUUID(),
      text: comment,
      createdAt: new Date().toISOString(),
      authorId: currentUser.uid,
    };
    await updateDoc(doc(db, "issues", issue.id), {
      comments: arrayUnion(newComment),
    });
    setComments((prev) => [...prev, newComment]);
    setComment("");
  };

  const handleDeleteComment = async (id: string) => {
    const filtered = comments.filter((c) => c.id !== id);
    await updateDoc(doc(db, "issues", issue.id), { comments: filtered });
    setComments(filtered);
  };

  const handleEditComment = async (id: string) => {
    const updated = comments.map((c) =>
      c.id === id ? { ...c, text: editText } : c
    );
    await updateDoc(doc(db, "issues", issue.id), { comments: updated });
    setComments(updated);
    setEditIndex(null);
    setEditText("");
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
            <option value="할 일">할 일</option>
            <option value="진행 중">진행 중</option>
            <option value="완료">완료</option>
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
