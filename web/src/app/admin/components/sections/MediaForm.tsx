"use client";

import ImageUpload from "../ImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MediaData } from "@/lib/project-types";

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m4v)$/i;

export default function MediaForm({
  data,
  onChange,
}: {
  data: MediaData;
  onChange: (data: MediaData) => void;
}) {
  const isVideo = !!data.src && VIDEO_EXT_RE.test(data.src);

  return (
    <div className="space-y-4">
      <p className="text-xs text-foreground-muted">
        Video (mp4 / webm / mov, maks 30MB) veya GIF / animasyonlu görsel yükleyin.
        Video için autoplay/loop/kontrol ayarlarını seçebilirsiniz.
      </p>

      <ImageUpload
        value={data.src}
        onChange={(src) => onChange({ ...data, src })}
        label="Media file"
        aspectRatio="auto"
        allowVideo
      />

      {isVideo && (
        <div className="space-y-3 rounded-lg border border-border p-4">
          <Label className="text-xs">Video options</Label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={data.autoplay}
                onChange={(e) => onChange({ ...data, autoplay: e.target.checked })}
                className="h-4 w-4"
              />
              Autoplay (sessiz)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={data.loop}
                onChange={(e) => onChange({ ...data, loop: e.target.checked })}
                className="h-4 w-4"
              />
              Loop
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={data.controls}
                onChange={(e) => onChange({ ...data, controls: e.target.checked })}
                className="h-4 w-4"
              />
              Kontrolleri göster
            </label>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Poster (opsiyonel — video yüklenmeden gösterilen görsel)</Label>
            <ImageUpload
              value={data.poster ?? ""}
              onChange={(poster) => onChange({ ...data, poster })}
              label=""
              aspectRatio="auto"
            />
          </div>
        </div>
      )}

      <div className="space-y-1">
        <Label className="text-xs">Alt text</Label>
        <Input
          value={data.alt}
          onChange={(e) => onChange({ ...data, alt: e.target.value })}
          placeholder="Erişilebilirlik için kısa açıklama"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Aspect ratio (opsiyonel — boş bırakılırsa medyanın doğal oranı kullanılır)</Label>
        <Input
          value={data.aspectRatio ?? ""}
          onChange={(e) => onChange({ ...data, aspectRatio: e.target.value })}
          placeholder="örn. 16/9, 4/3, 1/1"
        />
      </div>
    </div>
  );
}
