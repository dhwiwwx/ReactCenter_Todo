import styled from "styled-components";

export const PageContainer = styled.div`
  padding: 32px;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
`;

export const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

export const InfoText = styled.p`
  font-size: 16px;
  margin-bottom: 16px;
  color: #ccc;
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
  margin-top: 16px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: #2c3e50;
  }
`;
