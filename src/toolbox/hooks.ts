'use client';

import { useEffect, useState } from 'react';

export function useDependency<TFetcher extends () => Promise<unknown>>(
  fetcher: TFetcher
) {
  const [result, setResult] = useState<null | Awaited<ReturnType<TFetcher>>>(
    null
  );

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const runFetcher = async () => {
      if (isLoading) {
        return;
      }

      setIsLoading(true);

      const response = (await fetcher()) as Awaited<ReturnType<TFetcher>>;

      setResult(response);
      setIsLoading(false);
    };

    if (!isLoading) {
      console.log('Starting fetch');
      runFetcher();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { result, isLoading };
}
