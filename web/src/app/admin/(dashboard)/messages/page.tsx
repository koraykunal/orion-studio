"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const PAGE_SIZE = 25;

type Message = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  services: string[];
  budget: string | null;
  timeline: string | null;
  brief: string;
  referral: string | null;
  status: "unread" | "read" | "archived";
  notes: string | null;
  createdAt: string;
  readAt: string | null;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<Message | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * The list is paged. The route returns an envelope rather than a bare array
   * so the total is known without a second request, which means the consumer
   * has to read `.messages` rather than treating the response as the list.
   */
  const load = useCallback(async (nextOffset: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/messages?limit=${PAGE_SIZE}&offset=${nextOffset}`);
      if (!res.ok) throw new Error(`Failed to load messages (${res.status})`);
      const data: { messages: Message[]; total: number } = await res.json();

      setMessages(data.messages);
      setTotal(data.total);
      setOffset(nextOffset);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(0);
  }, [load]);

  const canGoBack = offset > 0;
  const canGoForward = offset + PAGE_SIZE < total;


  const handleSelect = async (msg: Message) => {
    setSelected(msg);
    setNotes(msg.notes ?? "");

    if (msg.status === "unread") {
      await fetch(`/api/admin/messages/${msg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id ? { ...m, status: "read", readAt: new Date().toISOString() } : m
        )
      );
      setSelected((prev) => (prev ? { ...prev, status: "read", readAt: new Date().toISOString() } : prev));
    }
  };

  const handleSaveNotes = async () => {
    if (!selected) return;
    setSaving(true);

    await fetch(`/api/admin/messages/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });

    setMessages((prev) =>
      prev.map((m) => (m.id === selected.id ? { ...m, notes } : m))
    );
    setSelected((prev) => (prev ? { ...prev, notes } : prev));
    setSaving(false);
  };

  const handleArchive = async () => {
    if (!selected) return;

    await fetch(`/api/admin/messages/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "archived" }),
    });

    setMessages((prev) =>
      prev.map((m) => (m.id === selected.id ? { ...m, status: "archived" } : m))
    );
    setSelected((prev) => (prev ? { ...prev, status: "archived" } : prev));
  };

  const statusColor: Record<string, string> = {
    unread: "bg-accent/10 text-accent",
    read: "bg-green-500/10 text-green-400",
    archived: "bg-foreground-muted/10 text-foreground-muted",
  };

  if (loading && messages.length === 0) {
    return <p className="text-foreground-muted">Loading...</p>;
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-title text-foreground">Messages</h1>
        <p className="text-sm text-foreground-muted" aria-live="polite">
          {total === 0
            ? "No messages"
            : `${offset + 1}–${Math.min(offset + PAGE_SIZE, total)} of ${total}`}
        </p>
      </div>

      {total > PAGE_SIZE ? (
        <div className="mb-4 flex items-center gap-2">
          <Button
            variant="ghost"
            disabled={!canGoBack || loading}
            onClick={() => void load(Math.max(0, offset - PAGE_SIZE))}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            disabled={!canGoForward || loading}
            onClick={() => void load(offset + PAGE_SIZE)}
          >
            Next
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 min-h-[70vh]">
        <div className="space-y-2 overflow-y-auto max-h-[75vh] pr-1">
          {messages.length === 0 ? (
            <p className="text-foreground-muted">No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <Card
                key={msg.id}
                className={`cursor-pointer transition-colors ${
                  selected?.id === msg.id
                    ? "border-accent/40 bg-accent/5"
                    : "hover:border-accent/20"
                }`}
                onClick={() => handleSelect(msg)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-medium text-sm ${msg.status === "unread" ? "text-foreground" : "text-foreground-muted"}`}>
                      {msg.name}
                    </p>
                    <Badge variant="secondary" className={statusColor[msg.status]}>
                      {msg.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground-muted mt-1">{msg.email}</p>
                  <p className="text-xs text-foreground-muted mt-2 line-clamp-2">{msg.brief}</p>
                  <p className="text-[0.65rem] text-foreground-muted/60 mt-2">
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="border border-border rounded-xl p-6">
          {!selected ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-foreground-muted">Select a message to view details</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-heading text-foreground">{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} className="text-sm text-accent hover:underline">
                    {selected.email}
                  </a>
                  {selected.company && (
                    <p className="text-sm text-foreground-muted mt-1">{selected.company}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={statusColor[selected.status]}>
                    {selected.status}
                  </Badge>
                  {selected.status !== "archived" && (
                    <Button variant="destructive" size="sm" onClick={handleArchive}>
                      Archive
                    </Button>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-foreground-muted block mb-1">Services</span>
                  <div className="flex flex-wrap gap-1">
                    {selected.services.length > 0 ? (
                      selected.services.map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">
                          {s}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-foreground-muted">Not specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-foreground-muted block mb-1">Budget</span>
                  <span className="text-foreground">{selected.budget || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-foreground-muted block mb-1">Timeline</span>
                  <span className="text-foreground">{selected.timeline || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-foreground-muted block mb-1">Referral</span>
                  <span className="text-foreground">{selected.referral || "None"}</span>
                </div>
              </div>

              <Separator />

              <div>
                <span className="text-label text-foreground-muted block mb-2">Project Brief</span>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {selected.brief}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <span className="text-label text-foreground-muted block">Admin Notes</span>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  rows={4}
                />
                <Button
                  size="sm"
                  onClick={handleSaveNotes}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Notes"}
                </Button>
              </div>

              <div className="text-xs text-foreground-muted/60 space-y-1">
                <p>
                  Received: {new Date(selected.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                {selected.readAt && (
                  <p>
                    Read: {new Date(selected.readAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
