import { displaySrc } from "./thumb.ts";
import type { VisualPrint } from "./types.ts";

function lumaAt(px: Uint8ClampedArray, i: number) {
  return 0.299 * px[i]! + 0.587 * px[i + 1]! + 0.114 * px[i + 2]!;
}

function resample(data: ImageData, w: number, h: number): ImageData {
  const src = document.createElement("canvas");
  src.width = data.width;
  src.height = data.height;
  src.getContext("2d")!.putImageData(data, 0, 0);
  const tmp = document.createElement("canvas");
  tmp.width = w;
  tmp.height = h;
  const tctx = tmp.getContext("2d");
  if (!tctx) return new ImageData(w, h);
  tctx.drawImage(src, 0, 0, w, h);
  return tctx.getImageData(0, 0, w, h);
}

/** 8x8 average-hash. Supporting visual signal only — not a biometric system. */
export function aHashFromImageData(data: ImageData): string {
  const small = resample(data, 8, 8).data;
  const lumas: number[] = [];
  for (let i = 0; i < small.length; i += 4) lumas.push(lumaAt(small, i));
  const avg = lumas.reduce((a, b) => a + b, 0) / lumas.length;
  return lumas.map((v) => (v >= avg ? "1" : "0")).join("");
}

/** 9x8 difference-hash. More stable than aHash for cropped portraits. */
export function dHashFromImageData(data: ImageData): string {
  const small = resample(data, 9, 8).data;
  let bits = "";
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const left = lumaAt(small, (y * 9 + x) * 4);
      const right = lumaAt(small, (y * 9 + x + 1) * 4);
      bits += left < right ? "1" : "0";
    }
  }
  return bits;
}

export function fingerprintFromImageData(data: ImageData): VisualPrint {
  return { hash: aHashFromImageData(data), dHash: dHashFromImageData(data), hist: histogram(data) };
}

export function hamming(a: string, b: string): number {
  if (!a || !b || a.length !== b.length) return 64;
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

export function histogram(data: ImageData): number[] {
  const bins = new Array(24).fill(0) as number[];
  const px = data.data;
  for (let i = 0; i < px.length; i += 16) {
    const r = Math.min(7, px[i]! >> 5);
    const g = Math.min(7, px[i + 1]! >> 5);
    const b = Math.min(7, px[i + 2]! >> 5);
    bins[r] += 1;
    bins[8 + g] += 1;
    bins[16 + b] += 1;
  }
  const sum = bins.reduce((a, b) => a + b, 0) || 1;
  return bins.map((v) => v / sum);
}

export function histCorr(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < n; i++) {
    dot += a[i]! * b[i]!;
    na += a[i]! * a[i]!;
    nb += b[i]! * b[i]!;
  }
  if (!na || !nb) return 0;
  return dot / Math.sqrt(na * nb);
}

export async function fingerprintFromUrl(url: string): Promise<VisualPrint | null> {
  try {
    const img = await loadImage(displaySrc(url));
    const canvas = document.createElement("canvas");
    const max = 256;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    canvas.width = Math.max(8, Math.round(img.width * scale));
    canvas.height = Math.max(8, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return fingerprintFromImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
  } catch {
    return null;
  }
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!src.startsWith("data:") && !src.startsWith("blob:")) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = src;
  });
}
