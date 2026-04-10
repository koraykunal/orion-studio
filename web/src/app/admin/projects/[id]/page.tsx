"use client";

import { use, useState, useEffect } from "react";
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

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [client, setClient] = useState("");
  const [slug, setSlug] = useState("");
  const [year, setYear] = useState("");
  const [taglineEn, setTaglineEn] = useState("");
  const [taglineTr, setTaglineTr] = useState("");
  const [outcomeEn, setOutcomeEn] = useState("");
  const [outcomeTr, setOutcomeTr] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState<"client" | "concept" | "studio">("client");
  const [services, setServices] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/projects/${id}`)
      .then((res) => res.json())
      .then((project) => {
        setClient(project.client);
        setSlug(project.slug);
        setYear(project.year ?? "");
        setTaglineEn(project.tagline_en ?? "");
        setTaglineTr(project.tagline_tr ?? "");
        setOutcomeEn(project.outcome_en ?? "");
        setOutcomeTr(project.outcome_tr ?? "");
        setSections((project.sections as Section[]) || []);
        setImage(project.image ?? "");
        setCategory(project.category ?? "client");
        setServices(project.services ?? []);
        setFeatured(project.featured ?? false);
        setStatus(project.status);
        setLoading(false);
      });
  }, [id]);

  const handleClientChange = (value: string) => {
    setClient(value);
    setSlug(slugify(value));
  };

  const handleSave = async () => {
    if (!client || !slug) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client,
          slug,
          year,
          tagline_en: taglineEn,
          tagline_tr: taglineTr || null,
          outcome_en: outcomeEn,
          outcome_tr: outcomeTr || null,
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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to delete project");
        return;
      }
      router.push("/admin/projects");
    } catch {
      setError("Failed to delete project");
    }
  };

  if (loading) {
    return <p className="text-foreground-muted">Loading...</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h1 className="text-title text-foreground">Edit Project</h1>
        <div className="flex items-center gap-3">
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
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
            <Label>Tagline (EN)</Label>
            <Input
              value={taglineEn}
              onChange={(e) => setTaglineEn(e.target.value)}
              placeholder="Short tagline in English"
            />
          </div>

          <div className="space-y-2">
            <Label>Tagline (TR)</Label>
            <Input
              value={taglineTr}
              onChange={(e) => setTaglineTr(e.target.value)}
              placeholder="Short tagline in Turkish"
            />
          </div>

          <div className="space-y-2">
            <Label>Outcome (EN)</Label>
            <Textarea
              value={outcomeEn}
              onChange={(e) => setOutcomeEn(e.target.value)}
              placeholder="Project outcome in English..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Outcome (TR)</Label>
            <Textarea
              value={outcomeTr}
              onChange={(e) => setOutcomeTr(e.target.value)}
              placeholder="Project outcome in Turkish..."
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
