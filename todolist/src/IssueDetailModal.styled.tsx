// components/IssueDetailModal/IssueDetailModal.styled.ts
import styled, { keyframes } from "styled-components";

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const Backdrop = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background: #2c2f48;
  color: #ffffff;
  padding: 32px;
  border-radius: 16px;
  width: 420px;
  max-width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  font-family: 'Pretendard', sans-serif;
  animation: ${fadeIn} 0.25s ease-out;
`;

export const Title = styled.h2`
  margin-bottom: 16px;
  font-size: 22px;
  font-weight: 700;
`;

export const Field = styled.p`
  margin: 6px 0;
  font-size: 15px;
  line-height: 1.5;
  color: #dddddd;

  span {
    font-weight: 600;
    color: #ffffff;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

export const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
`;


export const BaseButton = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
`;

export const CloseButton = styled(BaseButton)`
  background-color: #4fc3f7;
  color: white;

  &:hover {
    background-color: #039be5;
  }
`;

export const EditButton = styled(BaseButton)`
  background-color: #aed581;
  color: #1b5e20;

  &:hover {
    background-color: #9ccc65;
  }
`;

export const DeleteButton = styled(BaseButton)`
  background-color: #ef9a9a;
  color: #b71c1c;

  &:hover {
    background-color: #e57373;
  }
`;