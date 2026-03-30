"use client";

import { useState, type KeyboardEvent } from "react";

interface ChipInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export default function ChipInput({ value, onChange, placeholder = "Add tag..." }: ChipInputProps) {
  const [input, setInput] = useState("");

  const addChip = (raw: string) => {
    const chip = raw.trim();
    if (chip && !value.includes(chip)) {
      onChange([...value, chip]);
    }
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChip(input);
    }
    if (e.key === "Backspace" && input === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeChip = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-surface-1 border border-border rounded-lg min-h-[48px]">
      {value.map((chip, i) => (
        <span key={chip} className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full flex items-center gap-1">
          {chip}
          <button type="button" onClick={() => removeChip(i)} className="hover:text-foreground">&times;</button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-foreground placeholder:text-foreground-muted"
      />
    </div>
  );
}
