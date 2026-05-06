# algorithm_practice

알고리즘 단원 수행평가 전에 학습할 수 있도록 만든 정적 웹사이트입니다.  
탐색/정렬/효율성 이론 페이지와 직접 풀이 가능한 연습장을 포함합니다.

## 링크

- GitHub: <https://github.com/sweet1203/algorithm_practice>

## 주요 기능

- 탐색 이론: 순차 탐색, 이진 탐색(중간값: `(low + high) / 2`의 정수 몫)
- 정렬 이론: 버블 정렬, 삽입 정렬, 퀵 정렬(피벗: 구간 첫 원소 고정)
- 단계형 시뮬레이터: 버튼으로 한 단계씩 진행하며 알고리즘 동작 확인
- 연습장: 탐색/정렬/효율성 문제 풀이, 즉시 채점, 과정 설명
- 점수 저장: `localStorage` 기반 누적 점수/정답률

## 프로젝트 구성

- `index.html`: 메인 홈
- `search.html`: 탐색 이론 + 시뮬레이터
- `sort.html`: 정렬 이론 + 시뮬레이터
- `efficiency.html`: 효율성 비교 + 퀴즈
- `algorithm-practice.html`: 실전 연습장
- `common.css`: 공통 스타일
- `common.js`: 공통 유틸 함수

## 로컬 실행

별도 빌드 없이 브라우저에서 HTML 파일을 열면 실행됩니다.

권장:
1. VS Code/Cursor Live Server로 `index.html` 실행
2. 또는 정적 서버 사용

예시(Python):

```bash
python -m http.server 5500
```

브라우저에서 `http://localhost:5500/index.html` 접속

## 배포

정적 사이트이므로 Vercel, Netlify, GitHub Pages 등에 바로 배포 가능합니다.  
Vercel 배포 상세는 `Vercel배포가이드.md`를 참고하세요.

## 사용 대상

- 고등학교 정보 수업 알고리즘 단원 학습
- 수행평가 전 개념 복습 및 문제 풀이 연습
