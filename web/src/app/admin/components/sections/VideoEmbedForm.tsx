"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { VideoEmbedData } from "@/lib/project-types";

export default function VideoEmbedForm({
  data,
  onChange,
}: {
  data: VideoEmbedData;
  onChange: (data: VideoEmbedData) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Video URL</Label>
      <Input
        value={data.url}
        onChange={(e) => onChange({ url: e.target.value })}
        placeholder="https://youtube.com/watch?v=..."
      />
    </div>
  );
}
