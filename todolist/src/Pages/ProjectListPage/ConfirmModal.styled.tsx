import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background: #1e1f2f;
  color: #ffffff;
  padding: 24px;
  border-radius: 12px;
  width: 320px;
  animation: ${fadeIn} 0.25s ease-out;
`;

export const Message = styled.p`
  margin-bottom: 24px;
  line-height: 1.4;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #fff;
`;

export const ConfirmButton = styled(Button)`
  background: #4fa94d;
`;

export const CancelButton = styled(Button)`
  background: #6c6f7b;
`;

