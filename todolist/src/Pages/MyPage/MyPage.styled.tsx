import styled from "styled-components";

export const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: clamp(24px, 6vw, 48px) 16px;
  margin: 0;
  background-color: #1e1e3f;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const Title = styled.h2`
  font-size: clamp(24px, 5vw, 28px);
  margin-bottom: 20px;
`;

export const InfoText = styled.p`
  font-size: 16px;
  margin-bottom: 16px;
  color: #ccc;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;

  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const DeleteButton = styled.button`
  padding: 12px 24px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #c0392b;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const LogoutButton = styled.button`
  padding: 12px 24px;
  background-color: #34495e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #2c3e50;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

/* 🔹 추가: 카드 그리드/아이템 */
export const CardGrid = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const CardItem = styled.div`
  background: #252548;
  padding: clamp(24px, 5vw, 32px);
  border-radius: 16px;
  width: min(400px, 100%);
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 480px) {
    border-radius: 12px;
  }
`;

/* 🔹 추가: 입력창/버튼 */
export const InputRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  width: 100%;

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

export const TextInput = styled.input`
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;

  @media (max-width: 520px) {
    width: 100%;
  }
`;

export const SaveButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }

  @media (max-width: 520px) {
    width: 100%;
  }
`;

export const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

export const AvatarImage = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.3);
`;

export const AvatarPlaceholder = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
  color: #e5e7ff;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(56, 189, 248, 0.6));
  border: 3px solid rgba(255, 255, 255, 0.15);
`;

export const AvatarButton = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: rgba(148, 163, 184, 0.15);
  color: #f8fafc;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease, border 0.2s ease;

  &:hover:enabled {
    background: rgba(99, 102, 241, 0.25);
    border-color: rgba(99, 102, 241, 0.45);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const SectionDivider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  margin: 20px 0;
`;

export const SectionTitle = styled.h3`
  width: 100%;
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  flex-wrap: wrap;
`;

export const ToggleLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #e5e7ff;
  font-weight: 500;
`;

export const ToggleButton = styled.button<{ $active: boolean }>`
  min-width: 80px;
  padding: 8px 14px;
  border-radius: 999px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? "#0f172a" : "#e2e8f0")};
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, #34d399, #22d3ee)"
      : "rgba(148, 163, 184, 0.2)"};
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:hover:enabled {
    transform: translateY(-1px);
    box-shadow: 0 8px 16px rgba(15, 23, 42, 0.35);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const HistoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const HistoryItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.2);

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const HistoryLabel = styled.span`
  font-size: 13px;
  color: rgba(226, 232, 240, 0.75);
`;

export const HistoryValue = styled.span`
  font-size: 13px;
  color: #ffffff;
  font-weight: 500;
`;
