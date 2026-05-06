# 수행평가 제출 — Google 스프레드시트 연동 가이드

`assessment.html`에서 학생이 **제출하기**를 누르면, 아래에 붙여 넣는 **Google Apps Script 웹앱**으로 데이터가 전송되어 스프레드시트에 한 줄씩 쌓입니다.  
(브라우저는 보안상 응답 본문을 읽지 못할 수 있어도, 시트에 행이 추가되면 정상입니다.)

---

## 1. 스프레드시트 만들기

1. Google 드라이브에서 **새 스프레드시트**를 만듭니다.
2. 첫 번째 시트 이름을 `제출`로 바꿉니다. (다른 이름을 쓰려면 스크립트 안의 `getSheetByName`도 같이 바꾸세요.)
3. **1행**에 아래 열 제목을 **왼쪽부터 순서대로** 붙여 넣습니다. (탐색·정렬은 같은 배열로 선형+이진, 버블+삽입+퀵을 모두 제출하는 형식입니다.)

| 열 | 헤더 이름 | 비고 |
|----|-----------|------|
| A | 제출시각 | 자동 |
| B | 학번 | |
| C | 이름 | |
| D | 반 | |
| E | 탐색배열JSON | 정렬된 배열 `[...]` |
| F | 목표값 | 숫자 |
| G | 선형경로답 | JSON 배열 문자열 |
| H | 선형횟수답 | 문자열 |
| I | 선형정답 | 채점 `O`/`X` |
| J | 이진경로답 | JSON 배열 문자열 |
| K | 이진횟수답 | 문자열 |
| L | 이진정답 | 채점 `O`/`X` |
| M | 정렬초기배열JSON | 원본(섞인) 배열 |
| N | 버블1회답 | JSON 배열 문자열 |
| O | 버블2회답 | JSON 배열 문자열 |
| P | 버블정답 | 채점 `O`/`X` |
| Q | 삽입1회답 | JSON 배열 문자열 |
| R | 삽입2회답 | JSON 배열 문자열 |
| S | 삽입정답 | 채점 `O`/`X` |
| T | 퀵1회답 | JSON 배열 문자열 |
| U | 퀵2회답 | JSON 배열 문자열 |
| V | 퀵정답 | 채점 `O`/`X` |
| W | 효율1상황 | 문장 |
| X | 효율1답 | 학생 입력(공백 제거 후 저장) `선형탐색`/`이진탐색` |
| Y | 효율1정답 | 채점 `O`/`X` |
| Z | 효율2상황 | 문장 |
| AA | 효율2답 | 학생 입력 |
| AB | 효율2정답 | 채점 `O`/`X` |

- **선형정답·이진정답·버블정답·삽입정답·퀵정답·효율1정답·효율2정답** 열: 브라우저에서 채점한 `O`/`X`만 저장되며 **학생 화면에는 표시되지 않습니다.**
- 효율성 정답 형식: `선형탐색` 또는 `이진탐색`만 인정(제출 시 공백 제거 후 비교).

### 1행 헤더를 Apps Script로 한 번에 만들기

스프레드시트에 **붙어 있는**(바인딩) Apps Script 프로젝트에서 아래 함수를 추가한 뒤, 편집기 상단에서 **`setupSubmissionSheetHeaders`** 를 선택하고 **▶ 실행**하면 됩니다.

- `제출` 이라는 이름의 시트가 없으면 **새로 만듭니다.**
- `제출` 시트의 **1행 A1~AB1**에 위 표와 같은 헤더를 쓰고, **굵게** 표시한 뒤 **1행 고정**을 걸어 둡니다.
- 이미 1행에 다른 내용이 있으면 **같은 칸이 덮어씌워지므로**, 실행 전에 백업이 필요하면 복사해 두세요.

```javascript
/**
 * 스프레드시트에서 ▶ 실행 — "제출" 시트 1행에 제출용 헤더 생성
 * (이 스크립트가 해당 스프레드시트에 연결되어 있어야 합니다.)
 */
function setupSubmissionSheetHeaders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('제출');
  if (!sh) {
    sh = ss.insertSheet('제출');
  }
  var headers = [
    '제출시각', '학번', '이름', '반',
    '탐색배열JSON', '목표값',
    '선형경로답', '선형횟수답', '선형정답',
    '이진경로답', '이진횟수답', '이진정답',
    '정렬초기배열JSON',
    '버블1회답', '버블2회답', '버블정답',
    '삽입1회답', '삽입2회답', '삽입정답',
    '퀵1회답', '퀵2회답', '퀵정답',
    '효율1상황', '효율1답', '효율1정답',
    '효율2상황', '효율2답', '효율2정답'
  ];
  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sh.setFrozenRows(1);
}

/** (선택) 스프레드시트를 열 때 메뉴에 "1행 헤더 만들기" 추가 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('수행평가')
    .addItem('1행 헤더 만들기', 'setupSubmissionSheetHeaders')
    .addToUi();
}
```

첫 실행 시 **권한 허용** 창이 뜰 수 있습니다. 메뉴는 `onOpen` 을 저장한 뒤 **시트를 새로고침**하면 상단에 `수행평가` 메뉴로도 실행할 수 있습니다.

> **주의:** `doPost` 만 있는 **독립(standalone)** Apps Script 프로젝트에는 `getActiveSpreadsheet()` 가 없습니다. 헤더 생성은 반드시 **그 스프레드시트 파일 안에서 만든** Apps Script에서 실행하세요. (같은 프로젝트에 `doPost` 와 이 함수를 함께 두면 됩니다.)

---

## 2. Apps Script 프로젝트 추가

1. 스프레드시트에서 **확장 프로그램 → Apps Script**를 엽니다.
2. 기본 코드를 지우고, **위의 `setupSubmissionSheetHeaders` / `onOpen`(선택)** 과 아래 **`doPost` 코드**를 한 프로젝트에 함께 넣습니다. (헤더 함수는 이미 붙여 넣었다면 `doPost` 만 추가하면 됩니다.)
3. 아래에서 **`SPREADSHEET_ID`** 를 쓰는 방식은 **독립 프로젝트**용입니다. 스프레드시트에 바인딩한 스크립트라면 `doPost` 안을 `SpreadsheetApp.getActiveSpreadsheet().getSheetByName('제출')` 로 바꿔도 됩니다.
4. `SPREADSHEET_ID` 부분을 **자신의 스프레드시트 ID**로 바꿉니다.  
   (브라우저 주소창 `https://docs.google.com/spreadsheets/d/여기가_ID/edit` 에서 확인)

```javascript
// 스프레드시트 ID (URL 중 /d/ 와 /edit 사이)
var SPREADSHEET_ID = '여기에_스프레드시트_ID_붙여넣기';

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
      data.searchTarget,
      data.searchLinearPath,
      data.searchLinearCount,
      data.searchLinearCorrect,
      data.searchBinaryPath,
      data.searchBinaryCount,
      data.searchBinaryCorrect,
      data.sortArrayJson,
      data.sortBubbleR1,
      data.sortBubbleR2,
      data.sortBubbleCorrect,
      data.sortInsertR1,
      data.sortInsertR2,
      data.sortInsertCorrect,
      data.sortQuickR1,
      data.sortQuickR2,
      data.sortQuickCorrect,
      data.eff1Situation,
      data.eff1Answer,
      data.eff1Correct,
      data.eff2Situation,
      data.eff2Answer,
      data.eff2Correct
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

5. **저장** (디스크 아이콘) 후 프로젝트 이름을 예: `수행평가제출` 으로 바꿔도 됩니다.

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
const ASSESSMENT_SUBMIT_URL = 'https://script.google.com/macros/s/xxxx.../exec';
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
