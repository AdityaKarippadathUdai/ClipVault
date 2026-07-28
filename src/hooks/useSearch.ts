import { useState, useMemo } from 'react';

export function useSearch<T>(items: T[], filterFn: (item: T, query: string) => boolean) {
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    return items.filter((item) => filterFn(item, query.trim().toLowerCase()));
  }, [items, query, filterFn]);

  return { query, setQuery, filteredItems };
}
