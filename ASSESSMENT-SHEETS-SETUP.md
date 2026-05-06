# 수행평가 제출 — Google 스프레드시트 연동 가이드

`assessment.html`에서 학생이 **제출하기**를 누르면, 아래에 붙여 넣는 **Google Apps Script 웹앱**으로 데이터가 전송되어 스프레드시트에 한 줄씩 쌓입니다.  
(브라우저는 보안상 응답 본문을 읽지 못할 수 있어도, 시트에 행이 추가되면 정상입니다.)

---

## 1. 스프레드시트 만들기

1. Google 드라이브에서 **새 스프레드시트**를 만듭니다.
2. 첫 번째 시트 이름을 `제출`로 바꿉니다. (다른 이름을 쓰려면 스크립트 안의 `getSheetByName`도 같이 바꾸세요.)
3. **1행**에 아래처럼 열 제목을 붙여 넣습니다.

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 제출시각 | 학번 | 이름 | 반 | 탐색배열JSON | 탐색유형 | 목표값 | 탐색경로답 | 탐색횟수답 | 탐색정답 | 정렬초기배열JSON | 정렬유형 | 정렬1회정답 | 정렬2회정답 | 정렬정답 | 효율상황 | 효율선택 | 효율정답 |

- **탐색배열JSON / 정렬초기배열JSON**: `[30,31,32,...]` 형태의 문자열(JSON)로 들어옵니다.
- **탐색경로답 / 탐색횟수답**: 학생이 입력한 비교 경로(JSON 배열 문자열), 비교 횟수(문자열).
- **정렬1회정답 / 정렬2회정답**: 학생이 입력한 1·2회전 후 배열(JSON 배열 문자열). (열 이름은 ‘정답’이지만 저장 값은 **제출 답안**입니다.)
- **탐색유형**: `linear` 또는 `binary`
- **정렬유형**: `bubble`, `insertion`, `quick` 중 하나
- **탐색정답 / 정렬정답 / 효율정답**: 채점 결과 `O` 또는 `X` (학생 화면에는 표시하지 않음)

---

## 2. Apps Script 프로젝트 추가

1. 스프레드시트에서 **확장 프로그램 → Apps Script**를 엽니다.
2. 기본 코드를 지우고, 아래 코드를 **전부** 붙여 넣습니다.
3. `SPREADSHEET_ID` 부분을 **자신의 스프레드시트 ID**로 바꿉니다.  
   (브라우저 주소창 `https://docs.google.com/spreadsheets/d/여기가_ID/edit` 에서 확인)

```javascript
// 스프레드시트 ID (URL 중 /d/ 와 /edit 사이)
var SPREADSHEET_ID = '1MTYZEjyosy0KRcQ6Wu9oY5lDPf5z2Uw2Z98Chh6CwJY'

function doPost(e) {
  try {
    var raw = e.parameter.payload;
    if (!raw && e.postData && e.postData.contents) {
      raw = e.postData.contents;
    }
    if (!raw) {
      throw new Error('payload 없음');
    }
    var data = JSON.parse(raw);

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sh = ss.getSheetByName('제출');
    if (!sh) {
      throw new Error('시트 이름 "제출" 을 찾을 수 없습니다.');
    }

    sh.appendRow([
      new Date(),
      data.studentId,
      data.studentName,
      data.className,
      data.searchArrayJson,
      data.searchType,
      data.searchTarget,
      data.searchPathStudent,
      data.searchCountStudent,
      data.searchCorrect,
      data.sortArrayJson,
      data.sortType,
      data.sortRound1Student,
      data.sortRound2Student,
      data.sortCorrect,
      data.effSituation,
      data.effChoice,
      data.effCorrect
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** 브라우저에서 URL만 열어 배포가 살아 있는지 테스트할 때 사용 */
function doGet() {
  return ContentService.createTextOutput('assessment submit endpoint ok');
}
```

4. **저장** (디스크 아이콘) 후 프로젝트 이름을 예: `수행평가제출` 으로 바꿔도 됩니다.

---

## 3. 웹앱으로 배포

1. Apps Script 편집기에서 **배포 → 새 배포**를 누릅니다.
2. 유형: **웹 앱** 선택.
3. 설명: 예) `v1 수행평가 제출`
4. **실행 사용자**: 나  
5. **액세스 권한**: **모든 사용자** (학생 Google 계정 없이 제출할 수 있게 하려면 이 설정이 필요합니다. 학교 정책에 맞게 조정하세요.)
6. **배포** 후 나오는 **웹앱 URL**을 복사합니다. (끝이 `/exec` 로 끝나는 주소)

---

## 4. assessment.html 에 URL 넣기

1. `assessment.html` 파일을 연 뒤, 스크립트 맨 위 근처의 다음 줄을 찾습니다.

```javascript
const ASSESSMENT_SUBMIT_URL = '';
```

2. 따옴표 안에 **배포한 웹앱 URL**을 넣고 저장합니다.

```javascript
const ASSESSMENT_SUBMIT_URL = 'https://script.google.com/macros/s/AKfycbwL5fDQNHH5NIj1mfXnenK-nufquFAxtgW_JcNs8SneRE903GgM96qYraJsFBxvnsA/exec';
```

3. 이 파일을 **GitHub Pages**, **학교 웹 서버**, 또는 **구글 드라이브 공개 호스팅** 등 학생이 접속할 수 있는 곳에 올립니다.  
   (로컬 `file://` 로만 열면 일부 브라우저에서 제출이 막힐 수 있으니 **https 또는 http로 서빙**하는 것을 권장합니다.)

---

## 5. 동작 확인

1. 스프레드시트 헤더(1행)가 위와 같은지 확인합니다.
2. `assessment.html`에서 학번·이름·반을 넣고, 각 탭에 임의로 답을 적은 뒤 **제출하기**를 누릅니다.
3. 시트 `제출`에 **새 행**이 생기면 성공입니다.

### 제출이 시트에 안 쌓일 때 (점검 순서)

1. **웹앱 URL**이 반드시 **`.../exec`** 로 끝나는 **배포본** 주소인지 확인합니다. (`/dev` 는 본인만 될 수 있음)
2. 배포 시 **액세스 권한**이 학생 제출에 맞게 **「모든 사용자」**(또는 학교에서 쓰는 설정)인지 확인합니다.
3. 스크립트·시트를 바꾼 뒤에는 **새 배포**(또는 버전 관리에서 최신 배포)를 했는지 확인합니다. 옛 URL은 예전 코드를 가리킵니다.
4. 시트 이름이 코드의 **`제출`** 과 정확히 같은지, `SPREADSHEET_ID` 가 이 문서가 아닌 **지금 쓰는 파일**의 ID인지 확인합니다.
5. `assessment.html` 은 **`https` 또는 `http` 로 서빙**된 페이지에서 여는 것이 좋습니다. (`file://` 로 열면 브라우저에 따라 제출이 막히거나 이상 동작할 수 있습니다.)
6. **Apps Script 편집기 → 실행 기록**에서 `doPost` 오류(빨간 줄)가 있는지 봅니다. `JSON.parse` 실패 등이 있으면 시트에 행이 안 생깁니다.

> 참고: 예전에 쓰던 `fetch` + `no-cors` 방식은 Google 쪽으로 **POST 본문이 비어 가는** 경우가 있어, 현재 `assessment.html` 은 **숨긴 iframe + `<form method="POST">`** 로 보냅니다. `doPost` 에서는 여전히 `e.parameter.payload` 로 받으면 됩니다.

---

## 6. 보안·운영 참고

- 웹앱을 **모든 사용자**에 열어두면 URL을 아는 사람은 누구나 POST를 보낼 수 있습니다. 수업 중 URL 공유 범위를 제한하거나, 필요하면 스크립트에서 **비밀 토큰**을 payload에 넣어 검증하는 방식을 추가할 수 있습니다.
- 채점(`O`/`X`)은 **학생 브라우저에서 계산**되어 전송됩니다. 고득점 방지를 위해 완전한 방식은 아니며, 중요 시트만큼은 교사가 열을 기준으로 **추가 검증**하는 것을 권장합니다.
- 제출은 **폼 POST(iframe)** 로 보내므로, 학생 화면에서는 서버 응답 내용을 확인하지 않습니다. 시트에 행이 생겼는지로 성공 여부를 확인합니다.

---

## 전체 진행 순서 (계획 요약)

| 단계 | 내용 |
|------|------|
| 1 | 스프레드시트 + 1행 헤더 준비 |
| 2 | Apps Script에 `doPost` 코드 붙여넣기, `SPREADSHEET_ID` 수정 |
| 3 | 웹앱 배포 후 URL 복사 |
| 4 | `assessment.html`의 `ASSESSMENT_SUBMIT_URL`에 URL 저장 후 호스팅 |
| 5 | 테스트 제출 → 시트에 행 추가 확인 |

이후 필요하면 **한 학생 1회만 제출**하도록 안내하거나, 시트에서 학번 중복을 필터로 확인하면 됩니다.
