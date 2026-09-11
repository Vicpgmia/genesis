"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

function faviconUrl(siteUrl: string) {
  try {
    const host = new URL(siteUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;
  } catch {
    return null;
  }
}

function initialFrom(title: string) {
  const trimmed = title.trim();
  return trimmed ? trimmed[0]!.toUpperCase() : "?";
}

type FeedFaviconProps = {
  siteUrl: string;
  title: string;
  className?: string;
  inverted?: boolean;
};

export function FeedFavicon({ siteUrl, title, className, inverted }: FeedFaviconProps) {
  const src = faviconUrl(siteUrl);
  const [failed, setFailed] = useState(!src);

  if (failed || !src) {
    return (
      <span
        className={cn(
          "inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-[10px] font-semibold",
          inverted
            ? "bg-background/20 text-background"
            : "bg-muted text-muted-foreground",
          className,
        )}
        aria-hidden
      >
        {initialFrom(title)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={16}
      height={16}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={cn("size-4 shrink-0 rounded-sm", className)}
      onError={() => setFailed(true)}
    />
  );
}
