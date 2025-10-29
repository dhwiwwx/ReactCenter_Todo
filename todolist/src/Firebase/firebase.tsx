// firebase.js 또는 firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// ✅ Firestore 인스턴스 초기화
const db = getFirestore(app);

/**
 * activity 컬렉션은 이슈의 생성/수정/삭제와 같은 주요 이벤트를 기록합니다.
 * Cloud Functions(예: Firestore 트리거)에서 issues 문서를 감시할 때도 아래 필드를 기준으로 문서를 작성할 수 있습니다.
 * - projectId, issueId
 * - type(이벤트 구분), message(요약), metadata(추가 정보)
 * - actorId, actorEmail, actorName
 * - targetUserIds(알림 대상), readBy(읽은 사용자), createdAt(serverTimestamp)
 */
export { db };
export const auth = getAuth(app);
export const storage = getStorage(app);
