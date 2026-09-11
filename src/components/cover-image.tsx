"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type CoverImageProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
};

export function CoverImage({ src, alt, className, imgClassName }: CoverImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <div className={cn("overflow-hidden bg-muted/40", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className={cn("size-full object-cover", imgClassName)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
