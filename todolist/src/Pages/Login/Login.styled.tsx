import styled, { keyframes } from "styled-components";

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ShakeWrapper = styled.div`
  &.shake {
    animation: ${shake} 0.4s ease;
  }
`;

export const SubButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`;

export const ErrorMessage = styled.div`
  margin-top: 12px;
  color: #fa5252;
  font-size: 14px;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

export const SNSButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  background-color: #f1f3f5;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background 0.2s;

  &:hover {
    background-color: #e9ecef;
  }
`;

export const Container = styled.div`
  background-color: #1c1c3c;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoginBox = styled.div`
  background-color: #2c2c54;
  padding: 48px 36px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 380px;
  animation: ${slideUp} 0.6s ease-out;
`;

export const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
`;

export const ServiceName = styled.h1`
  font-size: 28px;
  color: white;
  margin: 0;
  user-select: none;
`;

export const SubTitle = styled.p`
  font-size: 14px;
  color: #bbb;
  margin-top: 8px;
  user-select: none;
`;

export const Input = styled.input`
  padding: 12px 14px;
  margin-bottom: 16px;
  border: 1px solid #444;
  border-radius: 8px;
  background-color: #1f1f3d;
  color: white;
  font-size: 15px;
  width: 100%;
  box-sizing: border-box;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: 2px solid #4fa94d;
  }

  &.shake {
    animation: ${shake} 0.3s ease-in-out;
  }
`;
export const AccountSelect = styled.select`
  padding: 12px 14px;
  margin-bottom: 16px;
  border: 1px solid #444;
  border-radius: 8px;
  background-color: #1f1f3d;
  color: white;
  font-size: 15px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: 2px solid #4fa94d;
  }
`;

export const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const TogglePassword = styled.button`
  all: unset;
  position: absolute;
  right: 12px; // 오른쪽 여백 조정
  top: 40%;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  align-items: center;
  color: white;

  &:hover {
    background: none;
    opacity: 1;
    transform: translateY(-50%);
  }
`;

export const CheckboxLabel = styled.label`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #ccc;
  margin-bottom: 20px;
  cursor: pointer;

  input {
    accent-color: #4fa94d;
  }
`;

export const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  background-color: #4fa94d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 12px;
  font-weight: bold;
  width: 100%;
  &:hover {
    background-color: #3c8c3c;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SubButton = styled.button`
  padding: 10px;
  background-color: transparent;
  color: white;
  border: 1px solid #555;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  margin-top: 8px;

  &:last-child {
    text-align: center;
  }

  &:hover {
    background-color: #333;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LogoTitleWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
`;
