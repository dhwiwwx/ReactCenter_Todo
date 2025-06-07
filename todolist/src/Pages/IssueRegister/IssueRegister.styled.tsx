// IssueRegister.styled.js
import styled from "styled-components";

const baseFont = `
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
`;

// ─────────────────────────────────────────────────────────────────────────
// 1) 전체 레이아웃
// ─────────────────────────────────────────────────────────────────────────

export const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 60px;
  align-items: center;
  background-color: #22254b; /* 어두운 배경 */
  color: #fff;
`;

export const RegisterBox = styled.div`
  background-color: #373b69;   /* 짙은 보라/남색 */
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

// ─────────────────────────────────────────────────────────────────────────
// 2) 폼 내부 항목
// ─────────────────────────────────────────────────────────────────────────

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 일반 텍스트 입력
export const Input = styled.input`
  ${baseFont}
  height: 44px;
  padding: 10px 14px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  outline: none;
  
  /* 기본값: 흰색 바탕, 어두운 텍스트 */
  background-color: #ffffff;
  color: #222;

  &::placeholder {
    color: #aaa;
  }

  &:disabled {
    background-color: #e9ecef; /* 생성일 표시용 배경 */
    color: #333;
  }
`;

// 멀티라인 텍스트
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

// 셀렉트 박스
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

  /* 아래 화살표 아이콘을 흰색 배경에 검은색으로 보이게끔 */
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%3E%3Cpath%20fill='%23333'%20d='M4%206l4%204%204-4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  appearance: none;
`;

// ‘마감일’ 입력을 위한 <input type="date">
export const DeadlineInput = styled.input.attrs({ type: "date" })`
  ${baseFont}
  height: 48px;
  padding: 12px 16px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #222;
  outline: none;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #6c5ce7;
    background-color: #f0f0ff;
  }

  &::-webkit-calendar-picker-indicator {
    display: inline-block;    /* 명시적으로 표시 */
    cursor: pointer;
    margin-left: 4px;
  }
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
  background-color: #4caf50; /* 초록 */
  color: #fff;
`;

export const CancelButton = styled.button`
  ${buttonStyle}
  background-color: #ff6b6b; /* 빨강 */
  color: #fff;
`;

export const ReadOnlyInput = styled.input`
  height: 44px;
  padding: 10px 14px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  background-color: #e9ecef;
  color: #333;
  cursor: not-allowed;
  width: 100%;
`;

// 파일 업로드 버튼 스타일
export const FileUploadLabel = styled.label`
  background-color: #6c5ce7;
  color: #fff;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
`;
