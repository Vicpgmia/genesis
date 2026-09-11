"use client";

import {
  Bookmark,
  BookmarkCheck,
  CheckCheck,
  ExternalLink,
} from "lucide-react";

import { CoverImage } from "@/components/cover-image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FeedItem } from "@/lib/types";
import type { ViewMode } from "@/lib/storage";
import { cn } from "@/lib/utils";

type TimelineItemsProps = {
  items: FeedItem[];
  viewMode: ViewMode;
  readIds: Set<string>;
  laterIds: Set<string>;
  formatDate: (value: string | null) => string;
  onToggleRead: (id: string) => void;
  onToggleLater: (id: string) => void;
};

export function TimelineItems({
  items,
  viewMode,
  readIds,
  laterIds,
  formatDate,
  onToggleRead,
  onToggleLater,
}: TimelineItemsProps) {
  if (viewMode === "list") {
    return (
      <ul className="space-y-3">
        {items.map((item) => {
          const isRead = readIds.has(item.id);
          const isLater = laterIds.has(item.id);
          return (
            <li
              key={item.id}
              className={cn(
                "rounded-2xl border border-border/80 bg-background/80 p-4 shadow-[0_1px_0_rgba(20,30,25,0.04)] transition-opacity dark:shadow-none",
                isRead && "opacity-60",
              )}
            >
              <div className="flex flex-wrap items-start gap-3">
                <span
                  className={cn(
                    "mt-1.5 size-2.5 shrink-0 rounded-full",
                    isRead ? "bg-border" : "bg-emerald-700 dark:bg-emerald-400",
                  )}
                  aria-hidden
                />
                {item.imageUrl ? (
                  <CoverImage
                    src={item.imageUrl}
                    alt=""
                    className="size-20 shrink-0 rounded-xl sm:size-24"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span>{item.feedTitle}</span>
                    <span aria-hidden>·</span>
                    <time dateTime={item.publishedAt || undefined}>
                      {formatDate(item.publishedAt)}
                    </time>
                  </div>
                  <h2 className="text-lg leading-snug font-medium text-foreground">
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                        onClick={() => {
                          if (!isRead) onToggleRead(item.id);
                        }}
                      >
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </h2>
                  {item.summary ? (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {item.summary}
                    </p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleRead(item.id)}
                    >
                      {isRead ? "Marcar não lido" : "Marcar lido"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={isLater ? "default" : "outline"}
                      onClick={() => onToggleLater(item.id)}
                    >
                      {isLater ? (
                        <BookmarkCheck data-icon="inline-start" />
                      ) : (
                        <Bookmark data-icon="inline-start" />
                      )}
                      {isLater ? "Salvo para depois" : "Ler mais tarde"}
                    </Button>
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[0.8rem] text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        Abrir
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const isRead = readIds.has(item.id);
          const isLater = laterIds.has(item.id);
          return (
            <Card
              key={item.id}
              className={cn(
                "h-full overflow-hidden bg-background/85 pt-0 transition-opacity",
                isRead && "opacity-60",
              )}
            >
              {item.imageUrl ? (
                <CoverImage
                  src={item.imageUrl}
                  alt=""
                  className="aspect-[16/9] w-full rounded-none"
                />
              ) : null}
              <CardHeader className="gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      isRead ? "bg-border" : "bg-emerald-700 dark:bg-emerald-400",
                    )}
                    aria-hidden
                  />
                  <span className="truncate">{item.feedTitle}</span>
                </div>
                <CardTitle className="text-base leading-snug">
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                      onClick={() => {
                        if (!isRead) onToggleRead(item.id);
                      }}
                    >
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </CardTitle>
                <CardDescription>
                  <time dateTime={item.publishedAt || undefined}>
                    {formatDate(item.publishedAt)}
                  </time>
                </CardDescription>
              </CardHeader>
              {item.summary ? (
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {item.summary}
                  </p>
                </CardContent>
              ) : null}
              <CardFooter className="flex flex-wrap gap-2 border-t-0 bg-transparent">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onToggleRead(item.id)}
                >
                  {isRead ? "Não lido" : "Lido"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={isLater ? "default" : "outline"}
                  onClick={() => onToggleLater(item.id)}
                  aria-label={isLater ? "Remover de ler mais tarde" : "Ler mais tarde"}
                >
                  {isLater ? <BookmarkCheck /> : <Bookmark />}
                </Button>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[0.8rem] text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    Abrir
                    <ExternalLink className="size-3.5" />
                  </a>
                ) : null}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border/70 overflow-hidden rounded-xl border border-border/80 bg-background/80">
      {items.map((item) => {
        const isRead = readIds.has(item.id);
        const isLater = laterIds.has(item.id);
        return (
          <li
            key={item.id}
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 transition-opacity",
              isRead && "opacity-55",
            )}
          >
            <span
              className={cn(
                "size-2 shrink-0 rounded-full",
                isRead ? "bg-border" : "bg-emerald-700 dark:bg-emerald-400",
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-medium text-foreground">
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                    onClick={() => {
                      if (!isRead) onToggleRead(item.id);
                    }}
                  >
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </h2>
              <p className="truncate text-xs text-muted-foreground">
                {item.feedTitle}
                <span aria-hidden> · </span>
                <time dateTime={item.publishedAt || undefined}>
                  {formatDate(item.publishedAt)}
                </time>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                onClick={() => onToggleRead(item.id)}
                aria-label={isRead ? "Marcar não lido" : "Marcar lido"}
              >
                <CheckCheck />
              </Button>
              <Button
                type="button"
                size="icon-xs"
                variant={isLater ? "default" : "ghost"}
                onClick={() => onToggleLater(item.id)}
                aria-label={isLater ? "Remover de ler mais tarde" : "Ler mais tarde"}
              >
                {isLater ? <BookmarkCheck /> : <Bookmark />}
              </Button>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Abrir artigo"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
