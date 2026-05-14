"use client";

import ImageUpload from "../ImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BeforeAfterAspect, BeforeAfterData } from "@/lib/project-types";

const ASPECT_OPTIONS: { value: BeforeAfterAspect; label: string }[] = [
  { value: "auto", label: "Auto (yüklenen görselin doğal oranı)" },
  { value: "4/3", label: "4 / 3" },
  { value: "16/9", label: "16 / 9" },
  { value: "1/1", label: "1 / 1 (kare)" },
  { value: "3/2", label: "3 / 2" },
];

export default function BeforeAfterForm({
  data,
  onChange,
}: {
  data: BeforeAfterData;
  onChange: (data: BeforeAfterData) => void;
}) {
  const aspect: BeforeAfterAspect = data.aspectRatio ?? "auto";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Aspect ratio</Label>
        <Select
          value={aspect}
          onValueChange={(v) =>
            onChange({ ...data, aspectRatio: v as BeforeAfterAspect })
          }
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ASPECT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-[11px] text-foreground-muted">
          Auto seçili ise iki resim de yüklediğin orijinal oranıyla görünür. Eşit
          görünüm için Auto&apos;dayken aynı oranda iki foto yüklemeyi öner.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-base font-medium">Before</Label>
          <ImageUpload
            value={data.before.src}
            onChange={(src) =>
              onChange({ ...data, before: { ...data.before, src } })
            }
            label="Before Image"
            aspectRatio={aspect}
          />
          <Input
            value={data.before.alt}
            onChange={(e) =>
              onChange({
                ...data,
                before: { ...data.before, alt: e.target.value },
              })
            }
            placeholder="Alt text"
          />
          <Input
            value={data.before.label}
            onChange={(e) =>
              onChange({
                ...data,
                before: { ...data.before, label: e.target.value },
              })
            }
            placeholder="Label"
          />
        </div>
        <div className="space-y-3">
          <Label className="text-base font-medium">After</Label>
          <ImageUpload
            value={data.after.src}
            onChange={(src) =>
              onChange({ ...data, after: { ...data.after, src } })
            }
            label="After Image"
            aspectRatio={aspect}
          />
          <Input
            value={data.after.alt}
            onChange={(e) =>
              onChange({
                ...data,
                after: { ...data.after, alt: e.target.value },
              })
            }
            placeholder="Alt text"
          />
          <Input
            value={data.after.label}
            onChange={(e) =>
              onChange({
                ...data,
                after: { ...data.after, label: e.target.value },
              })
            }
            placeholder="Label"
          />
        </div>
      </div>
    </div>
  );
}
