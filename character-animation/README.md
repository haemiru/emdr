# 짱샘 EMDR 캐릭터 애니메이션 (토닥토닥)

9:16 세로 웹 애니메이션. 짱샘 캐릭터가 **양측성(좌↔우) 음악 패닝에 맞춰** 좌우로
기울이고, 화면의 가이드 점이 좌우로 움직여 눈으로 따라보게 한다. emdr 사이트 내장용 프로토타입.

## 설계 핵심 — "하나의 위상이 셋을 구동"

`phase = sin(2π · rate · t) · depth`  (범위 −depth ~ +depth)

| phase | 구동 대상 |
|-------|-----------|
| 오디오 | `StereoPannerNode.pan` ← LFO (PLAN.md §4 패닝 엔진과 동일) |
| 캐릭터 | 좌우 기울임(±7°) + 평행이동(±16px) + 살짝 눌림 |
| 가이드 점 | 화면 좌↔우 이동 (레퍼런스 1번 "eye movement") |
| 빛무리 / "토닥" 글자 | 도달한 쪽 강조 |

→ 음악·동작·점이 단일 소스로 완벽 동기. 서비스명 "토닥토닥"이 곧 동작(좌우 번갈아 토닥).

## 레퍼런스

YouTube `UuROYXsftdg` (Micheline Maalouf, "5 Bilateral stimulation options for EMDR").
양측성 자극 5종(눈 따라보기 / 나비 토닥 / 무릎 토닥 / 양측성 사운드 / 손 추적) 중
사진 컷아웃으로 자연스러운 **① 눈 따라보기 + 좌우 스웨이**를 채택.

## 실행

```bash
cd character-animation
python -m http.server 8765
# http://localhost:8765/index.html  (화면 탭 → 시작)
```

- `?auto=1` : 제스처 없이 자동 시작 (미리보기)
- `?pose=0.85` : 정적 포즈 1프레임 (−1~+1, 헤드리스 캡처용)

## 파일

- `index.html` — 무대(9:16) + 컨트롤
- `style.css` — 라벤더/민트/코랄 테마 (PLAN.md 색상)
- `app.js` — Web Audio 패닝 엔진 + 시각 동기 루프 (`render(phase)` 가 핵심)
- `assets/jjangsaem.png` — 흰 배경을 flood-fill로 투명 처리한 컷아웃
- `assets/cutout.py` — 위 배경 제거 스크립트 (재현용)

## emdr 사이트(React)로 이식

1. `app.js` 의 `render(phase)` → React 컴포넌트의 rAF 훅으로 이동, transform은 ref로 적용.
2. 오디오: 데모 톤(`toneA/toneB`) 자리에 **업로드 mp3/wav의 `AudioBufferSource`** 를 연결.
   패닝 그래프(`panner` + `panLFO` + `panDepthGain`)는 그대로 재사용.
3. 컨트롤(rate/depth/volume)은 PLAN.md §3 양측성 설정 슬라이더와 동일 → 플레이어에 통합.

## 다음 옵션 (B안 — 보류)

진짜 나비 토닥(팔이 가슴을 번갈아 두드림)이 필요하면 Gemini로 '왼손 토닥/오른손 토닥'
포즈 2~4장을 생성해 프레임 교체. 현재 A안(스웨이+가이드 점)은 추가 애셋 0개로 완성.
