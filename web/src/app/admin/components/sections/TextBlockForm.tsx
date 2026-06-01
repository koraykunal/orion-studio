"use client";

import TiptapEditor from "../TiptapEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TextBlockData, TextBlockLayout } from "@/lib/project-types";

const LAYOUT_OPTIONS: { value: TextBlockLayout; label: string }[] = [
  { value: "side", label: "Yan yana (Başlık solda, içerik sağda)" },
  { value: "stackedLeft", label: "Üstte - Sola hizalı" },
  { value: "stackedCenter", label: "Üstte - Ortalı" },
  { value: "stackedRight", label: "Üstte - Sağa hizalı" },
];

export default function TextBlockForm({
  data,
  onChange,
}: {
  data: TextBlockData;
  onChange: (data: TextBlockData) => void;
}) {
  const layout: TextBlockLayout = data.layout ?? "side";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Başlık konumu</Label>
        <Select
          value={layout}
          onValueChange={(v) => onChange({ ...data, layout: v as TextBlockLayout })}
        >
          <SelectTrigger className="w-full max-w-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LAYOUT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Section title"
        />
      </div>
      <div className="space-y-2">
        <Label>Content</Label>
        <TiptapEditor
          content={data.content}
          onChange={(json, html) =>
            onChange({ ...data, content: json, contentHtml: html })
          }
        />
      </div>
    </div>
  );
}
