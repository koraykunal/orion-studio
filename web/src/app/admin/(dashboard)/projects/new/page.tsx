"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "../../../components/ImageUpload";
import ChipInput from "../../../components/ChipInput";
import { SectionEditor } from "../../../components/SectionEditor";
import {
  PROJECT_SERVICE_CATEGORIES,
  getServiceCategoryLabel,
  type ProjectServiceCategory,
  type Section,
} from "@/lib/project-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slugify } from "@/lib/slug";

export default function NewProjectPage() {
  const router = useRouter();

  const [client, setClient] = useState("");
  const [slug, setSlug] = useState("");
  const [year, setYear] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [image, setImage] = useState("");
  const [previewVideo, setPreviewVideo] = useState("");
  const [category, setCategory] = useState<"client" | "concept" | "studio">("client");
  const [serviceCategory, setServiceCategory] = useState<ProjectServiceCategory>("web");
  const [services, setServices] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [taglineEn, setTaglineEn] = useState("");
  const [taglineTr, setTaglineTr] = useState("");
  const [outcomeEn, setOutcomeEn] = useState("");
  const [outcomeTr, setOutcomeTr] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleClientChange = (value: string) => {
    setClient(value);
    setSlug(slugify(value));
  };

  const handleSave = async () => {
    if (!client || !slug) {
      setError("Client name and slug are required");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client,
          tagline_en: taglineEn,
          tagline_tr: taglineTr,
          outcome_en: outcomeEn,
          outcome_tr: outcomeTr,
          slug,
          year,
          sections,
          image: image || "",
          previewVideo: previewVideo || "",
          category,
          serviceCategory,
          services,
          featured,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to save project");
        return;
      }

      router.push("/admin/projects");
    } catch {
      setError("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h1 className="text-title text-foreground">New Project</h1>
        <div className="flex items-center gap-3">
          <Select value={status} onValueChange={(v) => setStatus(v as "draft" | "published")}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave} disabled={saving || !client}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Client Name</Label>
            <Input
              value={client}
              onChange={(e) => handleClientChange(e.target.value)}
              placeholder="Client name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="project-slug"
              />
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2026"
              />
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <ImageUpload
            value={image}
            onChange={setImage}
            label="Hero Image"
          />

          <ImageUpload
            value={previewVideo}
            onChange={setPreviewVideo}
            label="Preview Video (hover)"
            accept="video/mp4,video/webm,video/quicktime"
            allowVideo
          />

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as "client" | "concept" | "studio")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="concept">Concept</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Service Category</Label>
            <Select
              value={serviceCategory}
              onValueChange={(v) => setServiceCategory(v as ProjectServiceCategory)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_SERVICE_CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {getServiceCategoryLabel(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Services</Label>
            <ChipInput value={services} onChange={setServices} />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              id="project-featured"
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded border-border"
            />
            Featured
          </label>
        </div>
      </div>
        <fieldset className="space-y-4 border-t border-border pt-6">
          <legend className="text-sm font-medium text-foreground">Positioning</legend>
          <p className="text-xs text-foreground-muted">
            Tagline and outcome appear on the work index and the case study hero. Required before publishing.
          </p>

          <div className="space-y-2">
            <Label htmlFor="tagline-en">Tagline (EN)</Label>
            <Input
              id="tagline-en"
              value={taglineEn}
              onChange={(e) => setTaglineEn(e.target.value)}
              placeholder="One line that frames the work"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline-tr">Tagline (TR)</Label>
            <Input
              id="tagline-tr"
              value={taglineTr}
              onChange={(e) => setTaglineTr(e.target.value)}
              placeholder="Türkçe karşılık"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outcome-en">Outcome (EN)</Label>
            <Input
              id="outcome-en"
              value={outcomeEn}
              onChange={(e) => setOutcomeEn(e.target.value)}
              placeholder="What the result was, in one line"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outcome-tr">Outcome (TR)</Label>
            <Input
              id="outcome-tr"
              value={outcomeTr}
              onChange={(e) => setOutcomeTr(e.target.value)}
              placeholder="Türkçe karşılık"
            />
          </div>
        </fieldset>


      <SectionEditor sections={sections} onChange={setSections} />
    </>
  );
}
