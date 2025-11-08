![초급프로젝트] 디자인 패턴 실습

## 1. 저장소 정보
- Github: https://github.com/igaeun8/design_pattern.git

## 2. 기본 예제 실행 및 제출 방법
각 패턴별 데모는 개별 페이지로 접근할 수 있습니다. 로컬에서 `npm run dev`로 개발 서버를 띄운 뒤 아래 경로로 접속하세요.

- 싱글톤: `/entries/singleton.html`
- 팩토리: `/entries/factory.html`
- 어댑터: `/entries/adapter.html`
- 데코레이터: `/entries/decorator.html`
- 옵저버: `/entries/observer.html`
- 방문자: `/entries/visitor.html`

필요 시 `package.json`의 `dev:*` 스크립트로 바로 해당 패턴을 실행할 수도 있습니다. 예: `npm run dev:singleton`

## 3. 실습 구현 과제
아래 세 가지 패턴은 직접 구현해야 하는 과제입니다. `/entries` 경로에서 예제를 실행하며 코드를 확인하세요.

- 생성 패턴 – 프로토타입 (`/entries/prototype.html`)
- 구조 패턴 – 컴포지트 (`/entries/composite.html`)
- 행위 패턴 – 커맨드 (`/entries/command.html`)

## 4. 프로젝트 설정

### 설치
```sh
npm install
```

### 개발 서버 실행
```sh
npm run dev
```

### 프로덕션 빌드
```sh
npm run build
```

### 참고
- Vite 콘피그: https://vite.dev/config/
