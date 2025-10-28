import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Title = styled.h1`
  font-size: clamp(24px, 5vw, 32px);
  color: #fff;
  font-weight: 300;
  text-align: center;
  margin-top: 30px;
`;

export const TopButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  margin-top: 12px;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const SearchRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    padding: 0 16px;
  }
`;

export const SearchInput = styled.input`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  font-size: 14px;
  width: min(300px, 100%);
  background-color: ${({ theme }) => theme.colors.inputBg};
  color: white;

  &::placeholder {
    color: #adb5bd;
  }
`;

export const SortSelect = styled.select`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.inputBg};
  color: white;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const GreenButton = styled.button`
  background-color: #51cf66;
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #40c057;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ListBackground = styled.div`
  background-color: #2d2f55;
  border-radius: 12px;
  margin: 20px auto;
  padding: 20px;
  width: 90%;
  max-width: 1000px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;

export const RedButton = styled(GreenButton)`
  background-color: #ff6b6b;
  &:hover {
    background-color: #fa5252;
  }
`;

export const OutlineButton = styled.button`
  border: 1px solid #fff;
  background-color: transparent;
  color: white;
  font-size: 14px;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const BackButton = styled.button`
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryHover};
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const StyledLogoutButton = styled.button`
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.logoutBg};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.logoutHover};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const StyledRegisterButton = styled.button`
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 0;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px 0;
  }
`;

export const Todo = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 20px 24px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    padding: 16px 18px;
  }
`;

export const StatusBadge = styled.div<{ status: string }>`
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 10px;
  font-weight: bold;
  color: white;
  align-self: flex-end;
  background-color: ${({ status }) =>
    status === "완료"
      ? "#10ac84"
      : status === "진행 중"
      ? "#54a0ff"
      : "#576574"};
`;

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CardTitle = styled.h3`
  font-size: 18px;
  margin: 0;
`;

export const CardDescription = styled.p`
  font-size: 14px;
  color: #ccc;
  margin: 0;
`;

export const CardMeta = styled.div`
  font-size: 12px;
  color: #aaa;
  display: flex;
  gap: 6px;
`;

export const CategoryTag = styled.span`
  background-color: #5c6bc0;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  color: white;
`;

export const PriorityTag = styled.span<{ priority: string }>`
  background-color: ${({ priority }) =>
    priority === "높음"
      ? "#e74c3c"
      : priority === "중간"
      ? "#f1c40f"
      : "#2ecc71"};
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  color: white;
`;

export const DeadlineTag = styled.span<{ status: string }>`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 8px;
  color: white;
  align-self: flex-start;
  background-color: ${({ status }) =>
    status.includes("마감 지남")
      ? "#ff6b6b"
      : status.includes("오늘 마감")
      ? "#feca57"
      : status.includes("임박")
      ? "#ff9f43"
      : "#48dbfb"};
`;

export const ProgressContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.inputBorder};
  height: 6px;
  border-radius: 4px;
  overflow: hidden;
  margin: 0 20px 10px;
`;

export const ProgressBar = styled.div<{ percent: number }>`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  width: ${({ percent }) => percent}%;
  transition: width 0.3s ease;
`;

export const ScrollableListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
`;

export const NoSelect = styled.div`
  user-select: none;
`;

export const Tag = styled.div`
  background-color: #5c7cfa;
  color: white;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  margin-top: 6px;
  display: inline-block;
`;

export const Initial = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #6c5ce7;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-left: 6px;
  cursor: default;
`;

export const CommentCount = styled.div`
  font-size: 12px;
  color: #999;
  margin-left: auto;
  margin-top: 6px;
  display: flex;
  align-items: center;

  &::before {
    content: "💬";
    margin-right: 4px;
  }
`;
