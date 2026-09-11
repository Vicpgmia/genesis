export type Feed = {
  id: string;
  url: string;
  title: string;
  category: string;
  addedAt: string;
};

export type FeedItem = {
  id: string;
  feedId: string;
  feedTitle: string;
  title: string;
  link: string;
  publishedAt: string | null;
  summary: string | null;
  imageUrl: string | null;
};

export type ParsedFeedResponse = {
  title: string;
  link?: string;
  items: Array<{
    id: string;
    title: string;
    link: string;
    publishedAt: string | null;
    summary: string | null;
    imageUrl: string | null;
  }>;
};

export const DEFAULT_CATEGORY = "Geral";

export type CategoryStyle = {
  emoji: string;
  color: string;
};

export const CATEGORY_COLORS = [
  "#0f766e",
  "#1d4ed8",
  "#7c3aed",
  "#be123c",
  "#c2410c",
  "#a16207",
  "#334155",
] as const;
