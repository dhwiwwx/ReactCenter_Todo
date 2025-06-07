import styled from "styled-components";

export const Container = styled.div`
  background-color: #1c1c3c;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoginBox = styled.div`
  background-color: #2d2d5a;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 340px;
`;

export const LogoTitleWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
`;

export const Input = styled.input`
  padding: 12px;
  margin-bottom: 16px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
`;

export const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  background-color: white;
  color: #1c1c3c;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 12px;
  font-weight: bold;
  width: 100%;

  &:hover {
    background-color: #ddd;
  }
`;

export const SubButton = styled(Button)`
  background-color: transparent;
  color: white;
  border: 1px solid white;

  &:hover {
    background-color: white;
    color: #1c1c3c;
  }
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
  color: #ccc;
  margin-top: 8px;
  user-select: none;
`;

export const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const TogglePassword = styled.button`
  position: absolute;
  right: 10px;
  top: 40%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: #888;
  padding: 0;
`;

export const CheckboxLabel = styled.label`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #ccc;
  margin-bottom: 16px;
`;
