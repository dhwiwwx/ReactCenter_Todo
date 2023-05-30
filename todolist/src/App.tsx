import React, { useEffect, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { MdDelete } from "react-icons/md";
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
} from "./App.styled";

function App() {
  interface Todo {
    id: number;
    name: string;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoNames, setTodoNames] = useState<string>("");

  const handleInputChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setTodoNames(value);
  };

  const addTodo = () => {
    if (!todoNames.trim()) return;
    setTodos((prevState) => [
      ...prevState,
      { id: prevState.length, name: todoNames },
    ]);
    setTodoNames("");
  };

  const handlePressEnter = ({ key }: KeyboardEvent<HTMLInputElement>) => {
    if (key === "Enter") addTodo();
  };

  useEffect(() => {
    try {
      const parseData = JSON.parse(localStorage.getItem("todos") || "");
      setTodos(parseData);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <Container>
      <Title>TodoList</Title>
      <List>
        {todos.map(({ id, name }) => {
          return (
            <Todo key={id}>
              {id + 1}. &nbsp;{name}
              <Remove>
                <MdDelete size={"27px"} />
              </Remove>
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
      </RowBox>
    </Container>
  );
}

export default App;
