"use client";

import TiptapEditor from "../TiptapEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TextBlockData } from "@/lib/project-types";

export default function TextBlockForm({
  data,
  onChange,
}: {
  data: TextBlockData;
  onChange: (data: TextBlockData) => void;
}) {
  return (
    <div className="space-y-4">
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
