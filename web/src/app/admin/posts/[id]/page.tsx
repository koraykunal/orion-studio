"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "../../components/TiptapEditor";
import ImageUpload from "../../components/ImageUpload";
import ChipInput from "../../components/ChipInput";
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

function PostPreview({ title, description, tags, contentHtml, onClose }: {
  title: string;
  description: string;
  tags: string[];
  contentHtml: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-surface-1 border-b border-border">
        <span className="text-label text-foreground-muted">Full Page Preview</span>
        <Button variant="outline" size="sm" onClick={onClose}>Close Preview</Button>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-3">
            <span className="text-label text-foreground-muted">{new Date().toLocaleDateString()}</span>
            {tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full border border-border text-[0.6rem] uppercase tracking-[0.12em] text-foreground-muted">{tag}</span>
            ))}
          </div>
          <h1 className="text-title">{title || "Untitled"}</h1>
          {description && <p className="text-editorial !text-foreground-muted/80">{description}</p>}
        </div>
        <hr className="border-border mb-12" />
        <article className="prose-orion" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>
    </div>
  );
}

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [titleEn, setTitleEn] = useState("");
  const [titleTr, setTitleTr] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [contentEn, setContentEn] = useState<object | null>(null);
  const [contentHtmlEn, setContentHtmlEn] = useState("");
  const [contentHtmlTr, setContentHtmlTr] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/posts/${id}`)
      .then((res) => res.json())
      .then((post) => {
        setTitleEn(post.title_en ?? "");
        setTitleTr(post.title_tr ?? "");
        setSlug(post.slug);
        setDescription(post.description ?? "");
        setContentEn(post.content ?? null);
        setContentHtmlEn(post.contentHtml_en ?? "");
        setContentHtmlTr(post.contentHtml_tr ?? "");
        setCoverImage(post.coverImage ?? "");
        setTags(post.tags ?? []);
        setStatus(post.status);
        setLoading(false);
      });
  }, [id]);

  const handleTitleChange = (value: string) => {
    setTitleEn(value);
    setSlug(slugify(value));
  };

  const handleSave = async () => {
    if (!titleEn || !slug) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title_en: titleEn,
          title_tr: titleTr || null,
          slug,
          description,
          content: contentEn,
          contentHtml_en: contentHtmlEn,
          contentHtml_tr: contentHtmlTr || null,
          coverImage: coverImage || null,
          tags,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to save post");
        return;
      }

      router.push("/admin/posts");
    } catch {
      setError("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to delete post");
        return;
      }
      router.push("/admin/posts");
    } catch {
      setError("Failed to delete post");
    }
  };

  if (loading) {
    return <p className="text-foreground-muted">Loading...</p>;
  }

  if (showPreview) {
    return <PostPreview title={titleEn} description={description} tags={tags} contentHtml={contentHtmlEn} onClose={() => setShowPreview(false)} />;
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h1 className="text-title text-foreground">Edit Post</h1>
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
          <Button variant="outline" onClick={() => setShowPreview(true)}>Preview</Button>
          <Button onClick={handleSave} disabled={saving || !titleEn}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Title (EN)</Label>
            <Input
              value={titleEn}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post title in English"
            />
          </div>

          <div className="space-y-2">
            <Label>Title (TR)</Label>
            <Input
              value={titleTr}
              onChange={(e) => setTitleTr(e.target.value)}
              placeholder="Post title in Turkish"
            />
          </div>

          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="post-slug"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Content (EN)</Label>
            <TiptapEditor
              content={contentEn}
              onChange={(json, html) => {
                setContentEn(json);
                setContentHtmlEn(html);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Content (TR)</Label>
            <Textarea
              value={contentHtmlTr}
              onChange={(e) => setContentHtmlTr(e.target.value)}
              placeholder="Turkish content HTML..."
              rows={8}
            />
          </div>
        </div>

        <div className="space-y-6">
          <ImageUpload
            value={coverImage}
            onChange={setCoverImage}
            label="Cover Image"
          />

          <div className="space-y-2">
            <Label>Tags</Label>
            <ChipInput value={tags} onChange={setTags} />
          </div>
        </div>
      </div>
    </>
  );
}
