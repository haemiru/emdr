# 흰 배경 → 투명 처리: 가장자리에서 BFS flood fill로 배경 흰색만 제거.
# 인물 내부의 흰색(안경 반사 등)은 경계에 막혀 보존된다. 경계는 약하게 페더링.
from PIL import Image, ImageFilter
from collections import deque
import sys

SRC = r"C:\Users\bsuha\AI-Studio\02.Dev\emdr\character-animation\assets\jjangsaem.png"
DST = r"C:\Users\bsuha\AI-Studio\02.Dev\emdr\character-animation\assets\jjangsaem.png"

im = Image.open(SRC).convert("RGBA")
w, h = im.size
px = im.load()

def is_bg(r, g, b):
    # 밝고(>=232) 회색에 가까운(채널 편차 작음) 픽셀을 배경으로 간주
    return min(r, g, b) >= 232 and (max(r, g, b) - min(r, g, b)) <= 14

visited = bytearray(w * h)
q = deque()

# 4개 가장자리 픽셀을 시드로
for x in range(w):
    for y in (0, h - 1):
        q.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        q.append((x, y))

while q:
    x, y = q.popleft()
    if x < 0 or y < 0 or x >= w or y >= h:
        continue
    idx = y * w + x
    if visited[idx]:
        continue
    visited[idx] = 1
    r, g, b, a = px[x, y]
    if not is_bg(r, g, b):
        continue
    px[x, y] = (r, g, b, 0)  # 배경 → 투명
    q.append((x + 1, y)); q.append((x - 1, y))
    q.append((x, y + 1)); q.append((x, y - 1))

# 경계 안티앨리어싱: 알파만 살짝 블러
r, g, b, a = im.split()
a = a.filter(ImageFilter.GaussianBlur(0.8))
im = Image.merge("RGBA", (r, g, b, a))

im.save(DST)
# 결과 검증
px2 = im.load()
print("TL alpha:", px2[0, 0][3], "| center-bg alpha:", px2[5, h // 2][3], "| face alpha:", px2[w // 2, h // 2][3])
