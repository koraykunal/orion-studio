"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEffect, useRef, useCallback, useState } from "react";
import type { Editor } from "@tiptap/react";

interface TiptapEditorProps {
  content: object | null;
  onChange: (json: object, html: string) => void;
  placeholder?: string;
}

function MenuBar({ editor, onPreview }: { editor: Editor | null; onPreview: () => void }) {
  if (!editor) return null;

  const btnClass = (active: boolean) =>
    `px-2 py-1.5 rounded text-xs transition-colors ${
      active
        ? "bg-accent/20 text-accent"
        : "text-foreground-muted hover:text-foreground hover:bg-surface-2"
    }`;

  const sep = <div className="w-px bg-border mx-0.5 self-stretch" />;

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(data.error || "Image upload failed");
          return;
        }
        const { url } = await res.json();
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        alert("Image upload failed");
      }
    };
    input.click();
  };

  const handleLink = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt("Enter URL:");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  };

  const handleYoutube = () => {
    const url = window.prompt("Enter YouTube URL:");
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url });
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-2 bg-surface-1/50 sticky top-0 z-10">
      <button type="button" className={btnClass(false)} onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">↶</button>
      <button type="button" className={btnClass(false)} onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">↷</button>
      {sep}
      <button type="button" className={btnClass(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">B</button>
      <button type="button" className={btnClass(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><em>I</em></button>
      <button type="button" className={btnClass(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><u>U</u></button>
      <button type="button" className={btnClass(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough"><s>S</s></button>
      <button type="button" className={btnClass(editor.isActive("highlight"))} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Highlight">H</button>
      {sep}
      <button type="button" className={btnClass(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">H2</button>
      <button type="button" className={btnClass(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">H3</button>
      {sep}
      <button type="button" className={btnClass(editor.isActive({ textAlign: "left" }))} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align Left">⫷</button>
      <button type="button" className={btnClass(editor.isActive({ textAlign: "center" }))} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Align Center">⫸</button>
      <button type="button" className={btnClass(editor.isActive({ textAlign: "right" }))} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align Right">⫸</button>
      {sep}
      <button type="button" className={btnClass(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">• List</button>
      <button type="button" className={btnClass(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered List">1. List</button>
      <button type="button" className={btnClass(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">❝</button>
      <button type="button" className={btnClass(editor.isActive("codeBlock"))} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code Block">&lt;/&gt;</button>
      {sep}
      <button type="button" className={btnClass(false)} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table">Table</button>
      <button type="button" className={btnClass(false)} onClick={handleImageUpload} title="Upload Image">Image</button>
      <button type="button" className={btnClass(editor.isActive("link"))} onClick={handleLink} title="Insert/Remove Link">Link</button>
      <button type="button" className={btnClass(false)} onClick={handleYoutube} title="Embed YouTube">YT</button>
      <button type="button" className={btnClass(false)} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">—</button>
      {sep}
      <button type="button" className="ml-auto px-3 py-1.5 rounded text-xs text-foreground-muted hover:text-foreground hover:bg-surface-2 transition-colors" onClick={onPreview} title="Preview">Preview</button>
    </div>
  );
}

function PreviewModal({ html, onClose }: { html: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-background border border-border rounded-xl p-8 mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <span className="text-label text-foreground-muted">Preview</span>
          <button onClick={onClose} className="text-foreground-muted hover:text-foreground text-sm transition-colors">Close</button>
        </div>
        <article className="prose-orion" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

export default function TiptapEditor({ content, onChange, placeholder = "Start writing..." }: TiptapEditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  const handleUpdate = useCallback(({ editor }: { editor: Editor }) => {
    onChangeRef.current(editor.getJSON(), editor.getHTML());
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage,
      TiptapLink.configure({ openOnClick: false }),
      Youtube.configure({ width: 640, height: 360 }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Highlight,
      TextStyle,
    ],
    content: content || undefined,
    onUpdate: handleUpdate,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content && !editor.isDestroyed) {
      const currentJSON = JSON.stringify(editor.getJSON());
      const newJSON = JSON.stringify(content);
      if (currentJSON !== newJSON) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  const handlePreview = useCallback(() => {
    if (!editor) return;
    setPreviewHtml(editor.getHTML());
    setShowPreview(true);
  }, [editor]);

  return (
    <>
      <div className="border border-border rounded-lg overflow-hidden bg-background">
        <MenuBar editor={editor} onPreview={handlePreview} />
        <EditorContent editor={editor} className="prose-orion min-h-[60vh] max-h-[80vh] overflow-y-auto p-6 focus:outline-none" />
      </div>
      {showPreview && <PreviewModal html={previewHtml} onClose={() => setShowPreview(false)} />}
    </>
  );
}
