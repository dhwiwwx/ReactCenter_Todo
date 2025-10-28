import React from "react";
import ProjectEditFields from "./ProjectEditFields";
import {
  RecentBadge,
  ProgressWrapper,
  ProgressBackground,
  ProgressBar,
  PinButton,
  ActionGroup,
  DeleteButton,
} from "./ProjectList.styled";
import {
  Edit3,
  Pin,
  PinOff,
  UserPlus,
  Archive,
  ArchiveX,
  Undo2,
  XCircle,
  Trash2,
} from "lucide-react";
import { auth } from "../../Firebase/firebase";

interface Project {
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
}

interface ProjectItemContentProps {
  project: Project;
  mode: "list" | "card";
  isEditing: boolean;
  editingName: string;
  editingDescription: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmEdit: () => void;
  onCancelEdit: () => void;
  onProjectClick: (id: string) => void;
  isRecent: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  startEdit: (project: Project) => void;
  togglePin: (id: string, isPinned: boolean) => void;
  openShareModal: (id: string) => void;
  archiveProject: (id: string) => void;
  unarchiveProject: (id: string) => void;
  restoreProject: (id: string) => void;
  permanentlyDelete: (id: string) => void;
  softDeleteProject: (id: string) => void;
  showTrash: boolean;
  showArchive: boolean;
}

const ProjectItemContent: React.FC<ProjectItemContentProps> = ({
  project,
  mode,
  isEditing,
  editingName,
  editingDescription,
  onNameChange,
  onDescriptionChange,
  onConfirmEdit,
  onCancelEdit,
  onProjectClick,
  isRecent,
  expanded,
  onToggleExpand,
  startEdit,
  togglePin,
  openShareModal,
  archiveProject,
  unarchiveProject,
  restoreProject,
  permanentlyDelete,
  softDeleteProject,
  showTrash,
  showArchive,
}) => {
  const content = isEditing ? (
    <ProjectEditFields
      name={editingName}
      description={editingDescription}
      onNameChange={onNameChange}
      onDescriptionChange={onDescriptionChange}
      onConfirm={onConfirmEdit}
      onCancel={onCancelEdit}
    />
  ) : (
    <span onClick={() => onProjectClick(project.id)}>
      {project.name}
      {isRecent && <RecentBadge>최근 본 프로젝트</RecentBadge>}
      <span style={{ marginLeft: 8, fontSize: 14, color: "#ccc" }}>
        ({project.issueCount ?? 0}건)
      </span>
      <ProgressWrapper>
        <ProgressBackground>
          <ProgressBar percent={project.completionRate ?? 0} />
        </ProgressBackground>
      </ProgressWrapper>
      {project.description && (
        <div
          style={{
            fontSize: 12,
            color: "#aaa",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxWidth: "100%",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {expanded || project.description.length <= 50
            ? project.description
            : `${project.description.slice(0, 50)}...`}
          {project.description.length > 50 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
              style={{
                marginLeft: 8,
                color: "#00aaff",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              {expanded ? "숨기기" : "더보기"}
            </span>
          )}
        </div>
      )}
    </span>
  );

  const actions = (
    <ActionGroup>
      {!showTrash && !isEditing && (
        <PinButton onClick={() => startEdit(project)}>
          <Edit3 size={18} />
        </PinButton>
      )}
      {!showTrash && (
        <PinButton onClick={() => togglePin(project.id, project.isPinned ?? false)}>
          {project.isPinned ? <PinOff size={20} /> : <Pin size={20} />}
        </PinButton>
      )}
      {!showTrash && project.userId === auth.currentUser?.uid && (
        <PinButton onClick={() => openShareModal(project.id)}>
          <UserPlus size={20} />
        </PinButton>
      )}
      {!showTrash &&
        (showArchive ? (
          <PinButton onClick={() => unarchiveProject(project.id)}>
            <ArchiveX size={20} />
          </PinButton>
        ) : (
          <PinButton onClick={() => archiveProject(project.id)}>
            <Archive size={20} />
          </PinButton>
        ))}
      {showTrash ? (
        <>
          <PinButton onClick={() => restoreProject(project.id)}>
            <Undo2 size={20} />
          </PinButton>
          <DeleteButton onClick={() => permanentlyDelete(project.id)}>
            <XCircle size={20} />
          </DeleteButton>
        </>
      ) : (
        <DeleteButton onClick={() => softDeleteProject(project.id)}>
          <Trash2 size={20} />
        </DeleteButton>
      )}
    </ActionGroup>
  );

  return mode === "card" ? (
    <div>
      {content}
      {actions}
    </div>
  ) : (
    <>
      {content}
      {actions}
    </>
  );
};

export default ProjectItemContent;

