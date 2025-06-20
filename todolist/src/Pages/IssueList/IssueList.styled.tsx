// ✅ IssueList.styled.ts (스타일 통합 기준 적용)

import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #22254b;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
`;

export const Title = styled.h1`
  font-size: 32px;
  color: #fff;
  font-weight: 300;
`;

export const SearchRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

export const SearchInput = styled.input`
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  width: 300px;
  background-color: #1f2240;
  color: white;

  &::placeholder {
    color: #adb5bd;
  }
`;

export const SortSelect = styled.select`
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  background-color: #1f2240;
  color: white;
  cursor: pointer;
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
`;

export const List = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 40px;
`;

export const Todo = styled.div`
  background-color: #2c2e50;
  padding: 20px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

export const StatusBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 12px;
  background-color: #64b5f6;
  color: #0d47a1;
  padding: 4px 10px;
  border-radius: 10px;
  font-weight: bold;
`;

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
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

export const DeadlineTag = styled.span`
  font-size: 12px;
  background-color: #ff9f43;
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  align-self: flex-end;
`;

export const ScrollableListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
`;
