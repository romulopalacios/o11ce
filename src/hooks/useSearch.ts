"use client";

import { useMemo, useState } from "react";

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function useSearch<T>(
  items: T[],
  searchFields: (item: T) => string[],
) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return items;
    }

    const normalizedQuery = normalizeSearchText(query);

    return items.filter((item) => {
      return searchFields(item).some((field) => {
        const normalizedField = normalizeSearchText(field ?? "");
        return normalizedField.includes(normalizedQuery);
      });
    });
  }, [items, query, searchFields]);

  return {
    query,
    setQuery,
    filtered,
    hasQuery: query.trim().length > 0,
  };
}
