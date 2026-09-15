import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useCase } from "@/lib/osint/store";
import {
  analyzeQuality,
  applyEnhance,
  fileToImageData,
  imageDataToPng,
  suggestedEnhance,
} from "@/lib/osint/enhance";
import { fingerprintFromImageData } from "@/lib/osint/hash";
import { defaultEnhance } from "@/lib/osint/types";
import { Download, ScanSearch, SunMedium, Trash2, Upload } from "lucide-react";

const TOOLS = [
  { name: "Google Lens", href: "https://lens.google.com/upload", note: "Upload the enhanced PNG" },
  { name: "Google Images", href: "https://images.google.com/", note: "Camera icon → upload" },
  { name: "TinEye", href: "https://tineye.com/", note: "Upload or paste" },
  { name: "Yandex Images", href: "https://yandex.com/images/", note: "Camera icon" },
  { name: "Bing Visual Search", href: "https://www.bing.com/visualsearch", note: "Upload the file" },
];

export function ReversePanel() {
  const fileRef = useRef<HTMLInputElement>(null);
  const rawRef = useRef<ImageData | null>(null);
  const enhance = useCase((s) => s.enhance);
  const setEnhance = useCase((s) => s.setEnhance);
  const refDataUrl = useCase((s) => s.refDataUrl);
  const enhancedUrl = useCase((s) => s.enhancedUrl);
  const setReference = useCase((s) => s.setReference);
  const setEnhanced = useCase((s) => s.setEnhanced);
  const qualityIssues = useCase((s) => s.qualityIssues);
  const [busy, setBusy] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [dropOver, setDropOver] = useState(false);

  async function onFile(file: File) {
    setBusy(true);
    try {
      const data = await fileToImageData(file);
      rawRef.current = data;
      const q = analyzeQuality(data);
      const png = imageDataToPng(data, 1);
      setReference(png, fingerprintFromImageData(data), q.issues);
      rerender(data, enhance);
    } finally {
      setBusy(false);
    }
  }

  function rerender(data: ImageData, settings: typeof enhance) {
    const out = applyEnhance(data, settings);
    const png = imageDataToPng(out, settings.upscale);
    setEnhanced(png);
    setReference(
      useCase.getState().refDataUrl,
      fingerprintFromImageData(out),
      analyzeQuality(out).issues,
    );
  }

  function update(partial: Partial<typeof enhance>) {
    const next = { ...enhance, ...partial };
    setEnhance(partial);
    if (rawRef.current) rerender(rawRef.current, next);
  }

  function autoFix() {
    if (!rawRef.current) return;
    const q = analyzeQuality(rawRef.current);
    const next = { ...defaultEnhance(), ...suggestedEnhance(q) };
    setEnhance(next);
    rerender(rawRef.current, next);
  }

  function downloadEnhanced() {
    if (!enhancedUrl) return;
    const a = document.createElement("a");
    a.href = enhancedUrl;
    a.download = "beacon-enhanced.png";
    a.click();
  }

  function pointFromEvent(el: HTMLElement, e: { clientX: number; clientY: number }) {
    const box = el.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - box.left) / box.width)),
      y: Math.min(1, Math.max(0, (e.clientY - box.top) / box.height)),
    };
  }

  function finishCrop(el: HTMLElement, e: { clientX: number; clientY: number }) {
    if (!cropping || !drag) return;
    const p = pointFromEvent(el, e);
    const x = Math.min(drag.x, p.x);
    const y = Math.min(drag.y, p.y);
    const w = Math.abs(p.x - drag.x);
    const h = Math.abs(p.y - drag.y);
    setDrag(null);
    if (w > 0.05 && h > 0.05) update({ crop: { x, y, w, h } });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-medium tracking-tight">Reverse image workflow</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Enhancement runs in your browser. The file is not uploaded to our servers. Download the
          result and drop it into a public reverse-image engine.
        </p>
      </div>

      <div
        className={
          dropOver
            ? "rounded-xl border border-accent bg-subtle px-4 py-6 text-center"
            : "rounded-xl border border-dashed border-border-strong bg-surface px-4 py-6 text-center"
        }
        onDragOver={(e) => {
          e.preventDefault();
          setDropOver(true);
        }}
        onDragLeave={() => setDropOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDropOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f && f.type.startsWith("image/")) void onFile(f);
        }}
      >
        <p className="text-sm text-muted">Drop a reference photo here, or choose a file.</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
            }}
          />
          <Button onClick={() => fileRef.current?.click()} disabled={busy}>
            <Upload />
            {busy ? "Reading…" : "Upload reference photo"}
          </Button>
          <Button variant="secondary" onClick={autoFix} disabled={!refDataUrl}>
            <SunMedium />
            Auto-enhance
          </Button>
          <Button
            variant="ghost"
            disabled={!refDataUrl}
            onClick={() => {
              rawRef.current = null;
              setReference(null, null, []);
              setEnhanced(null);
              setEnhance(defaultEnhance());
            }}
          >
            <Trash2 />
            Remove photo
          </Button>
        </div>
      </div>

      {qualityIssues.length > 0 ? (
        <ul className="rounded-lg border border-border bg-subtle px-4 py-3 text-sm text-muted">
          {qualityIssues.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <figure className="overflow-hidden rounded-xl border border-border bg-surface">
          <figcaption className="border-b border-border px-3 py-2 text-xs uppercase tracking-widest text-muted">
            Original
          </figcaption>
          <div className="relative flex min-h-56 items-center justify-center bg-bg">
            {refDataUrl ? (
              <img
                src={refDataUrl}
                alt="Reference original"
                className="max-h-80 w-full object-contain"
                draggable={false}
              />
            ) : (
              <p className="p-8 text-center text-sm text-muted">No photo yet</p>
            )}
          </div>
        </figure>
        <figure className="overflow-hidden rounded-xl border border-border bg-surface">
          <figcaption className="border-b border-border px-3 py-2 text-xs uppercase tracking-widest text-muted">
            Enhanced {cropping ? "· drag to crop" : ""}
          </figcaption>
          <div
            className="relative flex min-h-56 items-center justify-center bg-bg"
            onMouseDown={(e) => {
              if (!cropping) return;
              setDrag(pointFromEvent(e.currentTarget, e));
            }}
            onMouseUp={(e) => finishCrop(e.currentTarget, e)}
            onTouchStart={(e) => {
              if (!cropping) return;
              const t = e.touches[0];
              if (t) setDrag(pointFromEvent(e.currentTarget, t));
            }}
            onTouchEnd={(e) => {
              const t = e.changedTouches[0];
              if (t) finishCrop(e.currentTarget, t);
            }}
          >
            {enhancedUrl || refDataUrl ? (
              <img
                src={enhancedUrl || refDataUrl || ""}
                alt="Enhanced reference"
                className="max-h-80 w-full object-contain"
                draggable={false}
              />
            ) : (
              <p className="p-8 text-center text-sm text-muted">Adjustments appear here</p>
            )}
          </div>
        </figure>
      </div>

      <div className="grid gap-5 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2">
        <SliderRow
          label="Brightness"
          value={enhance.brightness}
          min={-80}
          max={80}
          onChange={(v) => update({ brightness: v })}
        />
        <SliderRow
          label="Contrast"
          value={enhance.contrast}
          min={-60}
          max={80}
          onChange={(v) => update({ contrast: v })}
        />
        <SliderRow
          label="Sharpen"
          value={enhance.sharpen}
          min={0}
          max={100}
          onChange={(v) => update({ sharpen: v })}
        />
        <SliderRow
          label="Denoise"
          value={enhance.denoise}
          min={0}
          max={100}
          onChange={(v) => update({ denoise: v })}
        />
        <SliderRow
          label="Upscale"
          value={enhance.upscale}
          min={1}
          max={3}
          step={0.5}
          onChange={(v) => update({ upscale: v })}
        />
        <div className="flex flex-wrap items-end gap-2">
          <Button
            variant={cropping ? "default" : "secondary"}
            onClick={() => setCropping((c) => !c)}
            disabled={!refDataUrl}
          >
            {cropping ? "Drag on enhanced image to crop" : "Crop face / body"}
          </Button>
          <Button variant="ghost" onClick={() => update({ crop: null })} disabled={!enhance.crop}>
            Reset crop
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={downloadEnhanced} disabled={!enhancedUrl}>
          <Download />
          Download enhanced PNG
        </Button>
      </div>

      <div>
        <h3 className="text-xs font-medium uppercase tracking-widest text-muted">
          Reverse-image engines
        </h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <li key={t.name}>
              <a
                href={t.href}
                target="_blank"
                rel="noreferrer"
                className="flex h-full flex-col rounded-lg border border-border bg-bg px-4 py-3 hover:bg-subtle"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <ScanSearch className="size-4" />
                  {t.name}
                </span>
                <span className="mt-1 text-xs text-muted">{t.note}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-xs">
        <Label>{label}</Label>
        <span className="font-mono text-muted">{value}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(v) => onChange(v[0] ?? value)}
      />
    </div>
  );
}
