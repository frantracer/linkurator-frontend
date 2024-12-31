import {hasInteraction, SubscriptionItem} from "./SubscriptionItem";

type DurationGroup = "all" | "short" | "medium" | "long" | "custom";

export type Filters = {
  displayWithoutInteraction: boolean;
  displayHidden: boolean;
  displayViewed: boolean;
  displayDiscouraged: boolean;
  displayRecommended: boolean;
  textSearch: string;
  durationGroup: DurationGroup;
  minDuration: number;
  maxDuration: number;
  excludedSubscriptions: string[];
}

export function getFilterDuration(filters: Filters): { min: number, max: number } {
  switch (filters.durationGroup) {
    case "short":
      return {min: 0, max: 119};
    case "medium":
      return {min: 120, max: 3599};
    case "long":
      return {min: 3600, max: 999999};
    case "all":
      return {min: 0, max: 999999};
    default:
      return {min: filters.minDuration * 60, max: filters.maxDuration * 60};
  }
}

export function isItemShown(item: SubscriptionItem, filters: Filters) {
  if (!filters.displayRecommended && !filters.displayDiscouraged &&
    !filters.displayViewed && !filters.displayHidden &&
    !filters.displayWithoutInteraction) {
    return true;
  }
  return (
    (filters.displayWithoutInteraction && !hasInteraction(item)) ||
    (filters.displayHidden && item.hidden) ||
    (filters.displayViewed && item.viewed) ||
    (filters.displayDiscouraged && item.discouraged) ||
    (filters.displayRecommended && item.recommended)
  );
}

export const durationOptions: { key: DurationGroup, label: string }[] = [
  {key: "short", label: "short_duration"},
  {key: "medium", label: "medium_duration"},
  {key: "long", label: "long_duration"},
  {key: "all", label: "any_duration"},
  {key: "custom", label: "custom_duration"}
]
