import styled from "styled-components";

export const Container = styled.div`
  background-color: #1c1c3c;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SignupBox = styled.div`
  background-color: #2c2c54;
  padding: 48px 36px;
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 400px;
  max-width: 90vw;
`;

export const Title = styled.h2`
  font-size: 26px;
  color: white;
  text-align: center;
  margin-bottom: 12px; // 🔥 기존보다 1.5배 이상 넓힘
`;

export const SubTitle = styled.p`
  font-size: 14px;
  color: #bbb;
  text-align: center;
  margin-bottom: 40px; // 🔥 인풋이랑 훨씬 멀리 떨어지게
`;

export const Input = styled.input<{ hasError?: boolean }>`
  padding: 12px 14px;
  margin-bottom: 16px;
  border: 1px solid ${({ hasError }) => (hasError ? "#ff6b6b" : "#444")};
  border-radius: 10px;
  background-color: #1f1f3d;
  color: white;
  font-size: 15px;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => (hasError ? "#ff6b6b" : "#4fa94d")};
    box-shadow: 0 0 0 2px
      ${({ hasError }) =>
        hasError ? "rgba(255, 107, 107, 0.4)" : "rgba(79, 169, 77, 0.3)"};
    background-color: #25254d;
  }
`;

export const EmailRow = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 4px;
`;

export const EmailInput = styled(Input)`
  margin-bottom: 0;
`;

export const InfoText = styled.p<{ color: string }>`
  font-size: 13px;
  margin: 6px 0 12px 4px;
  color: ${({ color }) => color};
  transition: color 0.2s ease;
`;

export const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  background-color: #4fa94d;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  margin-top: 8px;
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
  margin-top: 16px;
  text-decoration: underline;
  transition: color 0.2s;

  &:hover {
    color: #748ffc;
  }
`;
