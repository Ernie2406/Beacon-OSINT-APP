import type { EnhanceSettings, ImageQuality } from "./types";

export function analyzeQuality(data: ImageData): ImageQuality {
  const { width, height, data: px } = data;
  let sum = 0;
  let lap = 0;
  const w = width;
  for (let y = 1; y < height - 1; y += 2) {
    for (let x = 1; x < width - 1; x += 2) {
      const i = (y * w + x) * 4;
      const l = 0.299 * px[i]! + 0.587 * px[i + 1]! + 0.114 * px[i + 2]!;
      sum += l;
      const up = ((y - 1) * w + x) * 4;
      const dn = ((y + 1) * w + x) * 4;
      const lf = (y * w + (x - 1)) * 4;
      const rt = (y * w + (x + 1)) * 4;
      const lu = 0.299 * px[up]! + 0.587 * px[up + 1]! + 0.114 * px[up + 2]!;
      const ld = 0.299 * px[dn]! + 0.587 * px[dn + 1]! + 0.114 * px[dn + 2]!;
      const ll = 0.299 * px[lf]! + 0.587 * px[lf + 1]! + 0.114 * px[lf + 2]!;
      const lr = 0.299 * px[rt]! + 0.587 * px[rt + 1]! + 0.114 * px[rt + 2]!;
      const g = 4 * l - lu - ld - ll - lr;
      lap += g * g;
    }
  }
  const samples = Math.max(1, Math.floor(((height - 2) / 2) * ((width - 2) / 2)));
  const meanLuma = sum / samples;
  const blurScore = lap / samples;
  const issues: string[] = [];
  if (width < 240 || height < 240) issues.push("Low resolution — upscaling may help");
  if (meanLuma < 55) issues.push("Dark exposure — raise brightness");
  if (meanLuma > 210) issues.push("Washed out — lower brightness, raise contrast");
  if (blurScore < 80) issues.push("Soft / blurry — add sharpening");
  if (!issues.length) issues.push("Exposure looks usable. Crop the face or torso before reverse search.");
  return { width, height, meanLuma, blurScore, issues };
}

export function suggestedEnhance(q: ImageQuality): Partial<EnhanceSettings> {
  const p: Partial<EnhanceSettings> = {};
  if (q.meanLuma < 55) p.brightness = 36;
  else if (q.meanLuma > 210) {
    p.brightness = -18;
    p.contrast = 28;
  } else if (q.meanLuma < 90) {
    p.brightness = 16;
    p.contrast = 12;
  }
  if (q.blurScore < 80) p.sharpen = 58;
  if (q.width < 240 || q.height < 240) p.upscale = 2.5;
  else if (q.width < 480 || q.height < 480) p.upscale = 2;
  return p;
}

function clamp(n: number) {
  return n < 0 ? 0 : n > 255 ? 255 : n;
}

export function applyEnhance(src: ImageData, settings: EnhanceSettings): ImageData {
  const { width, height } = src;
  let work = new ImageData(new Uint8ClampedArray(src.data), width, height);

  if (settings.crop) {
    const c = settings.crop;
    const x = Math.max(0, Math.round(c.x * width));
    const y = Math.max(0, Math.round(c.y * height));
    const w = Math.max(8, Math.round(c.w * width));
    const h = Math.max(8, Math.round(c.h * height));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.putImageData(work, 0, 0);
    const cut = ctx.getImageData(x, y, Math.min(w, width - x), Math.min(h, height - y));
    work = cut;
  }

  const b = settings.brightness;
  const c = 1 + settings.contrast / 100;
  const px = work.data;
  for (let i = 0; i < px.length; i += 4) {
    px[i] = clamp((px[i]! - 128) * c + 128 + b);
    px[i + 1] = clamp((px[i + 1]! - 128) * c + 128 + b);
    px[i + 2] = clamp((px[i + 2]! - 128) * c + 128 + b);
  }

  if (settings.denoise > 0) {
    work = boxBlur(work, Math.min(2, 1 + Math.round(settings.denoise / 50)));
  }
  if (settings.sharpen > 0) {
    work = convolveSharpen(work, settings.sharpen / 100);
  }
  return work;
}

function boxBlur(src: ImageData, r: number): ImageData {
  const { width, height, data } = src;
  const out = new Uint8ClampedArray(data.length);
  const w = width;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rs = 0,
        gs = 0,
        bs = 0,
        n = 0;
      for (let dy = -r; dy <= r; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= height) continue;
        for (let dx = -r; dx <= r; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= width) continue;
          const i = (yy * w + xx) * 4;
          rs += data[i]!;
          gs += data[i + 1]!;
          bs += data[i + 2]!;
          n++;
        }
      }
      const o = (y * w + x) * 4;
      out[o] = rs / n;
      out[o + 1] = gs / n;
      out[o + 2] = bs / n;
      out[o + 3] = data[o + 3]!;
    }
  }
  return new ImageData(out, width, height);
}

function convolveSharpen(src: ImageData, amount: number): ImageData {
  const { width, height, data } = src;
  const out = new Uint8ClampedArray(data.length);
  const k = amount;
  const c = 1 + 4 * k;
  const w = width;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * w + x) * 4;
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
        out[o] = data[o]!;
        out[o + 1] = data[o + 1]!;
        out[o + 2] = data[o + 2]!;
        out[o + 3] = data[o + 3]!;
        continue;
      }
      for (let ch = 0; ch < 3; ch++) {
        const ctr = data[o + ch]!;
        const up = data[((y - 1) * w + x) * 4 + ch]!;
        const dn = data[((y + 1) * w + x) * 4 + ch]!;
        const lf = data[(y * w + (x - 1)) * 4 + ch]!;
        const rt = data[(y * w + (x + 1)) * 4 + ch]!;
        out[o + ch] = clamp(c * ctr - k * (up + dn + lf + rt));
      }
      out[o + 3] = data[o + 3]!;
    }
  }
  return new ImageData(out, width, height);
}

export function imageDataToPng(data: ImageData, upscale: number): string {
  const scale = Math.max(1, Math.min(3, upscale));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(data.width * scale);
  canvas.height = Math.round(data.height * scale);
  const ctx = canvas.getContext("2d")!;
  const src = document.createElement("canvas");
  src.width = data.width;
  src.height = data.height;
  src.getContext("2d")!.putImageData(data, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

export async function fileToImageData(file: File): Promise<ImageData> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error("Could not read image"));
      i.src = url;
    });
    const max = 1600;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(8, Math.round(img.width * scale));
    canvas.height = Math.max(8, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  } finally {
    URL.revokeObjectURL(url);
  }
}
