import React from "react";
import { EditInput, PinButton } from "./ProjectList.styled";
import { Check, XCircle } from "lucide-react";

interface ProjectEditFieldsProps {
  name: string;
  description: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const ProjectEditFields: React.FC<ProjectEditFieldsProps> = ({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onConfirm,
  onCancel,
}) => {
  return (
    <div>
      <EditInput value={name} onChange={onNameChange} />
      <EditInput value={description} onChange={onDescriptionChange} />
      <PinButton onClick={onConfirm}>
        <Check size={18} />
      </PinButton>
      <PinButton onClick={onCancel}>
        <XCircle size={18} />
      </PinButton>
    </div>
  );
};

export default ProjectEditFields;
