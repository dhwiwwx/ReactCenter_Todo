import styled from "styled-components";

export const Title = styled.h1`
  font-size: 40px;
  font-weight: 200;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 1000px;
  height: 100vh;
  margin: 0 auto;
  background-color: #22254b;
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
  height: 50px;
  border: none;
  outline: none;
  font-size: 20px;
  font-weight: 400;
`;

export const Button = styled.button`
  width: 130px;
  height: 52px;
  border: none;
  font-size: 18px;
  font-weight: 600;

  :hover {
    background-color: rgb(93, 242, 93);
    transition: 0.3s;
    color: #fff;
  }
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  width: 700px;
  margin: 0 auto;
  height: 80%;
  background-color: #373b69;
  border-radius: 2%;
  box-shadow: 19px 17px 2px 1px rgba(0, 0, 0, 0.2);
`;

export const Todo = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  width: 80%;
  height: 60px;
  font-size: 25px;
  font-weight: 100;
  border-bottom: 1px solid #fff;
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
