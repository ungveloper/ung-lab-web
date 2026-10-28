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
      className={`${`favorite-button favorite-button--${variant}${selected ? " is-active" : ""}`} [.tool-card_&]:absolute [.tool-card_&]:top-[15px] [.tool-card_&]:right-[15px] [.tool-card_&]:z-2 inline-flex items-center justify-center [flex-shrink:0] w-[38px] h-[38px] p-0 [border:1px_solid_#dce5f3] rounded-[11px] text-[#8290a5] bg-[#fff] cursor-pointer [transition:background-color_.16s,border-color_.16s,color_.16s] hover:bg-[#fff8e8] hover:border-[#eed08a] hover:text-[#bc850c] [&.is-active]:bg-[#fff7df] [&.is-active]:border-[#f1d382] [&.is-active]:text-[#d49911] focus-visible:[outline:3px_solid_#2563eb] focus-visible:[outline-offset:3px] w-[43px] h-[43px] rounded-[12px] w-[35px] h-[35px] rounded-[9px] [.related-item_&]:absolute [.related-item_&]:right-[10px] [.related-item_&]:top-[50%] [.related-item_&]:[transform:translateY(-50%)] [.related-item_&]:z-2 [.favorite-category-card_&]:absolute [.favorite-category-card_&]:right-[10px] [.favorite-category-card_&]:top-[50%] [.favorite-category-card_&]:[transform:translateY(-50%)] [.favorite-category-card_&]:z-2 max-[600px]:[.tool-card_&]:right-[9px] max-[600px]:[.tool-card_&]:top-[9px] max-[600px]:w-[34px] max-[600px]:h-[34px] max-[600px]:w-10 max-[600px]:h-10 [.chat-result-card_&]:static [.chat-result-card_&]:[inset:auto] [.chat-result-card_&]:[align-self:center] [.chat-result-card_&]:[justify-self:center] [.chat-result-card_&]:m-0 [.chat-result-card_&]:z-auto [.chat-result-card_&]:[grid-column:1] [.chat-result-card_&]:[grid-row:1]`}
      aria-label={`${title} ${action}`}
      title={`${title} ${action}`}
      aria-pressed={selected}
      onClick={() => toggleFavorite(slug)}
    >
      <Star size={19} strokeWidth={2} fill={selected ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
