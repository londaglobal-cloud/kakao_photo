# 내얼굴 이모티콘 생성기

> 사용자가 본인 얼굴 사진을 업로드하면 AI가 카카오톡 이모티콘 스타일의 12개 이미지 세트를 만들어주는 웹 서비스 (MVP)

## 한눈에 보기

- **흐름**: 사진 업로드 → AI 생성 12장 → 워터마크 미리보기 → 결제 4,900원 → PNG/ZIP 다운로드
- **결제 수단**: 카카오페이 / 네이버페이 / 삼성페이 / 애플페이 / 휴대폰결제 (모두 토스페이먼츠로 통합)
- **MVP 모드**: AI 이미지 생성과 결제 모두 mock 동작 → 실제 API 키만 넣으면 라이브로 전환

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (DB/Storage/Auth - 선택 활성화)
- Toss Payments (결제 통합)

## 시작하기

```bash
# 1) 의존성 설치
npm install

# 2) 환경변수 복사
cp .env.example .env.local

# 3) 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## 폴더 구조

```
kakao_photo/
├── src/
│   ├── app/
│   │   ├── page.tsx                       ← 1. 메인
│   │   ├── upload/page.tsx                ← 2. 업로드
│   │   ├── result/[jobId]/page.tsx        ← 3. 결과 미리보기 + 결제
│   │   ├── complete/[jobId]/page.tsx      ← 4. 결제 완료 + 다운로드
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── api/
│   │       ├── generate/route.ts          ← 12장 생성
│   │       ├── job/[jobId]/route.ts       ← 잡 조회
│   │       └── payment/
│   │           ├── confirm/route.ts       ← 결제 승인 (mock/real)
│   │           ├── success/route.ts       ← 토스 success redirect
│   │           └── fail/route.ts          ← 토스 fail redirect
│   ├── components/
│   │   └── EmoticonGrid.tsx               ← 12개 그리드 (4×3)
│   ├── services/
│   │   ├── imageAi.ts                     ← AI 이미지 생성 (provider 분리)
│   │   ├── payment.ts                     ← 토스페이먼츠 통합
│   │   └── storage.ts                     ← 잡 저장 (메모리 → Supabase 전환 용이)
│   └── lib/
│       ├── emoticons.ts                   ← 12개 프롬프트 프리셋
│       ├── supabase.ts                    ← Supabase 클라이언트
│       └── types.ts
├── .env.example
├── tailwind.config.ts
└── package.json
```

## 실제 API로 전환하기

### 1) AI 이미지 생성

`.env.local`:

```
IMAGE_AI_PROVIDER=gemini   # mock | gemini | openai | replicate
GEMINI_API_KEY=...
```

`src/services/imageAi.ts` 파일 안 `generateWithGemini()` 등의 `TODO` 주석 부분에 실제 API 호출 코드 작성.

가장 중요한 포인트: **얼굴 일관성 유지**.
- Gemini 2.5 Flash Image (Nano Banana): 얼굴 입력 + 12개 프롬프트 각각 호출
- FLUX Kontext (Replicate): 얼굴 reference 모드
- DreamBooth/LoRA 학습 후 12장 생성 (품질↑ / 속도↓)

### 2) 결제 (토스페이먼츠)

```
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...
TOSS_SECRET_KEY=test_sk_...
PAYMENT_MODE=real
NEXT_PUBLIC_PAYMENT_MODE=real
```

토스페이먼츠 키 한 쌍으로 5종 결제수단을 모두 사용한다.
- 카카오페이/네이버페이/삼성페이는 활성화 신청 필요 (토스 콘솔에서)
- 애플페이는 별도 인증 절차
- 휴대폰결제는 KG이니시스 등 PG 위탁 자동

### 3) Supabase 영속화 (선택)

`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Supabase 대시보드에서 `jobs` 테이블 생성 (스키마는 `src/lib/supabase.ts` 주석 참고),
`src/services/storage.ts` 의 메모리 Map 호출을 `supabase.from('jobs')` 로 교체.

## 출시 체크리스트

- [ ] 사업자등록 + 통신판매업 신고
- [ ] 토스페이먼츠 가맹 계약 (계좌, 정산일 설정)
- [ ] 5종 결제수단 활성화 신청
- [ ] AI 프로바이더 결정 + 원가 계산 (4,900원 기준 마진)
- [ ] 약관/개인정보처리방침 (사진 보관 기간, 본인 사진만 업로드 동의)
- [ ] 도메인 + HTTPS
- [ ] Sentry 같은 에러 모니터링

## MVP 다음 단계

1. **품질 검증** - 본인 사진 한 장으로 12장 만들어 보고 카톡 이모티콘 분위기 나는지 확인
2. **결제 붙이기** - PG 계약 후 라이브 결제 테스트
3. **공유 기능** - 친구 추천 / 카톡 공유로 바이럴
4. **모델 다양화** - 그림체 옵션 (실사 / 카툰 / 픽셀)
5. **앱 버전** - 웹이 잘 굴러가면 React Native 로 포팅
