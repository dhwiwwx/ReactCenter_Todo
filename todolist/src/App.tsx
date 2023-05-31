import React, { useEffect, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { MdDelete, MdBuild } from "react-icons/md";
import "./App.css";
import {
  Button,
  Container,
  Input,
  List,
  Remove,
  RowBox,
  Title,
  Todo,
  ButtonContainer,
  InputButton,
  EditInput,
} from "./App.styled";

function App() {
  interface Todo {
    id: number;
    name: string;
  }
  //todolist data를 저장하는 state
  const [todos, setTodos] = useState<Todo[]>([]);
  //todo를 추가하기 위해 적는내용을 담는 state
  const [todoNames, setTodoNames] = useState<string>("");
  //
  const [editId, setEditId] = useState<number | undefined>();
  // 수정 버튼을 누른뒤 나온 ㅑnput의 값을 수정하는데 써야하기 떄문에 state에 담아 놓는다.
  const [editName, setEditName] = useState<string>("");

  // todo를 추가해주는 함수
  const addTodo = () => {
    if (!todoNames.trim()) return;
    const count = Number(localStorage.getItem("count")) + 1;
    localStorage.setItem("count", `${count}`);
    setTodos((prevState) => [...prevState, { id: count, name: todoNames }]);
    setTodoNames("");
  };

  const resetTodo = () => {
    setTodos([]);
    localStorage.setItem("count", "0");
  };

  // todo를 만드는 input에서 enter를 놀랐을떄 todoㄹ르 추가해주는 함수
  const handlePressEnter = ({ key }: KeyboardEvent<HTMLInputElement>) => {
    if (key === "Enter") addTodo();
  };

  const handleInputChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setTodoNames(value);
  };

  const handleEditName = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setEditName(value);
  };

  // 컴포넌트(페이지)가 "차음" 렌더링 됐을 떄 localStoragem이 todosmfㄹ stateㅇ 넣어줌
  useEffect(() => {
    try {
      const parseData = JSON.parse(localStorage.getItem("todos") || "");
      setTodos(parseData);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // state todos가 변화 될 떄(추가, 삭제) localStorage에도 저장해줌
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <Container>
      <Title>TodoList</Title>
      <List>
        {todos.map(({ id, name }) => {
          const isEdit: boolean = editId === id;

          const deleteTodo = () => {
            setTodos((prevState) => prevState.filter((v) => v.id !== id));
          };
          const editTodo = () => {
            setTodos((prevState) =>
              prevState.map((todo) =>
                todo.id === id ? { ...todo, name: editName } : todo
              )
            );
            toggleEditTodo();
          };

          const toggleEditTodo = () => {
            setEditId(isEdit ? undefined : id);
          };
          return (
            <Todo key={id}>
              {isEdit ? (
                <EditInput defaultValue={name} onChange={handleEditName} />
              ) : (
                name
              )}
              <ButtonContainer>
                {!isEdit && (
                  <InputButton onClick={deleteTodo}>삭제</InputButton>
                )}
                <InputButton onClick={toggleEditTodo}>
                  {isEdit ? "취소" : "수정"}
                </InputButton>
              </ButtonContainer>

              {isEdit && <InputButton onClick={editTodo}>저장</InputButton>}
            </Todo>
          );
        })}
      </List>
      <RowBox>
        <Input
          placeholder="Todo를 입력해주세여 "
          onChange={handleInputChange}
          value={todoNames}
          onKeyUp={handlePressEnter}
        />
        <Button onClick={addTodo}>Button</Button>
        <Button onClick={resetTodo}>Reset</Button>
      </RowBox>
    </Container>
  );
}

export default App;
