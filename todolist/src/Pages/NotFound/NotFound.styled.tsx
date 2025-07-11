import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: #fff;
`;

export const Message = styled.h1`
  font-size: 32px;
  margin-bottom: 16px;
`;

export const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;
