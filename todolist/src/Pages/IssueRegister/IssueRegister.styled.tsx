// IssueRegister.styled.ts
import styled from "styled-components";

export const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 60px;
  align-items: center;
  background-color: #22254b;
  color: #fff;
`;

export const RegisterBox = styled.div`
  background-color: #373b69;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 640px;
`;

export const RegisterTitle = styled.h1`
  margin-bottom: 28px;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Input = styled.input`
  height: 48px;
  padding: 12px 16px;
  font-size: 15px;
  border-radius: 8px;
  border: none;
  background-color: #fff;
  color: #222;
  outline: none;

  &::placeholder {
    color: #aaa;
  }
`;

export const TextArea = styled.textarea`
  height: 120px;
  padding: 12px 14px;
  font-size: 15px;
  border-radius: 8px;
  border: none;
  background-color: #fff;
  color: #222;
  resize: none;
  outline: none;

  &::placeholder {
    color: #aaa;
  }
`;

export const Select = styled.select`
  height: 44px;
  padding: 10px 14px;
  font-size: 15px;
  border-radius: 8px;
  border: none;
  background-color: #fff;
  color: #222;
  cursor: pointer;
  outline: none;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
`;

export const RegisterButton = styled.button`
  width: 80px;
  height: 38px;
  background-color: #4caf50;
  color: #fff;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

export const CancelButton = styled.button`
  width: 80px;
  height: 38px;
  background-color: #ff6b6b;
  color: #fff;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

export const TagWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TagInput = styled.input`
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background-color: #fff;
  color: #333;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: #aaa;
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #5c7cfa;
  color: #fff;
  padding: 6px 10px;
  font-size: 13px;
  border-radius: 9999px;
  transition: background-color 0.2s;

  span {
    cursor: pointer;
    font-weight: bold;
    &:hover {
      color: #ff6b6b;
    }
  }
`;

export const SuggestionBox = styled.ul`
  background-color: white;
  border-radius: 8px;
  margin-top: 4px;
  padding: 4px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  list-style: none;
  color: #222;
  max-height: 140px;
  overflow-y: auto;
`;

export const SuggestionItem = styled.li`
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f3f5;
  }
`;

export { Select as StyledSelect };
