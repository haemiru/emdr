# CLAUDE.md — 토닥토닥 · 짱샘 EMDR

좌우 양측성 자극(bilateral stimulation) 기반 EMDR 보조 캐릭터 애니메이션 웹앱.
가이드 점과 캐릭터가 좌 ↔ 우로 번갈아 움직이며 양측성 음악과 함께 안정화를 돕는다.

**라이브: https://emdr-nine.vercel.app**

## 구조 — 배포되는 건 하위 폴더다

```
character-animation/   ★ 실제 배포되는 정적 웹앱
                       index.html · style.css · app.js · assets/
reference/             동작 레퍼런스(프레임 이미지·webm). 배포 대상 아님
PLAN.md · WORK-LOG.md  기획·작업 로그
```

빌드 도구도 `package.json`도 없다. **순수 정적 웹앱**이라 `character-animation/index.html`을
브라우저로 직접 열면 그대로 확인된다.

## 🔴 배포 — Root Directory를 반드시 확인할 것

GitHub `haemiru/emdr` → Vercel 프로젝트 `emdr` 자동배포.

**Vercel 설정의 Root Directory = `character-animation`** 이다.
저장소 루트가 아니라 하위 폴더를 가리킨다 — 이 값이 비거나 `/`로 바뀌면 배포가 깨진다.
`main`에 push하면 새 배포가 생성된다.

수동 배포:

```bash
cd character-animation && vercel --prod
```

## 작업 시

- 애니메이션 타이밍·좌우 전환 주기는 EMDR 특성상 **임의로 바꾸지 말 것.** 기획 의도는
  `PLAN.md`, 변경 이력은 `WORK-LOG.md`에 있다.
- `reference/`의 프레임 이미지·webm은 동작을 맞추기 위한 참고 자료다. 배포 번들에
  포함시키지 않는다.
- UI 언어는 **한국어**.

> 심리 안정 보조 도구이며 EMDR 치료 자체를 대체하지 않는다.
