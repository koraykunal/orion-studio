"use client";

import ImageUpload from "../ImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FullImageData } from "@/lib/project-types";

export default function FullImageForm({
  data,
  onChange,
}: {
  data: FullImageData;
  onChange: (data: FullImageData) => void;
}) {
  return (
    <div className="space-y-4">
      <ImageUpload
        value={data.image}
        onChange={(image) => onChange({ ...data, image })}
        label="Image"
      />
      <div className="space-y-2">
        <Label>Alt Text</Label>
        <Input
          value={data.alt}
          onChange={(e) => onChange({ ...data, alt: e.target.value })}
          placeholder="Describe the image"
        />
      </div>
    </div>
  );
}
