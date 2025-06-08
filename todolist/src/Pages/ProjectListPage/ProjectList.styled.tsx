import styled from "styled-components";

export const Container = styled.div`
  padding: 24px;
  min-height: 100vh;
  background-color: #22254b;
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
`;

export const CardGrid = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 12px;
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
  background-color: #2a2e5b;
  color: #fff;
  border: 1px solid #444c77;
  border-radius: 6px;

  &::placeholder {
    color: #aaa;
  }
`;

export const DescriptionInput = styled.input`
  flex: 2;
  padding: 8px 10px;
  font-size: 14px;
  background-color: #2a2e5b;
  color: #fff;
  border: 1px solid #444c77;
  border-radius: 6px;

  &::placeholder {
    color: #aaa;
  }
`;

export const AddButton = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  background-color: #4fa94d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #3b8c3a;
  }
`;
export const ProjectItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #2c2f65;
  border: 1px solid #3a3d70;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 16px;
  transition: background-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

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
  background-color: #2c2f65;
  border: 1px solid #3a3d70;
  border-radius: 8px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: background-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

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
  color: #ff6b6b;
  cursor: pointer;

  &:hover {
    color: #ff3b3b;
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
  background-color: #4fa94d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #3b8c3a;
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
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #d9363e;
  }
`;

export const ViewToggleButton = styled.button`
  padding: 8px 12px;
  background-color: #4dabf7;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #339af0;
  }
`;

export const ErrorMessage = styled.p`
  color: #ff6b6b;
  margin: 0 0 8px 0;
  font-size: 14px;
`;
