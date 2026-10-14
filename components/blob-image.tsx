"use client";

import { useCallback, type ImgHTMLAttributes } from "react";

type BlobImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  blob: Blob;
  alt: string;
};

/**
 * Manage object URLs through the React 19 callback-ref lifecycle.
 * Allocates only when the DOM image mounts/changes Blob, then revokes on cleanup.
 * No state updates inside effects and no URL created during server render.
 */
export function BlobImage({ blob, alt, ...imageProps }: BlobImageProps) {
  const attach = useCallback((node: HTMLImageElement | null) => {
    if (!node) return;
    const objectUrl = URL.createObjectURL(blob);
    node.src = objectUrl;
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);

  // Dynamic local blob URLs cannot benefit from Next's image optimization pipeline.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...imageProps} alt={alt} ref={attach} />;
}
