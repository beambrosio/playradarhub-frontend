// src/hooks/useInfiniteScroll.js
import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(loadMore, hasMore) {
  const observer = useRef();

  const lastElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loadMore, hasMore]);

  return lastElementRef;
}
