'use client';

import { useEffect } from 'react';
import { usePlacesStore, useFiltersStore } from '@/lib/storeDb';

export default function Providers({ children }: { children: React.ReactNode }) {
  const fetchPlaces = usePlacesStore((state) => state.fetchPlaces);
  const fetchFilters = useFiltersStore((state) => state.fetchFilters);

  useEffect(() => {
    // Fetch data from database on app load
    fetchPlaces();
    fetchFilters();
  }, [fetchPlaces, fetchFilters]);

  return <>{children}</>;
}

