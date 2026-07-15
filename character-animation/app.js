/*
 * 토닥토닥 — 짱샘 EMDR 캐릭터 애니메이션
 * 핵심: 하나의 위상(phase)이 ① 오디오 좌우 패닝 ② 짱샘 기울임 ③ 가이드 점 위치를
 *       동시에 구동 → 음악·동작·점이 완벽 동기화 (PLAN.md §4 패닝 엔진과 동일 구조).
 *
 * 오디오는 업로드 곡이 아직 없으므로, 데모용으로 부드러운 합성 톤을 좌우 패닝한다.
 * 사이트 이식 시 source 부분만 AudioBufferSource(업로드 mp3/wav)로 교체하면 된다.
 */

// ===== 설정값 (컨트롤과 연동) =====
const state = {
  rate: 0.7,    // 좌↔우 1왕복 Hz (≈ 분당 42회 왕복)
  depth: 0.85,  // 동작/패닝 깊이 0~1
  volume: 0.18, // 마스터 볼륨
  running: false,
};

// ===== DOM =====
const $ = (id) => document.getElementById(id);
const charEl = $("char");
const dotEl = $("dot");
const glowL = $("glowL");
const glowR = $("glowR");
const tapL = $("tapL");
const tapR = $("tapR");
const startOverlay = $("startOverlay");

// ===== Web Audio 엔진 =====
let audioCtx = null;
let masterGain = null;
let panner = null;
let panLFO = null;     // 패닝을 흔드는 저주파 발진기
let panDepthGain = null;
let toneA = null, toneB = null; // 부드러운 화음 2음

function buildAudioGraph() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  masterGain = audioCtx.createGain();
  masterGain.gain.value = state.volume;

  // 좌우 패닝 노드 (양측성 자극의 핵심)
  panner = audioCtx.createStereoPanner();

  // LFO가 panner.pan 을 -depth ~ +depth 로 부드럽게 왕복시킨다
  panLFO = audioCtx.createOscillator();
  panLFO.type = "sine";
  panLFO.frequency.value = state.rate;
  panDepthGain = audioCtx.createGain();
  panDepthGain.gain.value = state.depth;
  panLFO.connect(panDepthGain).connect(panner.pan);

  // 음원: 부드러운 2음 화음 (수면·진정 톤). 헤드폰에서 좌우 이동이 또렷.
  toneA = audioCtx.createOscillator();
  toneA.type = "sine";
  toneA.frequency.value = 220;     // A3
  toneB = audioCtx.createOscillator();
  toneB.type = "sine";
  toneB.frequency.value = 277.18;  // C#4 (부드러운 장3도)
  const toneMix = audioCtx.createGain();
  toneMix.gain.value = 0.5;
  toneA.connect(toneMix);
  toneB.connect(toneMix);

  // source → 패닝 → 마스터 → 출력
  toneMix.connect(panner).connect(masterGain).connect(audioCtx.destination);

  panLFO.start();
  toneA.start();
  toneB.start();
}

// ===== 시각 동기화 루프 =====
// 오디오 LFO와 같은 주파수를 시간 기준으로 직접 계산해 시각을 구동(완벽 동기).
let startTime = 0;
let rafId = null;

function render(phase) {
  // ① 짱샘 기울임: 좌우로 살짝 lean + 좌우 평행이동 + 무게중심 눌림
  const tiltDeg = phase * 7;            // ±7도
  const shiftPx = phase * 16;           // ±16px
  const squash = 1 - Math.abs(phase) * 0.015;
  charEl.style.transform =
    `translateX(calc(-50% + ${shiftPx}px)) rotate(${tiltDeg}deg) scaleY(${squash})`;

  // ② 가이드 점: 화면 좌우로 이동 (눈으로 따라보기)
  dotEl.style.transform = `translateX(${phase * 130}px)`;

  // ③ 빛무리: 가는 쪽이 밝아짐
  glowL.style.opacity = phase < 0 ? Math.min(0.85, -phase) : 0;
  glowR.style.opacity = phase > 0 ? Math.min(0.85, phase) : 0;

  // ④ 토닥 글자: 도달한 쪽 강조
  const THRESH = 0.6 * state.depth;
  tapL.classList.toggle("active", phase < -THRESH);
  tapR.classList.toggle("active", phase > THRESH);
}

function tick(now) {
  const t = (now - startTime) / 1000; // 초
  // 현재 위상: -depth(완전 왼쪽) ~ +depth(완전 오른쪽)
  const phase = Math.sin(2 * Math.PI * state.rate * t) * state.depth;
  render(phase);
  rafId = requestAnimationFrame(tick);
}

// ===== 제어 =====
function start() {
  // 오디오 장치가 없거나 차단돼도 시각 동작은 멈추지 않도록 분리 보호
  try {
    if (!audioCtx) buildAudioGraph();
    if (audioCtx.state === "suspended") audioCtx.resume();
  } catch (err) {
    console.warn("오디오를 시작할 수 없어 시각 동작만 재생합니다:", err);
  }
  state.running = true;
  startTime = performance.now();
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(tick);
  startOverlay.classList.add("hidden");
  $("toggleBtn").textContent = "일시정지";
}

function pause() {
  state.running = false;
  cancelAnimationFrame(rafId);
  if (audioCtx) audioCtx.suspend();
  $("toggleBtn").textContent = "재생";
}

function toggle() {
  if (state.running) pause();
  else start();
}

// ===== 입력 바인딩 =====
$("startBtn").addEventListener("click", start);
startOverlay.addEventListener("click", start);
$("toggleBtn").addEventListener("click", toggle);

$("rate").addEventListener("input", (e) => {
  state.rate = parseFloat(e.target.value);
  $("rateVal").textContent = state.rate.toFixed(2) + " Hz";
  if (panLFO) panLFO.frequency.setTargetAtTime(state.rate, audioCtx.currentTime, 0.05);
  // 시각 위상 연속성을 위해 시간 기준 리셋
  startTime = performance.now();
});

$("depth").addEventListener("input", (e) => {
  state.depth = parseFloat(e.target.value);
  $("depthVal").textContent = Math.round(state.depth * 100) + "%";
  if (panDepthGain) panDepthGain.gain.setTargetAtTime(state.depth, audioCtx.currentTime, 0.05);
});

$("vol").addEventListener("input", (e) => {
  state.volume = parseFloat(e.target.value);
  $("volVal").textContent = Math.round(state.volume * 100) + "%";
  if (masterGain) masterGain.gain.setTargetAtTime(state.volume, audioCtx.currentTime, 0.05);
});

// 미리보기/캡처용 파라미터
const params = new URLSearchParams(location.search);
if (params.get("auto") === "1") {
  // 사용자 제스처 없이 바로 시작
  window.addEventListener("load", start);
} else if (params.has("pose")) {
  // 정적 포즈 1프레임만 렌더 (헤드리스 캡처용, 루프 없음)
  const p = parseFloat(params.get("pose"));
  window.addEventListener("load", () => {
    startOverlay.classList.add("hidden");
    render(p);
  });
}
