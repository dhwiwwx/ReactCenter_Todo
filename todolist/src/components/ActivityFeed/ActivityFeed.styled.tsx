import styled from "styled-components";

export const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(8, 9, 28, 0.45);
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
  transition: opacity 0.2s ease;
  z-index: 1200;
`;

export const Drawer = styled.aside<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: min(380px, 90vw);
  background: linear-gradient(180deg, #1f2251 0%, #121432 100%);
  box-shadow: -18px 0 30px rgba(0, 0, 0, 0.35);
  transform: translateX(${({ isOpen }) => (isOpen ? "0" : "100%")});
  transition: transform 0.25s ease;
  z-index: 1250;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px 14px;
  border-bottom: 1px solid rgba(123, 130, 200, 0.25);
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #d1d4ff;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }
`;

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const EmptyState = styled.div`
  margin-top: 80px;
  text-align: center;
  color: #9ba3d9;
  font-size: 14px;
`;

export const ActivityCard = styled.article<{ unread: boolean }>`
  border-radius: 14px;
  padding: 14px 16px;
  background: ${({ unread }) =>
    unread ? "rgba(92, 99, 198, 0.28)" : "rgba(42, 45, 94, 0.7)"};
  border: 1px solid
    ${({ unread }) => (unread ? "rgba(170, 180, 255, 0.7)" : "rgba(99, 106, 170, 0.4)")};
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #f1f2ff;
  transition: background 0.2s ease, border 0.2s ease;
`;

export const ActivityMessage = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  word-break: keep-all;
`;

export const ActivityMeta = styled.span`
  font-size: 12px;
  color: #a6a9d9;
  display: flex;
  gap: 6px;
  align-items: center;
`;

export const UnreadDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #89a1ff;
`;

export const FilterBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 22px 16px;
  border-bottom: 1px solid rgba(123, 130, 200, 0.25);
  background: rgba(15, 17, 44, 0.45);
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const FilterSelect = styled.select`
  flex: 1;
  min-width: 140px;
  background: rgba(24, 27, 70, 0.9);
  border: 1px solid rgba(123, 130, 200, 0.35);
  color: #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 13px;
  outline: none;
  transition: border 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: rgba(99, 102, 241, 0.6);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

export const FilterSearch = styled.input`
  flex: 1;
  min-width: 180px;
  background: rgba(23, 26, 68, 0.85);
  border: 1px solid rgba(123, 130, 200, 0.35);
  border-radius: 10px;
  padding: 8px 12px;
  color: #e2e8f0;
  font-size: 13px;
  outline: none;
  transition: border 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: rgba(226, 232, 240, 0.6);
  }

  &:focus {
    border-color: rgba(99, 102, 241, 0.6);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

export const ClearFiltersButton = styled.button`
  background: none;
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: #cbd5f5;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s ease, border 0.2s ease, color 0.2s ease;

  &:hover:enabled {
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.45);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
