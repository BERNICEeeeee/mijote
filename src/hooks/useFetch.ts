import { useState, useEffect, useCallback, type DependencyList } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFetch<T>(fetchFn: (signal: AbortSignal) => Promise<T>, dependencies: DependencyList = []) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const [reloadVersion, setReloadVersion] = useState(0);

  const reload = useCallback(() => setReloadVersion((version) => version + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    fetchFn(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!controller.signal.aborted && err.name !== 'AbortError') {
          setState({ data: null, loading: false, error: err });
        }
      });

    return () => controller.abort();
  // dependencies is intentionally the caller-defined list for this request.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFn, reloadVersion, ...dependencies]);

  return { ...state, reload };
}