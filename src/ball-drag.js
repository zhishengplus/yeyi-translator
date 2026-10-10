// 悬浮球拖动的纯计算:夹在视口内,并决定菜单朝哪边展开。
// 以经典脚本挂到 isolated world,content.js 直接用 globalThis.YeyiBallDrag。
(function (root) {
  function placeBall(position, viewport) {
    const size = positive(viewport?.size, 44);
    const pad = positive(viewport?.pad, 8);
    const menuHeight = positive(viewport?.menuHeight, 220);
    const width = positive(viewport?.viewportWidth, 0);
    const height = positive(viewport?.viewportHeight, 0);
    const maxLeft = Math.max(pad, width - size - pad);
    const maxTop = Math.max(pad, height - size - pad);
    const left = clamp(position?.left, pad, maxLeft);
    const top = clamp(position?.top, pad, maxTop);
    return {
      left,
      top,
      side: left + size / 2 < width / 2 ? "left" : "right",
      vside: top < menuHeight + pad ? "below" : "above"
    };
  }

  function dragExceeded(startX, startY, x, y, threshold = 5) {
    return Math.hypot(x - startX, y - startY) >= threshold;
  }

  function clamp(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.min(max, Math.max(min, number));
  }

  function positive(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : fallback;
  }

  root.YeyiBallDrag = { placeBall, dragExceeded };
})(globalThis);
