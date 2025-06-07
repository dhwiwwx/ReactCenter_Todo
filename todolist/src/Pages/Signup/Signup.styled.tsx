import styled from "styled-components";

export const Container = styled.div`
  background-color: #1c1c3c;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SignupBox = styled.div`
  background-color: #2d2d5a;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  width: 320px;
`;

export const Title = styled.h2`
  color: white;
  text-align: center;
  margin-bottom: 24px;
`;

export const Input = styled.input`
  padding: 12px;
  margin-bottom: 16px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: 16px;
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

  &:hover {
    background-color: #ddd;
  }
`;

export const EmailRow = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  margin-bottom: 16px;
`;

export const EmailInput = styled.input`
  flex: 1;
  height: 52px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  padding: 0 16px;
  box-sizing: border-box;
`;

export const CheckButton = styled.button`
  width: 100px;
  height: 52px;
  font-size: 15px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background-color: white;
  color: #1c1c3c;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

export const InfoText = styled.p<{ color: string }>`
  font-size: 14px;
  margin: 4px 0 10px 4px;
  color: ${({ color }) => color};
`;
export const LinkButton = styled.button`
  background: none;
  border: none;
  color:rgb(184, 193, 229);
  font-size: 14px;
  cursor: pointer;
  margin-top: 12px;
  text-decoration: underline;
  transition: color 0.2s;

  &:hover {
    color: #748ffc;
  }
`;