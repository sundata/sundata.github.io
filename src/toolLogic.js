export function millimetresToPixels(widthMm, heightMm, dpi) {
  const values = [widthMm, heightMm, dpi].map(Number);
  if (values.some((value) => !Number.isFinite(value) || value <= 0))
    return { width: 0, height: 0 };
  return {
    width: Math.round((values[0] / 25.4) * values[2]),
    height: Math.round((values[1] / 25.4) * values[2]),
  };
}
export function parsePageSelection(value, pageCount) {
  const pages = new Set();
  for (const part of value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)) {
    if (/^\d+$/.test(part)) pages.add(Number(part));
    else {
      const match = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (!match) return [];
      const start = Number(match[1]),
        end = Number(match[2]);
      if (start > end) return [];
      for (let page = start; page <= end; page += 1) pages.add(page);
    }
  }
  const selected = [...pages];
  if (!selected.length || selected.some((page) => page < 1 || page > pageCount))
    return [];
  return selected.sort((a, b) => a - b);
}
export function parsePageOrder(value, pageCount) {
  const pages = [];
  for (const part of value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)) {
    if (/^\d+$/.test(part)) pages.push(Number(part));
    else {
      const match = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (!match) return [];
      const start = Number(match[1]),
        end = Number(match[2]),
        direction = start <= end ? 1 : -1;
      for (let page = start; page !== end + direction; page += direction)
        pages.push(page);
    }
  }
  if (
    !pages.length ||
    pages.some((page) => page < 1 || page > pageCount) ||
    new Set(pages).size !== pages.length
  )
    return [];
  return pages;
}
export function safeImageDimension(value) {
  const number = Number(value);
  return Number.isFinite(number)
    ? Math.min(12000, Math.max(1, Math.round(number)))
    : 1;
}
