"use client";

import ChipInput from "../ChipInput";
import { Label } from "@/components/ui/label";
import type { TechStackData } from "@/lib/project-types";

export default function TechStackForm({
  data,
  onChange,
}: {
  data: TechStackData;
  onChange: (data: TechStackData) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Technologies</Label>
      <ChipInput
        value={data.items}
        onChange={(items) => onChange({ items })}
      />
    </div>
  );
}
