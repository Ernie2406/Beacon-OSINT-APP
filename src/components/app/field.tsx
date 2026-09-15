import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  type = "text",
  area,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  area?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {area ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}
