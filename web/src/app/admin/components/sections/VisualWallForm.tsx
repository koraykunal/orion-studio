"use client";

import ImageUpload from "../ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { VisualWallData } from "@/lib/project-types";

export default function VisualWallForm({
  data,
  onChange,
}: {
  data: VisualWallData;
  onChange: (data: VisualWallData) => void;
}) {
  const addItem = () => {
    onChange({ ...data, items: [...data.items, { src: "", alt: "" }] });
  };

  const removeItem = (index: number) => {
    onChange({ ...data, items: data.items.filter((_, i) => i !== index) });
  };

  const updateItem = (index: number, field: "src" | "alt", value: string) => {
    const items = data.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange({ ...data, items });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-foreground-muted">
        Case study hero altındaki Visual Wall için görsel, GIF veya video seçin.
        Sıralama burada girdiğiniz sırayla korunur; medya doğal oranıyla gösterilir.
      </p>

      <div className="space-y-4">
        {data.items.map((item, i) => (
          <div
            key={i}
            className="flex gap-4 rounded-lg border border-border p-4"
          >
            <div className="flex-1 space-y-3">
              <ImageUpload
                value={item.src}
                onChange={(src) => updateItem(i, "src", src)}
                label={`Visual ${i + 1}`}
                aspectRatio="auto"
                allowVideo
              />
              <Input
                value={item.alt}
                onChange={(e) => updateItem(i, "alt", e.target.value)}
                placeholder="Alt text"
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeItem(i)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addItem}>
        Add Visual
      </Button>
    </div>
  );
}
