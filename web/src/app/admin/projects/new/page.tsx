"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "../../components/ImageUpload";
import ChipInput from "../../components/ChipInput";
import { SectionEditor } from "../../components/SectionEditor";
import type { Section } from "@/lib/project-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [tagline, setTagline] = useState("");
  const [outcome, setOutcome] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState<"client" | "concept" | "studio">("client");
  const [services, setServices] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleClientChange = (value: string) => {
    setClient(value);
    setSlug(slugify(value));
  };

  const handleSave = async () => {
    if (!client || !slug) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client,
          slug,
          year,
          tagline,
          outcome,
          sections,
          image: image || "",
          category,
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

          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Short tagline"
            />
          </div>

          <div className="space-y-2">
            <Label>Outcome</Label>
            <Textarea
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="Project outcome..."
              rows={3}
            />
          </div>

        </div>

        <div className="space-y-6">
          <ImageUpload
            value={image}
            onChange={setImage}
            label="Hero Image"
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
            <Label>Services</Label>
            <ChipInput value={services} onChange={setServices} />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded border-border"
            />
            Featured
          </label>
        </div>
      </div>

      <SectionEditor sections={sections} onChange={setSections} />
    </>
  );
}
