import styled, { keyframes, css } from "styled-components";

// 흔들기 애니메이션
const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  15% { transform: translateX(-5px); }
  30% { transform: translateX(5px); }
  45% { transform: translateX(-4px); }
  60% { transform: translateX(4px); }
  75% { transform: translateX(-2px); }
  90% { transform: translateX(2px); }
  100% { transform: translateX(0); }
`;

export const Container = styled.div`
  background-color: #1c1c3c;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(16px, 6vw, 32px);
`;

export const SignupBox = styled.div`
  background-color: #2c2c54;
  padding: 56px 40px;
  border-radius: 20px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 400px;
  max-width: 90vw;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
`;

export const Title = styled.h2`
  font-size: clamp(24px, 5vw, 28px);
  color: white;
  font-weight: bold;
  text-align: center;
  margin: 0;
`;

export const SubTitle = styled.p`
  font-size: clamp(13px, 4vw, 14px);
  color: #bbbbcc;
  text-align: center;
  margin-top: 10px;
`;

// ✅ Input에 shake 애니메이션 조건 추가됨
export const Input = styled.input<{ hasError?: boolean; shake?: boolean }>`
  height: 48px;
  padding: 0 16px;
  margin-bottom: 18px;
  border: 1px solid ${({ hasError }) => (hasError ? "#ff6b6b" : "#3b3b60")};
  border-radius: 12px;
  background-color: #1e1e3f;
  color: white;
  font-size: 15px;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &::placeholder {
    color: #888;
  }

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => (hasError ? "#ff6b6b" : "#4fa94d")};
    box-shadow: 0 0 0 2px
      ${({ hasError }) =>
        hasError ? "rgba(255, 107, 107, 0.4)" : "rgba(79, 169, 77, 0.3)"};
    background-color: #272752;
  }

  ${({ shake }) =>
    shake &&
    css`
      animation: ${shakeAnimation} 0.4s ease-in-out;
    `}
`;

export const EmailRow = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 0;
`;

export const EmailInput = styled(Input)`
  margin-bottom: 18px;
`;

export const InfoText = styled.p<{ color: string }>`
  font-size: 13px;
  margin: -10px 0 16px 6px;
  color: ${({ color }) => color};
  transition: color 0.2s ease;
`;

export const ErrorText = styled.p`
  font-size: 13px;
  color: #ff6b6b;
  margin: -8px 0 14px 6px;
`;

export const Button = styled.button`
  padding: 14px;
  font-size: 16px;
  background-color: #4fa94d;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  margin-top: 10px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #3c8c3c;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LinkButton = styled.button`
  background: none;
  border: none;
  color: #b8c1e5;
  font-size: 14px;
  cursor: pointer;
  margin-top: 20px;
  text-decoration: underline;
  transition: color 0.2s ease;

  &:hover {
    color: #748ffc;
  }
`;

export const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const TogglePasswordButton = styled.button`
  position: absolute;
  right: 12px;
  top: 40%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;

  &:hover {
    color: white;
  }
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

export const SubmissionMessage = styled.p<{ variant: "success" | "error" }>`
  margin-top: 12px;
  font-size: 14px;
  color: ${({ variant }) => (variant === "success" ? "#4fa94d" : "#ff6b6b")};
  text-align: center;
  animation: ${fadeIn} 0.25s ease;
`;
