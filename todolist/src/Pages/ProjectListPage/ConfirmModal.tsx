import React from "react";
import {
  Backdrop,
  Modal,
  Message,
  ButtonGroup,
  ConfirmButton,
  CancelButton,
} from "./ConfirmModal.styled";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Backdrop>
      <Modal>
        <Message>{message}</Message>
        <ButtonGroup>
          <CancelButton onClick={onCancel}>취소</CancelButton>
          <ConfirmButton onClick={onConfirm}>확인</ConfirmButton>
        </ButtonGroup>
      </Modal>
    </Backdrop>
  );
}

