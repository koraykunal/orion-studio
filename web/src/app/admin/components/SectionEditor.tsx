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
import type { Section, SectionData, SectionType } from "@/lib/project-types";
import { SECTION_REGISTRY, SECTION_TYPES, createEmptySection, isSectionType } from "@/lib/project-types";
import { FullImageForm } from "./sections/FullImageForm";
import { TextBlockForm } from "./sections/TextBlockForm";
import { GalleryForm } from "./sections/GalleryForm";
import { MetricsForm } from "./sections/MetricsForm";
import { TechStackForm } from "./sections/TechStackForm";
import { QuoteForm } from "./sections/QuoteForm";
import { BeforeAfterForm } from "./sections/BeforeAfterForm";
import { VideoEmbedForm } from "./sections/VideoEmbedForm";
import { DeviceShowcaseForm } from "./sections/DeviceShowcaseForm";
import { MediaForm } from "./sections/MediaForm";
import { VisualWallForm } from "./sections/VisualWallForm";

const DRAG_HANDLE = "⠿";

/**
 * Section list editor.
 *
 * The form switch is exhaustive over the discriminated union, so `section.data`
 * is already narrowed in every branch and a new section type is a compile error
 * rather than an undefined panel at runtime.
 *
 * Reordering is available by pointer drag and by keyboard. HTML5 drag and drop
 * has no keyboard equivalent by specification, so the previous version made the
 * whole section list unreachable for keyboard and screen-reader users: the rows
 * were divs with onClick and no tabIndex, and the delete button had no type and
 * therefore submitted the enclosing form.
 */
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

  const activeSection = sections.find((section) => section.id === activeId) ?? null;

  const handleAdd = () => {
    const section = createEmptySection(addType);
    onChange([...sections, section]);
    setActiveId(section.id);
  };

  const handleDelete = (id: string) => {
    onChange(sections.filter((section) => section.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const handleDataChange = (id: string, data: SectionData) => {
    // The spread preserves the discriminant, so the updated section stays a
    // member of the union rather than widening to SectionData.
    onChange(sections.map((section) => (section.id === id ? ({ ...section, data } as Section) : section)));
  };

  const move = (from: number, to: number) => {
    if (from === to || to < 0 || to >= sections.length) return;
    const updated = [...sections];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex.current === null) return;
    move(dragIndex.current, targetIndex);
    dragIndex.current = null;
  };

  const renderForm = (section: Section) => {
    const onChangeData = (data: SectionData) => handleDataChange(section.id, data);

    switch (section.type) {
      case "fullImage":
        return <FullImageForm data={section.data} onChange={onChangeData} />;
      case "textBlock":
        return <TextBlockForm data={section.data} onChange={onChangeData} />;
      case "gallery":
        return <GalleryForm data={section.data} onChange={onChangeData} />;
      case "metrics":
        return <MetricsForm data={section.data} onChange={onChangeData} />;
      case "techStack":
        return <TechStackForm data={section.data} onChange={onChangeData} />;
      case "quote":
        return <QuoteForm data={section.data} onChange={onChangeData} />;
      case "beforeAfter":
        return <BeforeAfterForm data={section.data} onChange={onChangeData} />;
      case "videoEmbed":
        return <VideoEmbedForm data={section.data} onChange={onChangeData} />;
      case "deviceShowcase":
        return <DeviceShowcaseForm data={section.data} onChange={onChangeData} />;
      case "media":
        return <MediaForm data={section.data} onChange={onChangeData} />;
      case "visualWall":
        return <VisualWallForm data={section.data} onChange={onChangeData} />;
    }
  };

  return (
    <div className="mt-6 flex overflow-hidden rounded-lg border border-border">
      <div className="w-64 shrink-0 border-r border-border">
        <div className="border-b border-border p-3">
          <p className="text-sm font-medium text-foreground">Sections</p>
        </div>

        <ul className="flex flex-col" aria-label="Case study sections">
          {sections.map((section, index) => {
            const isActive = activeId === section.id;
            return (
              <li key={section.id} className="flex items-stretch">
                <button
                  type="button"
                  className={`flex flex-1 cursor-grab items-center gap-2 border-b border-border px-3 py-2 text-left text-sm ${
                    isActive ? "bg-accent text-foreground" : "text-foreground-muted hover:bg-accent/50"
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  onClick={() => setActiveId(section.id)}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span aria-hidden="true" className="text-foreground-muted">
                    {DRAG_HANDLE}
                  </span>
                  <span className="flex-1 truncate">{SECTION_REGISTRY[section.type].label}</span>
                  <span className="sr-only">
                    Section {index + 1} of {sections.length}
                  </span>
                </button>

                <div className="flex items-center gap-0.5 border-b border-border px-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-foreground-muted"
                    onClick={() => move(index, index - 1)}
                    disabled={index === 0}
                    aria-label={`Move ${SECTION_REGISTRY[section.type].label} up`}
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-foreground-muted"
                    onClick={() => move(index, index + 1)}
                    disabled={index === sections.length - 1}
                    aria-label={`Move ${SECTION_REGISTRY[section.type].label} down`}
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-foreground-muted hover:text-destructive"
                    onClick={() => handleDelete(section.id)}
                    aria-label={`Delete ${SECTION_REGISTRY[section.type].label}`}
                  >
                    ×
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 p-3">
          <Select
            value={addType}
            onValueChange={(value) => {
              if (isSectionType(value)) setAddType(value);
            }}
          >
            <SelectTrigger className="flex-1 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SECTION_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {SECTION_REGISTRY[type].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" size="sm" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6">
        {activeSection ? (
          <div>
            <h3 className="mb-4 text-sm font-medium text-foreground">
              {SECTION_REGISTRY[activeSection.type].label}
            </h3>
            {renderForm(activeSection)}
          </div>
        ) : (
          <p className="text-sm text-foreground-muted">Select a section to edit</p>
        )}
      </div>
    </div>
  );
}
