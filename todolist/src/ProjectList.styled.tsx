import styled from "styled-components";

export const Container = styled.div`
  padding: 32px;
  min-height: 100vh;
  background-color: #22254b; // ✅ 이슈 리스트와 동일한 배경색
  color: #ffffff;
`;

export const Title = styled.h2`
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: bold;
`;

export const ProjectList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 16px;
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
  background-color: #2a2e5b; // 어두운 입력창 배경
  color: #fff;
  border: 1px solid #444c77;
  border-radius: 6px;

  &::placeholder {
    color: #aaa;
  }
`;

export const AddButton = styled.button`
  padding: 10px 16px;
  font-size: 16px;
  background-color: #4fa94d; // 초록색 버튼 (이슈 리스트 등록 버튼과 동일)
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #3b8c3a;
  }
`;

export const ProjectItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 16px;
  background-color: #2c2f65; // 리스트 카드 배경
  border: 1px solid #3a3d70;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 18px;
  transition: background-color 0.2s ease;

  span {
    cursor: pointer;
    color: #ffffff;

    &:hover {
      text-decoration: underline;
    }
  }

  &:hover {
    background-color: #3b3e7a;
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  color: #ff6b6b;
  cursor: pointer;

  &:hover {
    color: #ff3b3b;
  }
`;
