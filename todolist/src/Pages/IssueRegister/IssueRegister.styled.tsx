// IssueRegister.styled.ts
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // 반드시 import

const baseFont = `
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
`;

export const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  color: #222;
  background-color: white;
  outline: none;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #6c5ce7;
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
  }
`;

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
  box-shadow: 19px 17px 2px 1px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 720px;
`;

export const RegisterTitle = styled.h1`
  margin-bottom: 28px;
  font-size: 28px;
  font-weight: 400;
  text-align: center;
  user-select: none;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; // 기존 16px → 20px
`;

export const Input = styled.input`
  ${baseFont}
  height: 48px;
  padding: 12px 16px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #ffffff;
  color: #222;
  outline: none;

  &::placeholder {
    color: #aaa;
  }

  &:disabled {
    background-color: #e9ecef;
    color: #555;
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea`
  ${baseFont}
  height: 120px;
  padding: 12px 14px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  resize: none;
  outline: none;
  background-color: #ffffff;
  color: #222;

  &::placeholder {
    color: #aaa;
  }
`;

export const Select = styled.select`
  height: 44px;
  padding: 10px 14px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  outline: none;
  background-color: #ffffff;
  color: #222;
  cursor: pointer;

  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%3E%3Cpath%20fill='%23333'%20d='M4%206l4%204%204-4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  appearance: none;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

const buttonStyle = `
  width: 100px;
  height: 40px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.1s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`;

export const RegisterButton = styled.button`
  ${buttonStyle}
  background-color: #4caf50;
  color: #fff;
`;

export const CancelButton = styled.button`
  ${buttonStyle}
  background-color: #ff6b6b;
  color: #fff;
`;

export const ReadOnlyInput = styled.input`
  height: 48px;
  padding: 12px 16px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  color: #888;
  cursor: not-allowed;
  width: 100%;
`;
