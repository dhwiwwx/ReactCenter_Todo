import styled from "styled-components";

export const Container = styled.div`
  padding: 32px;
`;

export const Title = styled.h2`
  margin-bottom: 24px;
`;

export const ProjectList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const ProjectItem = styled.li`
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f8f8;
  }
`;

export const InputRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

export const ProjectInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
`;

export const AddButton = styled.button`
  padding: 10px 16px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;
