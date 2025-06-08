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
  overflow-y: auto;
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

export const List = styled.div`
  display: grid;
  grid-template-columns: repeat(
    3,
    minmax(0, 1fr)
  ); // 💡 3열 고정, 내용이 넘치면 줄바꿈
  gap: 20px;
  width: 90%;
  max-width: 1000px;
  margin: 24px auto 0 auto;
  padding: 20px;
  background-color: #373b69;
  border-radius: 12px;
  box-shadow: 19px 17px 2px 1px rgba(0, 0, 0, 0.2);

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr)); // 📱 태블릿 대응
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr; // 📱 모바일 대응
  }
`;

export const Todo = styled.div`
  background-color: #2c2e50;
  color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(25, 18, 18, 0.1);
  min-height: 150px;
  width: 100%; // ✅ 유지
  box-sizing: border-box; // ✅ 중요
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }
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
  caret-color: transparent;

  &::placeholder {
    color: #adb5bd;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #4dabf7;
    background-color: #2b2e55;
    caret-color: #4dabf7; /* 포커스일 때 커서 보이게 */
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

export const CardWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px; // 더 넉넉하게
  padding: 20px;
  border-radius: 12px;
  color: white;
`;

export const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
`;

export const CardDescription = styled.p`
  font-size: 15px;
  margin: 0;
  line-height: 1.4;
  color: #f1f1f1;
`;

export const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: #aaa;
`;

export const StatusBadge = styled.div<{ status: string }>`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${({ status }) =>
    status === "완료"
      ? "#81c784"
      : status === "진행 중"
      ? "#64b5f6"
      : "#ffd54f"};
  color: ${({ status }) =>
    status === "완료"
      ? "#1b5e20"
      : status === "진행 중"
      ? "#0d47a1"
      : "#5d4037"};
`;

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 24px 0;
`;

export const PageButton = styled.button<{ active?: boolean }>`
  background-color: ${({ active }) => (active ? "#ffd447" : "#2c2f50")};
  color: ${({ active }) => (active ? "#1c1c1c" : "#fff")};
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #ffd447;
    color: #1c1c1c;
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

export const DeadlineTag = styled.span<{ status: string }>`
  align-self: flex-end;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 10px;
  background-color: ${({ status }) =>
    status.includes("마감 지남")
      ? "#ff6b6b"
      : status.includes("오늘 마감")
      ? "#feca57"
      : status.includes("임박")
      ? "#ff9f43"
      : "#48dbfb"};
  color: #fff;
  margin-top: auto;
`;

export const Tag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  margin-top: 4px;
  margin-right: 6px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
`;

export const CategoryTag = styled(Tag)`
  background-color: #5c6bc0; // 보라색 계열
`;

export const PriorityTag = styled(Tag)<{ priority: string }>`
  background-color: ${({ priority }) =>
    priority === "높음"
      ? "#e74c3c"
      : priority === "중간"
      ? "#f1c40f"
      : "#2ecc71"};
`;

export const ScrollableListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
`;

export const BackButton = styled.button`
  background-color: transparent;
  border: 1px solid #fff;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 10px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  svg {
    margin-right: 6px;
  }
`;

export const ProgressContainer = styled.div`
  width: 90%;
  max-width: 1000px;
  margin: 0 auto 10px auto;
  background: #444;
  border-radius: 8px;
  overflow: hidden;
`;
export const ProgressBar = styled.div<{ percent: number }>`
  height: 8px;
  background: ${({ percent }) =>
    percent < 30 ? "#ff6b6b" : percent < 70 ? "#feca57" : "#51cf66"};
  width: ${({ percent }) => percent}%;
  transition: width 0.3s ease, background 0.3s ease;
`;
