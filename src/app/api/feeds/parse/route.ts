import Parser from "rss-parser";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type MediaAttrs = { $?: { url?: string; medium?: string; type?: string; href?: string } };

type CustomItem = {
  "media:content"?: MediaAttrs | MediaAttrs[];
  "media:thumbnail"?: MediaAttrs | MediaAttrs[];
  "itunes:image"?: MediaAttrs | MediaAttrs[];
  image?: { url?: string } | string;
  content?: string;
  "content:encoded"?: string;
  enclosure?: { url?: string; type?: string };
};

function asMediaList(value: MediaAttrs | MediaAttrs[] | undefined) {
  if (!value) return [] as MediaAttrs[];
  return Array.isArray(value) ? value : [value];
}

const parser = new Parser<Record<string, unknown>, CustomItem>({
  timeout: 15000,
  headers: {
    "User-Agent": "GenesisRSS/0.1 (+personal reader)",
    Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
  },
  customFields: {
    item: [
      "media:content",
      "media:thumbnail",
      "itunes:image",
      "content:encoded",
      "image",
    ],
  },
});

function itemId(link: string | undefined, guid: string | undefined, title: string | undefined) {
  return guid || link || title || crypto.randomUUID();
}

function stripHtml(value: string | undefined) {
  if (!value) return null;
  const text = value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text || null;
}

function looksLikeImageUrl(url: string, type?: string) {
  if (type?.startsWith("image/")) return true;
  return /\.(avif|bmp|gif|jpe?g|png|svg|webp)(\?|#|$)/i.test(url);
}

function firstImgSrc(html: string | undefined) {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1]?.trim() || null;
}

function absoluteUrl(candidate: string, base?: string) {
  try {
    return new URL(candidate, base).toString();
  } catch {
    return null;
  }
}

function extractImage(
  item: Parser.Item & CustomItem,
  feedLink?: string,
): string | null {
  const candidates: Array<{ url?: string; type?: string; medium?: string }> = [];

  for (const media of asMediaList(item["media:content"])) {
    if (media.$?.url) {
      candidates.push({
        url: media.$.url,
        type: media.$.type,
        medium: media.$.medium,
      });
    }
  }

  for (const media of asMediaList(item["media:thumbnail"])) {
    if (media.$?.url) {
      candidates.push({ url: media.$.url, type: "image/" });
    }
  }

  for (const media of asMediaList(item["itunes:image"])) {
    const href = media.$?.href || media.$?.url;
    if (href) candidates.push({ url: href, type: "image/" });
  }

  if (item.enclosure?.url) {
    candidates.push({ url: item.enclosure.url, type: item.enclosure.type });
  }

  if (typeof item.image === "string") {
    candidates.push({ url: item.image, type: "image/" });
  } else if (item.image && typeof item.image === "object" && item.image.url) {
    candidates.push({ url: item.image.url, type: "image/" });
  }

  const fromHtml =
    firstImgSrc(item["content:encoded"]) ||
    firstImgSrc(item.content) ||
    firstImgSrc(item.contentSnippet);
  if (fromHtml) {
    candidates.push({ url: fromHtml, type: "image/" });
  }

  const base = item.link || feedLink;
  for (const candidate of candidates) {
    if (!candidate.url) continue;
    if (candidate.medium && candidate.medium !== "image") continue;
    if (!looksLikeImageUrl(candidate.url, candidate.type) && !candidate.type?.startsWith("image/")) {
      // still allow http(s) URLs without extension when marked as image medium/type already handled
      if (!/^https?:\/\//i.test(candidate.url)) continue;
      if (candidate.type && !candidate.type.startsWith("image/")) continue;
      if (!candidate.type && !candidate.medium) {
        // enclosure without image type — skip audio/video
        if (/\.(mp3|m4a|aac|mp4|m4v|mov|pdf)(\?|#|$)/i.test(candidate.url)) continue;
      }
    }
    const abs = absoluteUrl(candidate.url, base);
    if (abs && /^https?:\/\//i.test(abs)) return abs;
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url")?.trim();

  if (!url) {
    return NextResponse.json({ error: "Informe a URL do feed." }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "URL inválida." }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return NextResponse.json({ error: "Use uma URL http ou https." }, { status: 400 });
  }

  try {
    const feed = await parser.parseURL(parsedUrl.toString());
    const items = (feed.items ?? []).slice(0, 50).map((item) => ({
      id: itemId(item.link, item.guid, item.title),
      title: item.title?.trim() || "Sem título",
      link: item.link?.trim() || "",
      publishedAt: item.isoDate || item.pubDate || null,
      summary: stripHtml(item.contentSnippet || item.summary || item.content),
      imageUrl: extractImage(item, feed.link),
    }));

    return NextResponse.json({
      title: feed.title?.trim() || parsedUrl.hostname,
      link: feed.link,
      items,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível ler este feed.";
    return NextResponse.json(
      { error: `Falha ao buscar o feed: ${message}` },
      { status: 502 },
    );
  }
}
