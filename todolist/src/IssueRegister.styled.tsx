import styled from "styled-components";

export const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  min-height: 100vh;
  margin: 0 auto;

  /* 화면 가로/세로 중앙 정렬 */
  justify-content: center;
  align-items: center;

  padding-top: 60px;
  background-color: #22254b;
  color: #fff;
`;

export const RegisterTitle = styled.h1`
  margin-bottom: 40px;
  font-size: 36px;
  font-weight: 300;
  text-align: center;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 80%; /* 컨테이너 안에서 꽉 채우도록 */
`;

export const Input = styled.input`
  height: 48px;
  padding: 12px 16px;
  font-size: 18px;
  border-radius: 6px;
  border: none;
  outline: none;
`;

export const TextArea = styled.textarea`
  height: 150px;
  padding: 16px;
  font-size: 18px;
  border-radius: 6px;
  border: none;
  resize: none;
  outline: none;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
`;

export const RegisterButton = styled.button`
  width: 120px;
  height: 44px;
  background-color: #4caf50;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export const CancelButton = styled(RegisterButton)`
  background-color: #ff6b6b;
`;

export const Select = styled.select`
  height: 48px;
  padding: 12px 16px;
  font-size: 18px;
  border-radius: 6px;
  border: none;
  outline: none;
  background-color: white;
  color: black;
  cursor: pointer;
`;
