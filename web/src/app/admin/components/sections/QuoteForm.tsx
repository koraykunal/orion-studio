"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { QuoteData } from "@/lib/project-types";

export default function QuoteForm({
  data,
  onChange,
}: {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Quote Text</Label>
        <Textarea
          value={data.text}
          onChange={(e) => onChange({ ...data, text: e.target.value })}
          placeholder="Enter the quote..."
          rows={4}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Author</Label>
          <Input
            value={data.author}
            onChange={(e) => onChange({ ...data, author: e.target.value })}
            placeholder="Author name"
          />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Input
            value={data.role}
            onChange={(e) => onChange({ ...data, role: e.target.value })}
            placeholder="Role / title"
          />
        </div>
      </div>
    </div>
  );
}
