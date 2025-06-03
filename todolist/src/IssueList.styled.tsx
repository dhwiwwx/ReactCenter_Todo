import styled from "styled-components";

export const Title = styled.h1`
  font-size: 40px;
  font-weight: 200;
  color: #fff;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  user-select: none;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0 auto;
  background-color: #22254b;
`;

// ✅ 상단 타이틀 + 로그아웃 정렬용
export const HeaderRow = styled.div`
 display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  margin-bottom: 20px;
`;

// ✅ 검색창 + 버튼 정렬용
export const SearchRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

export const RowBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20%;
`;

export const Input = styled.input`
  padding-left: 20px;
  width: 450px;
  height: 52px;
  border: none;
  outline: none;
  font-size: 20px;
  font-weight: 400;
  border-radius: 4px;
`;

export const Button = styled.button`
  width: 120px;
  height: 52px;
  border: none;
  font-size: 18px;
  font-weight: 600;
  border-radius: 4px;
  background-color: #f2f2f2;

  :hover {
    background-color: rgb(93, 242, 93);
    transition: 0.3s;
    color: #fff;
  }

  :nth-child(3):hover {
    background-color: #ff6b6b;
    transition: 0.3s;
    color: #fff;
  }
`;

export const InputButton = styled.button`
  width: 80px;
  height: 40px;
  font-size: 18px;
  font-weight: 100;
`;

export const EditDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  color: white;

  strong {
    font-size: 16px;
    font-weight: bold;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

export const EditInput = styled.input`
  width: 400px;
  height: 36px;
  font-size: 18px;
  font-weight: 100;
  outline: none;
`;

export const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  width: 90%;
  max-width: 1000px;
  margin: 24px auto 0 auto;
  padding: 20px;
  background-color: #373b69;
  border-radius: 12px;
  box-shadow: 19px 17px 2px 1px rgba(0, 0, 0, 0.2);
`;

export const Todo = styled.div`
  background-color: #2e2e5e;
  border-radius: 8px;
  padding: 16px;
  width: 165px;
  min-height: 100px;
  box-sizing: border-box;
  word-break: break-word;
`;

export const Remove = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dee2e6;
  font-size: 24px;
  cursor: pointer;
  &:hover {
    color: #ff6b6b;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const NoSelect = styled.div`
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
`;

export const StyledLogoutButton = styled.button`
  height: 42px;
  padding: 0 16px;
  border: 1px solid white;
  background-color: transparent;
  color: white;
  font-size: 15px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  user-select: none;

  &:hover {
    background-color: #ff6b6b;
    color: white;
    border-color: #ff6b6b;
  }
`;

const BaseButton = styled.button`
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
`;

export const StyledRegisterButton = styled(BaseButton)`
  background-color: #51cf66;
  color: #fff;

  &:hover {
    background-color: #40c057;
    transform: translateY(-1px);
  }

  &:active {
    background-color: #2f9e44;
    transform: translateY(0);
  }
`;

export const StyledSearchButton = styled(BaseButton)`
  background-color: #4dabf7;
  color: #fff;

  &:hover {
    background-color: #339af0;
    transform: translateY(-1px);
  }

  &:active {
    background-color: #228be6;
  }
`;

export const SearchInput = styled.input`
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background-color: #1f2240;
  color: #fff;
  font-size: 16px;
  width: 100%;
  max-width: 360px;
  user-select: none;

  &::placeholder {
    color: #adb5bd;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #4dabf7;
    background-color: #2b2e55;
  }

  transition: all 0.2s;
`;

export const SortSelect = styled.select`
  padding: 10px 14px;
  background-color: #1f2240;
  color: white;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;

  &:focus {
    box-shadow: 0 0 0 2px #4dabf7;
    background-color: #2b2e55;
  }

  option {
    background-color: #1f2240;
    color: white;
  }

  &::-ms-expand {
    display: none;
  }
`;
