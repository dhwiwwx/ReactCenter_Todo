import React, { useState } from "react";
import { Backdrop, Modal, Select, ButtonGroup, AddButton, CancelButton } from "./ProjectShareModal.styled";

interface User {
  uid: string;
  email: string | null;
}

interface Props {
  users: User[];
  onAdd: (uid: string) => void;
  onClose: () => void;
}

export default function ProjectShareModal({ users, onAdd, onClose }: Props) {
  const [selected, setSelected] = useState<string>("");

  return (
    <Backdrop>
      <Modal>
        <Select value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="" disabled>
            사용자 선택
          </option>
          {users.map((u) => (
            <option key={u.uid} value={u.uid}>
              {u.email}
            </option>
          ))}
        </Select>
        <ButtonGroup>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <AddButton onClick={() => selected && onAdd(selected)}>추가</AddButton>
        </ButtonGroup>
      </Modal>
    </Backdrop>
  );
}
