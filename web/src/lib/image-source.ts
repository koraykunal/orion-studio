const EXTERNAL_IMAGE_RE = /^https?:\/\//i;

export function isExternalImageSrc(src: string | null | undefined): boolean {
    return Boolean(src && EXTERNAL_IMAGE_RE.test(src));
}
