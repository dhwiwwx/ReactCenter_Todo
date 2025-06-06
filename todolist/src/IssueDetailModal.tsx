import React, { useEffect } from "react";
import { Backdrop, ButtonGroup, CloseButton, DeleteButton, EditButton, Field, Modal, Title } from "./IssueDetailModal.styled";

interface Issue {
  id: string;
  title: string;
  description: string;
  priority: string;
  category?: string;
  reporter?: string;
  deadline?: string;
  createdAt?: any;
}

interface Props {
  issue: Issue;
  onClose: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function IssueDetailModal({ issue, onClose, onEdit, onDelete }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
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

  return (
    <Backdrop onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>{issue.title}</Title>
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
        {issue.createdAt && (
          <Field>
            <span>작성일:</span> {formatDate(issue.createdAt)}
          </Field>
        )}
        {issue.deadline && (
          <Field>
            <span>마감일:</span> {formatDeadline(issue.deadline)}
          </Field>
        )}
        <ButtonGroup>
        <CloseButton onClick={onClose}>닫기</CloseButton>
        <EditButton onClick={() => onEdit(issue.id)}>수정</EditButton>
        <DeleteButton onClick={() => onDelete(issue.id)}>삭제</DeleteButton>
        </ButtonGroup>
      </Modal>
    </Backdrop>
  );
}
