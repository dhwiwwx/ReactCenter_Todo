/*
 * 데모용 이슈 데이터를 Firestore에 추가하는 스크립트입니다.
 * 사용법: 프로젝트 루트에서 `npx ts-node scripts/seedIssues.ts <프로젝트ID>`
 * (또는 다른 TypeScript 실행 도구 사용)
 * Firebase 환경 변수(REACT_APP_FIREBASE_*)는 미리 설정되어 있어야 합니다.
 */

import fs from "fs";
import path from "path";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const ENV_FILES = [".env.local", ".env"];

const loadEnvFile = (filePath: string) => {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf-8");
  content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .forEach((line) => {
      const [key, ...rest] = line.split("=");
      if (!key) return;
      const value = rest.join("=").replace(/^"|"$/g, "");
      if (!process.env[key]) {
        process.env[key] = value;
      }
    });
};

ENV_FILES.forEach((file) => loadEnvFile(path.resolve(process.cwd(), file)));

const STATUSES = ["할 일", "진행 중", "완료"] as const;
const PRIORITIES = ["긴급", "높음", "보통", "낮음"] as const;

interface SeedIssue {
  title: string;
  description: string;
  status: (typeof STATUSES)[number];
  priority: (typeof PRIORITIES)[number];
  dueInDays: number;
  tags: string[];
}

const sampleIssues: SeedIssue[] = [
  {
    title: "사용자 인증 개선",
    description: "소셜 로그인 도입 전 PoC 결과를 정리하고 액션 플랜을 작성합니다.",
    status: "할 일",
    priority: "긴급",
    dueInDays: 2,
    tags: ["auth", "release"],
  },
  {
    title: "프로젝트 대시보드 위젯 정리",
    description: "팀 별 KPI를 재정렬하고 불필요한 위젯을 정리합니다.",
    status: "진행 중",
    priority: "높음",
    dueInDays: 5,
    tags: ["dashboard"],
  },
  {
    title: "알림 센터 최적화",
    description: "읽지 않은 알림 배지를 개선하고 알림 목록 무한 스크롤을 구현합니다.",
    status: "할 일",
    priority: "보통",
    dueInDays: 7,
    tags: ["notification", "ui"],
  },
  {
    title: "빌드 파이프라인 점검",
    description: "CI 캐시 적중률을 점검하고 병렬 작업 구성을 검토합니다.",
    status: "진행 중",
    priority: "보통",
    dueInDays: 3,
    tags: ["devops"],
  },
  {
    title: "신규 온보딩 플로우 QA",
    description: "온보딩 A/B 테스트 시나리오를 검증하고 결과를 정리합니다.",
    status: "완료",
    priority: "낮음",
    dueInDays: -1,
    tags: ["qa"],
  },
  {
    title: "모바일 다크모드 지원",
    description: "모바일 환경에서 테마 컬러가 잘 동작하는지 확인하고 폴백을 추가합니다.",
    status: "할 일",
    priority: "높음",
    dueInDays: 9,
    tags: ["mobile", "ux"],
  },
  {
    title: "검색 성능 개선",
    description: "Firestore 인덱스 구성을 재검토하고 쿼리 응답 속도를 측정합니다.",
    status: "진행 중",
    priority: "높음",
    dueInDays: 4,
    tags: ["performance"],
  },
  {
    title: "알림 이메일 템플릿 정비",
    description: "마케팅 팀 요청 사항 반영 및 다국어 지원 체크",
    status: "할 일",
    priority: "낮음",
    dueInDays: 11,
    tags: ["email"],
  },
  {
    title: "버그바운티 응답",
    description: "최근 접수된 보안 이슈를 triage 하고 우선순위를 부여합니다.",
    status: "할 일",
    priority: "긴급",
    dueInDays: 1,
    tags: ["security"],
  },
  {
    title: "제품 로드맵 업데이트",
    description: "다음 분기 목표와 마일스톤을 최신화합니다.",
    status: "완료",
    priority: "보통",
    dueInDays: -4,
    tags: ["planning"],
  },
];

const createDeadline = (daysFromNow: number) => {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  base.setDate(base.getDate() + daysFromNow);
  return base.toISOString();
};

const main = async () => {
  const [, , projectId] = process.argv;
  if (!projectId) {
    console.error("프로젝트 ID를 지정해주세요. 예: npx ts-node scripts/seedIssues.ts <프로젝트ID>");
    process.exit(1);
  }

  const { db } = await import("../src/Firebase/firebase");

  console.log(`프로젝트(${projectId})에 샘플 이슈를 추가합니다...`);

  for (const issue of sampleIssues) {
    await addDoc(collection(db, "issues"), {
      title: issue.title,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      deadline: createDeadline(issue.dueInDays),
      tags: issue.tags,
      projectId,
      createdAt: serverTimestamp(),
    });
    console.log(`✔ ${issue.title}`);
  }

  console.log("모든 샘플 이슈가 추가되었습니다.");
};

main().catch((error) => {
  console.error("시드 작업 중 오류가 발생했습니다.", error);
  process.exit(1);
});
