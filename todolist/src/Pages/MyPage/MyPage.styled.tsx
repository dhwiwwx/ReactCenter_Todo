import styled from "styled-components";

export const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 32px;
  margin: 0;
  background-color: #1e1e3f;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const Title = styled.h2`
  font-size: 28px;
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
`;

export const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
`;

/* 🔹 추가: 카드 그리드/아이템 */
export const CardGrid = styled.div`
  display: flex;
  justify-content: center;
`;

export const CardItem = styled.div`
  background: #252548;
  padding: 32px;
  border-radius: 16px;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* 🔹 추가: 입력창/버튼 */
export const InputRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  width: 100%;
`;

export const TextInput = styled.input`
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
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
`;
