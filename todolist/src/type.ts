import { type } from "os";

type Gender = "남" | "여";

interface User {
  naem: string;
  age: number;
  live: boolean;
  gender: Gender;
}

const user: LJW = {
  naem: "이정원",
  age: 23,
  live: true,
  gender: "남",
};

// 상속 extends를 써야함
interface LJW extends User {
  gf?: boolean;
}

const myTest: MyType | MyType2 = true;

// type을 생성하는 2가지 방법

// 1`
type MyType = boolean;
type MyType2 = null;

type MyTypes = {
  data: string;
};

// 2
interface MyInterface {
  data: string;
}

// ts 에서의 type들
type Test =
  | number //숫자
  | string //문자
  | undefined // 정의되지 않음
  | null // 값이 없음
  | Array<any> //배열
  | any // 만능 (모든게 다 들어 갈수 있음)
  | never // return type이 없거나 type이 없을떄 사용한다.
  | boolean // true or false
  | object // {}
  | void;
