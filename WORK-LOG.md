# 토닥토닥(emdr) — 작업 로그

> 돌아왔을 때: 이 파일 §4(다음 할 일)부터 확인. 전체 기획은 `PLAN.md`.

---

## §1. 2026-06-20 — 짱샘 EMDR 캐릭터 애니메이션 프로토타입

### 한 일
- **유튜브 레퍼런스 분석**: `UuROYXsftdg` (Micheline Maalouf, 12초, "5 Bilateral stimulation
  options for EMDR"). yt-dlp(`python -m yt_dlp`)로 영상 받고 ffmpeg로 프레임 추출 → 분석.
  양측성 자극 5종 확인: ①눈 따라보기 ②나비 토닥 ③무릎 토닥 ④양측성 사운드 ⑤손 추적.
  공통 원리 = **좌↔우 교대** → 토닥토닥의 실시간 패닝과 동일.
- **짱샘 캐릭터 애니메이션 제작** (`character-animation/`): 9:16 세로 웹 애니메이션.
  - 사용자 결정: 사진 그대로 + 좌우 스웨이 + 가이드 점 (A안), 9:16, 사이트 내장.
  - 짱샘 = 실제 인물 사진 컷아웃(`jjangsaem-cutout.png` from ebook/jjangsaem-bookshop).
    흰 배경이라 flood-fill로 투명 처리(`assets/cutout.py`).
  - **단일 위상 동기화**: `phase = sin(2π·rate·t)·depth` 가 ①오디오 패닝 ②캐릭터 기울임
    ③가이드 점 ④빛무리/토닥 강조를 동시 구동. 음악·동작·점 완벽 동기.
  - Web Audio 패닝 엔진(StereoPanner + LFO)은 PLAN.md §4와 동일 구조 → 본 사이트로 직행 이식.
  - 헤드리스 Edge로 렌더 검증 완료(`demo.png`).

### 결과물 (`character-animation/`)
- `index.html` / `style.css` / `app.js` — 무대·테마·엔진
- `assets/jjangsaem.png` (투명 컷아웃) + `assets/cutout.py` (재현 스크립트)
- `README.md` (이식 가이드), `demo.png` (미리보기)
- `reference/` — 레퍼런스 영상(`ref.webm`) + 추출 프레임 24장

### 실행
```
cd character-animation && python -m http.server 8765
# http://localhost:8765  (탭하면 시작, 🎧 권장)
# ?auto=1 자동시작 · ?pose=0.85 정적 포즈(-1~+1)
```

### 환경 메모
- yt-dlp는 `pip` 설치돼 있으나 PATH에 없음 → **`python -m yt_dlp`** 로 호출.
  YouTube JS 런타임 경고 뜨면 `--js-runtimes deno` 추가.
- ffmpeg/ffprobe 설치됨(winget Gyan.FFmpeg). `(Get-Command ffmpeg).Source` 로 경로 확인.

---

## §4. 다음 할 일 (택1)

- **(a) MP4 렌더**: 캐릭터 애니메이션을 쇼츠 영상 파일로 출력 (ffmpeg 프레임 캡처 or Remotion).
- **(b) 실제 곡 테스트**: Suno 곡(mp3/wav)을 `app.js` source에 연결해 패닝 확인.
- **(c) emdr 사이트 Phase 0 셋업**: Vite+React+Tailwind+Supabase(`emdr_`) → 이 컴포넌트 통합
  (PLAN.md §9 Phase 0~1 본격 착수).
- (B안 보류) 진짜 나비 토닥: Gemini로 '왼손/오른손 토닥' 포즈 2~4장 생성 후 프레임 교체.
