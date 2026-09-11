import { DEFAULT_CATEGORY, type CategoryStyle, type Feed } from "@/lib/types";

const FEEDS_KEY = "genesis.feeds.v1";
const READ_KEY = "genesis.read.v1";
const LATER_KEY = "genesis.later.v1";
const OPEN_CATEGORIES_KEY = "genesis.openCategories.v1";
const CATEGORY_STYLES_KEY = "genesis.categoryStyles.v1";
const VIEW_KEY = "genesis.viewMode.v1";
const LATER_TAB_KEY = "genesis.laterTab.v1";

export type ViewMode = "list" | "cards" | "titles";
export type LaterTab = "all" | "by-category";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeFeed(raw: Partial<Feed> & { id: string; url: string; title: string }): Feed {
  return {
    id: raw.id,
    url: raw.url,
    title: raw.title,
    category: (raw.category || DEFAULT_CATEGORY).trim() || DEFAULT_CATEGORY,
    addedAt: raw.addedAt || new Date().toISOString(),
  };
}

export function loadFeeds(): Feed[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(FEEDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Partial<Feed> & { id: string; url: string; title: string }>;
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeFeed);
  } catch {
    return [];
  }
}

export function saveFeeds(feeds: Feed[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(FEEDS_KEY, JSON.stringify(feeds));
}

export function loadReadIds(): Set<string> {
  if (!canUseStorage()) return new Set();
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function saveReadIds(ids: Set<string>) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
}

export function loadLaterIds(): Set<string> {
  if (!canUseStorage()) return new Set();
  try {
    const raw = window.localStorage.getItem(LATER_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function saveLaterIds(ids: Set<string>) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(LATER_KEY, JSON.stringify([...ids]));
}

export function loadOpenCategories(fallback: string[]): string[] {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(OPEN_CATEGORIES_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function saveOpenCategories(categories: string[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(OPEN_CATEGORIES_KEY, JSON.stringify(categories));
}

export function loadViewMode(): ViewMode {
  if (!canUseStorage()) return "list";
  try {
    const raw = window.localStorage.getItem(VIEW_KEY);
    if (raw === "cards" || raw === "titles") return raw;
    return "list";
  } catch {
    return "list";
  }
}

export function saveViewMode(mode: ViewMode) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(VIEW_KEY, mode);
}

export function loadLaterTab(): LaterTab {
  if (!canUseStorage()) return "all";
  try {
    const raw = window.localStorage.getItem(LATER_TAB_KEY);
    return raw === "by-category" ? "by-category" : "all";
  } catch {
    return "all";
  }
}

export function saveLaterTab(tab: LaterTab) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(LATER_TAB_KEY, tab);
}

function normalizeCategoryStyle(raw: Partial<CategoryStyle> | undefined): CategoryStyle {
  return {
    emoji: typeof raw?.emoji === "string" ? raw.emoji : "",
    color: typeof raw?.color === "string" ? raw.color : "",
  };
}

export function loadCategoryStyles(): Record<string, CategoryStyle> {
  if (!canUseStorage()) return {};
  try {
    const raw = window.localStorage.getItem(CATEGORY_STYLES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Partial<CategoryStyle>>;
    if (!parsed || typeof parsed !== "object") return {};
    const next: Record<string, CategoryStyle> = {};
    for (const [name, style] of Object.entries(parsed)) {
      next[name] = normalizeCategoryStyle(style);
    }
    return next;
  } catch {
    return {};
  }
}

export function saveCategoryStyles(styles: Record<string, CategoryStyle>) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(CATEGORY_STYLES_KEY, JSON.stringify(styles));
}
