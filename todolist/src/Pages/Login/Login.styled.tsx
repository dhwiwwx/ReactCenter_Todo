import styled from "styled-components";

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
`;

export const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
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
`;

export const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const TogglePassword = styled.button`
  position: absolute;
  right: 12px;
  top: 40%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: #bbb;
  padding: 0;

  &:hover {
    color: white;
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

  &:hover {
    background-color: #333;
  }
`;

export const LogoTitleWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
`;
