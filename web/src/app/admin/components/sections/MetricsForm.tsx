"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MetricsData } from "@/lib/project-types";

export default function MetricsForm({
  data,
  onChange,
}: {
  data: MetricsData;
  onChange: (data: MetricsData) => void;
}) {
  const addItem = () => {
    onChange({ items: [...data.items, { value: "", label: "" }] });
  };

  const removeItem = (index: number) => {
    onChange({ items: data.items.filter((_, i) => i !== index) });
  };

  const updateItem = (
    index: number,
    field: "value" | "label",
    value: string,
  ) => {
    const items = data.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange({ items });
  };

  return (
    <div className="space-y-4">
      <Label>Metrics</Label>
      {data.items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <Input
            value={item.value}
            onChange={(e) => updateItem(i, "value", e.target.value)}
            placeholder="Value (e.g. 99%)"
            className="w-32"
          />
          <Input
            value={item.label}
            onChange={(e) => updateItem(i, "label", e.target.value)}
            placeholder="Label"
            className="flex-1"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeItem(i)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={addItem}>
        Add Metric
      </Button>
    </div>
  );
}
