# 🌸 알고리즘 연습장 - Vercel 배포 가이드

학생들이 탐색·정렬 알고리즘을 직접 풀어보며 즉시 피드백을 받을 수 있는 단일 HTML 웹 애플리케이션입니다.

## 📦 포함된 기능

- 🔍 **탐색 연습**: 순차 탐색 / 이진 탐색(중간값 정수 몫 방식)
- 🔄 **정렬 연습**: 버블 정렬 / 삽입 정렬 / 퀵 정렬 (1회전, 2회전 입력)
- ⚖️ **효율성 연습**: 8가지 상황 풀에서 랜덤 출제
- 📊 **점수 누적**: localStorage로 학생 정답률 자동 저장
- 💡 **단계별 해설**: AI 없이 알고리즘 동작 원리를 자동 생성
- 📱 **반응형 디자인**: PC, 태블릿, 스마트폰 모두 지원

## 🚀 Vercel 배포 방법 (3가지)

### 방법 ① 가장 쉬움: Vercel 웹사이트에서 드래그 & 드롭

1. https://vercel.com 접속 → 회원가입(GitHub/Google 계정으로 가능)
2. 로그인 후 우측 상단의 **[Add New...]** → **[Project]** 클릭
3. 화면 아래쪽의 **"Deploy a static project"** 또는 **"Browse"** 클릭
4. `index.html` 파일이 들어있는 **폴더 전체**를 드래그하여 업로드
5. 프로젝트 이름 입력 (예: `algorithm-practice`)
6. **[Deploy]** 버튼 클릭 → 약 30초 후 배포 완료!
7. 받은 링크(예: `https://algorithm-practice.vercel.app`)를 학생들에게 공유

### 방법 ② Vercel CLI (개발자 친화적)

```bash
# 1. Node.js가 설치되어 있어야 함
# 2. Vercel CLI 설치
npm install -g vercel

# 3. index.html이 있는 폴더로 이동
cd 폴더경로

# 4. 배포
vercel

# 처음 실행 시 로그인 안내가 나옴 → 안내대로 로그인
# 프로젝트 이름, 디렉토리 등 질문에 엔터로 진행
# 완료 후 URL이 출력됨
```

### 방법 ③ GitHub 연동 (수정·재배포 자동화에 좋음)

1. GitHub 저장소 생성 → `index.html` 업로드
2. Vercel에서 **[Add New...]** → **[Project]** → **GitHub 저장소 선택**
3. **[Deploy]** 클릭
4. 이후 GitHub에 코드를 수정하면 자동 재배포됨

**이 저장소는 루트에 `vercel.json`이 있어, Vercel에 “프레임워크 없음(정적 사이트)”으로 잡히도록 설정돼 있어요.** Git에 푸시한 뒤 다시 배포해 보세요.

---

## ❓ 배포가 안 될 때 (자주 나오는 원인)

1. **프로덕션 브랜치**  
   이 저장소는 기본 브랜치가 **`master`** 인 경우가 많아요. Vercel 프로젝트 → **Settings → Git → Production Branch**가 `main`이면 `master`로 바꾸거나, GitHub에서 기본 브랜치를 `main`으로 통일하세요.

2. **빌드 설정**  
   **Settings → General → Build & Development Settings**에서  
   - Framework Preset: **Other**  
   - Build Command: **비움**  
   - Output Directory: **비움**  
   - Install Command: **비움**  
   (`vercel.json`이 있으면 대부분 자동으로 맞춰집니다.)

3. **Root Directory**  
   저장소 루트에 `index.html`이 있으면 Root Directory는 **비워 두세요.** 하위 폴더만 올린 경우에만 해당 폴더 경로를 넣습니다.

4. **로그 확인**  
   실패한 배포를 눌러 **Building** 로그에 `npm run build` / `dist` 없음 등 메시지가 있는지 확인하세요. 메시지 그대로 검색하면 원인에 맞는 수정을 찾기 쉽습니다.

5. **권한**  
   GitHub에 Vercel 앱이 저장소에 접근할 수 있는지(조직 저장소면 관리자 승인) 확인하세요.

## 🎓 학생 사용 안내

배포 후 학생들에게 다음과 같이 안내하세요:

> 📱 **알고리즘 연습장** 링크: https://(여러분의-주소).vercel.app
> 
> - 컴퓨터, 휴대폰 모두 가능
> - 회원가입 불필요, 바로 풀어보세요
> - 점수는 본인 기기에 자동 저장됩니다
> - 모르는 부분은 [💡 과정 설명 보기]를 누르면 단계별로 알려줘요

## 🔧 커스터마이징 (선생님용)

`index.html` 파일 내부에서 다음 부분을 수정할 수 있습니다:

| 수정 위치 | 무엇을 바꿀 수 있나? |
|---|---|
| `SITUATIONS` 배열 (script 안) | 효율성 연습 상황 추가/수정 |
| `:root` CSS 변수 | 색상 테마 변경 |
| `newSearchProblem()` 함수 | 탐색 배열 범위(현재 1~50) 변경 |
| `newSortProblem()` 함수 | 정렬 배열 범위(현재 1~9) 변경 |

## 💡 비용

**완전 무료** ✨ 
- Vercel 무료 플랜으로 충분 (월 100GB 트래픽까지 무료)
- AI API 호출이 없어서 추가 비용 0원
- 학교 전체 학생이 사용해도 부담 없음

## 📝 라이선스

수업 활용에 자유롭게 사용·수정 가능합니다.
