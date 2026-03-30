"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Section,
  SectionType,
  FullImageData,
  TextBlockData,
  GalleryData,
  MetricsData,
  TechStackData,
  QuoteData,
  BeforeAfterData,
  VideoEmbedData,
  DeviceShowcaseData,
} from "@/lib/project-types";
import { SECTION_TYPE_LABELS, createEmptySection } from "@/lib/project-types";
import FullImageForm from "./sections/FullImageForm";
import TextBlockForm from "./sections/TextBlockForm";
import GalleryForm from "./sections/GalleryForm";
import MetricsForm from "./sections/MetricsForm";
import TechStackForm from "./sections/TechStackForm";
import QuoteForm from "./sections/QuoteForm";
import BeforeAfterForm from "./sections/BeforeAfterForm";
import VideoEmbedForm from "./sections/VideoEmbedForm";
import DeviceShowcaseForm from "./sections/DeviceShowcaseForm";

export function SectionEditor({
  sections,
  onChange,
}: {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [addType, setAddType] = useState<SectionType>("textBlock");
  const dragIndex = useRef<number | null>(null);

  const activeSection = sections.find((s) => s.id === activeId) ?? null;

  const handleAdd = () => {
    const section = createEmptySection(addType);
    onChange([...sections, section]);
    setActiveId(section.id);
  };

  const handleDelete = (id: string) => {
    onChange(sections.filter((s) => s.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const handleDataChange = (id: string, data: Section["data"]) => {
    onChange(sections.map((s) => (s.id === id ? { ...s, data } : s)));
  };

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex.current === null || dragIndex.current === targetIndex) return;
    const updated = [...sections];
    const [moved] = updated.splice(dragIndex.current, 1);
    updated.splice(targetIndex, 0, moved);
    onChange(updated);
    dragIndex.current = null;
  };

  const renderForm = (section: Section) => {
    switch (section.type) {
      case "fullImage":
        return (
          <FullImageForm
            data={section.data as FullImageData}
            onChange={(d) => handleDataChange(section.id, d)}
          />
        );
      case "textBlock":
        return (
          <TextBlockForm
            data={section.data as TextBlockData}
            onChange={(d) => handleDataChange(section.id, d)}
          />
        );
      case "gallery":
        return (
          <GalleryForm
            data={section.data as GalleryData}
            onChange={(d) => handleDataChange(section.id, d)}
          />
        );
      case "metrics":
        return (
          <MetricsForm
            data={section.data as MetricsData}
            onChange={(d) => handleDataChange(section.id, d)}
          />
        );
      case "techStack":
        return (
          <TechStackForm
            data={section.data as TechStackData}
            onChange={(d) => handleDataChange(section.id, d)}
          />
        );
      case "quote":
        return (
          <QuoteForm
            data={section.data as QuoteData}
            onChange={(d) => handleDataChange(section.id, d)}
          />
        );
      case "beforeAfter":
        return (
          <BeforeAfterForm
            data={section.data as BeforeAfterData}
            onChange={(d) => handleDataChange(section.id, d)}
          />
        );
      case "videoEmbed":
        return (
          <VideoEmbedForm
            data={section.data as VideoEmbedData}
            onChange={(d) => handleDataChange(section.id, d)}
          />
        );
      case "deviceShowcase":
        return (
          <DeviceShowcaseForm
            data={section.data as DeviceShowcaseData}
            onChange={(d) => handleDataChange(section.id, d)}
          />
        );
    }
  };

  return (
    <div className="mt-6 flex overflow-hidden rounded-lg border border-border">
      <div className="w-64 shrink-0 border-r border-border">
        <div className="border-b border-border p-3">
          <p className="text-sm font-medium text-foreground">Sections</p>
        </div>

        <div className="flex flex-col">
          {sections.map((section, i) => (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(i)}
              onClick={() => setActiveId(section.id)}
              className={`flex cursor-pointer items-center gap-2 border-b border-border px-3 py-2 text-sm ${
                activeId === section.id
                  ? "bg-accent text-foreground"
                  : "text-foreground-muted hover:bg-accent/50"
              }`}
            >
              <span className="cursor-grab text-foreground-muted">⠿</span>
              <span className="flex-1 truncate">
                {SECTION_TYPE_LABELS[section.type]}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(section.id);
                }}
                className="text-foreground-muted hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 p-3">
          <Select
            value={addType}
            onValueChange={(v) => setAddType(v as SectionType)}
          >
            <SelectTrigger className="flex-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SECTION_TYPE_LABELS) as SectionType[]).map(
                (type) => (
                  <SelectItem key={type} value={type}>
                    {SECTION_TYPE_LABELS[type]}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6">
        {activeSection ? (
          <div>
            <h3 className="mb-4 text-sm font-medium text-foreground">
              {SECTION_TYPE_LABELS[activeSection.type]}
            </h3>
            {renderForm(activeSection)}
          </div>
        ) : (
          <p className="text-sm text-foreground-muted">
            Select a section to edit
          </p>
        )}
      </div>
    </div>
  );
}
