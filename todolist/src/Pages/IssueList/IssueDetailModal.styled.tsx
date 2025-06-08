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
  padding: 32px;
  border-radius: 16px;
  width: 420px;
  max-width: 90%;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  font-family: "Pretendard", sans-serif;
  animation: ${fadeIn} 0.25s ease-out;
`;

export const Title = styled.h2`
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: 700;
`;

export const Field = styled.p`
  margin: 10px 0;
  font-size: 15px;
  line-height: 1.6;
  color: #ccc;

  span {
    display: inline-block;
    width: 80px;
    font-weight: 600;
    color: #aaa;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 24px;
`;

export const BaseButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

export const CloseButton = styled(BaseButton)`
  background-color: #4fc3f7;
  color: white;

  &:hover {
    background-color: #039be5;
  }
`;

export const EditButton = styled(BaseButton)`
  background-color: #81c784;
  color: white;

  &:hover {
    background-color: #66bb6a;
  }
`;

export const DeleteButton = styled(BaseButton)`
  background-color: #e57373;
  color: white;

  &:hover {
    background-color: #ef5350;
  }
`;

export const StatusBadge = styled.div<{ status: string }>`
  margin: 8px 0;
  padding: 6px 12px;
  display: inline-block;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  background-color: ${({ status }) =>
    status === "완료"
      ? "#10ac84"
      : status === "진행 중"
      ? "#feca57"
      : "#576574"};
  color: white;
`;

export const DeadlineTag = styled.span<{ status: string }>`
  display: inline-block;
  margin-left: 10px;
  padding: 2px 8px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  color: #fff;
  background-color: ${({ status }) =>
    status.includes("마감 지남")
      ? "#ff6b6b"
      : status.includes("오늘 마감")
      ? "#feca57"
      : status.includes("임박")
      ? "#ff9f43"
      : "#48dbfb"};
`;

export const StatusSelect = styled.select`
  padding: 6px 10px;
  font-size: 0.85rem;
  border-radius: 6px;
  border: 1px solid #aaa;
  background: #1e1e2f;
  color: #fff;

  &:focus {
    outline: none;
    border-color: #4fc3f7;
  }
`;
export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
`;
