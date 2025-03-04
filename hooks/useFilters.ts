import {useState} from "react";
import {Filters} from "../entities/Filters";

type UseFilters = {
  filters: Filters,
  setFilters: (filters: Filters) => void,
  resetFilters: () => void,
}

const defaultFilters: Filters = {
  textSearch: "",
  displayHidden: false,
  displayViewed: false,
  displayDiscouraged: false,
  displayRecommended: false,
  displayWithoutInteraction: true,
  durationGroup: "custom",
  minDuration: 2,
  maxDuration: 999999,
  excludedSubscriptions: [],
}

const useFilters = (): UseFilters => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  return {filters, setFilters, resetFilters: () => setFilters(defaultFilters)}
};

export default useFilters;
