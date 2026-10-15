"use client";

import { Star } from "lucide-react";
import { useFavorites } from "@/lib/use-favorites";

type FavoriteButtonProps = {
  slug: string;
  title: string;
  variant?: "card" | "detail" | "compact";
};

export function FavoriteButton({ slug, title, variant = "card" }: FavoriteButtonProps) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const selected = favoriteIds.includes(slug);
  const action = selected ? "즐겨찾기 해제" : "즐겨찾기 추가";

  return (
    <button
      type="button"
      className={`favorite-button favorite-button--${variant}${selected ? " is-active" : ""}`}
      aria-label={`${title} ${action}`}
      title={`${title} ${action}`}
      aria-pressed={selected}
      onClick={() => toggleFavorite(slug)}
    >
      <Star size={19} strokeWidth={2} fill={selected ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
