"use client";

import ImageUpload from "../ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GalleryData } from "@/lib/project-types";

export default function GalleryForm({
  data,
  onChange,
}: {
  data: GalleryData;
  onChange: (data: GalleryData) => void;
}) {
  const addImage = () => {
    onChange({ ...data, images: [...data.images, { src: "", alt: "" }] });
  };

  const removeImage = (index: number) => {
    onChange({ ...data, images: data.images.filter((_, i) => i !== index) });
  };

  const updateImage = (index: number, field: "src" | "alt", value: string) => {
    const images = data.images.map((img, i) =>
      i === index ? { ...img, [field]: value } : img,
    );
    onChange({ ...data, images });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Columns</Label>
        <Select
          value={String(data.columns)}
          onValueChange={(v) =>
            onChange({ ...data, columns: Number(v) as 1 | 2 | 3 })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {data.images.map((img, i) => (
          <div
            key={i}
            className="flex gap-4 rounded-lg border border-border p-4"
          >
            <div className="flex-1 space-y-3">
              <ImageUpload
                value={img.src}
                onChange={(src) => updateImage(i, "src", src)}
                label={`Image ${i + 1}`}
              />
              <Input
                value={img.alt}
                onChange={(e) => updateImage(i, "alt", e.target.value)}
                placeholder="Alt text"
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeImage(i)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addImage}>
        Add Image
      </Button>
    </div>
  );
}
