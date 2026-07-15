# 토닥토닥 · 짱샘 EMDR

좌우 양측성 자극(bilateral stimulation) 기반의 EMDR 보조 캐릭터 애니메이션 웹앱.
가이드 점과 캐릭터가 좌 ↔ 우로 번갈아 움직이며, 양측성 음악과 함께 안정화를 돕는다.

## 라이브

- **https://emdr-nine.vercel.app**

## 구조

- `character-animation/` — 실제 배포되는 정적 웹앱 (index.html / style.css / app.js / assets)
- `reference/` — 동작 레퍼런스(프레임 이미지·webm), 배포 대상 아님
- `PLAN.md`, `WORK-LOG.md` — 기획·작업 로그

## 배포

- GitHub `haemiru/emdr` → Vercel 프로젝트 `emdr` 연결(자동배포).
- Vercel **Root Directory = `character-animation`**. `main`에 push하면 새 배포가 생성된다.
- 수동 배포: `cd character-animation && vercel --prod`
