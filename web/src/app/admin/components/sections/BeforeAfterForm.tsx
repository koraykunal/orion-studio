"use client";

import ImageUpload from "../ImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BeforeAfterData } from "@/lib/project-types";

export default function BeforeAfterForm({
  data,
  onChange,
}: {
  data: BeforeAfterData;
  onChange: (data: BeforeAfterData) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-3">
        <Label className="text-base font-medium">Before</Label>
        <ImageUpload
          value={data.before.src}
          onChange={(src) =>
            onChange({ ...data, before: { ...data.before, src } })
          }
          label="Before Image"
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
  );
}
