"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
      <div className="section-container py-16 max-w-3xl mx-auto px-6">
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

export default function NewPostPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState<object | null>(null);
  const [contentHtml, setContentHtml] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(slugify(value));
  };

  const handleSave = async () => {
    if (!title || !slug) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          description,
          content,
          contentHtml,
          coverImage: coverImage || null,
          tags,
          status,
          authorId: (session?.user as { id?: string })?.id ?? "",
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

  if (showPreview) {
    return <PostPreview title={title} description={description} tags={tags} contentHtml={contentHtml} onClose={() => setShowPreview(false)} />;
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h1 className="text-title text-foreground">New Post</h1>
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
          <Button variant="outline" onClick={() => setShowPreview(true)}>Preview</Button>
          <Button onClick={handleSave} disabled={saving || !title}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post title"
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
            <Label>Content</Label>
            <TiptapEditor
              content={content}
              onChange={(json, html) => {
                setContent(json);
                setContentHtml(html);
              }}
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
