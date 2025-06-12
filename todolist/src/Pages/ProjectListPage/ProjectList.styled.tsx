import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled.div`
  padding: 24px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: #ffffff;
`;

export const Title = styled.h2`
  margin-bottom: 16px;
  font-size: 22px;
  font-weight: bold;
`;

export const ProjectList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 12px;
  animation: ${fadeIn} 0.3s ease;
`;

export const CardGrid = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 12px;
  animation: ${fadeIn} 0.3s ease;
`;

export const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ProjectInput = styled.input`
  flex: 1;
  padding: 8px 10px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.inputBg};
  color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: 6px;

  &::placeholder {
    color: #aaa;
  }
`;

export const DescriptionInput = styled.input`
  flex: 2;
  padding: 8px 10px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.inputBg};
  color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: 6px;

  &::placeholder {
    color: #aaa;
  }
`;

export const AddButton = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const ToggleButton = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryHover};
  }
`;
export const ProjectItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 16px;
  transition: background-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  animation: ${fadeIn} 0.3s ease;

  span {
    cursor: pointer;
    color: #ffffff;

    &:hover {
      text-decoration: underline;
    }
  }

  &:hover {
    background-color: #3b3e7a;
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

export const CardItem = styled.li`
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 8px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: background-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  animation: ${fadeIn} 0.3s ease;

  &:hover {
    background-color: #3b3e7a;
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.dangerHover};
  }
`;

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PinButton = styled.button`
  background: none;
  border: none;
  color: #ffd700;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

export const RecentBadge = styled.span`
  background-color: #ff9800;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
`;

export const EditInput = styled.input`
  padding: 8px;
  font-size: 14px;
  margin-right: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  margin: 12px 0;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
`;
export const SearchButton = styled.button`
  padding: 10px 16px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const StyledLogoutButton = styled.button`
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.logoutBg};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.logoutHover};
  }
`;

export const ViewToggleButton = styled.button`
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.viewToggleBg};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.viewToggleHover};
  }
`;

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  margin: 0 0 8px 0;
  font-size: 14px;
`;

export const PinnedBar = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.pinnedBarBg};
  padding: 8px;
  z-index: 1;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`;
