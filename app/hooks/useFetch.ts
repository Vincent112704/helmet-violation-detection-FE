import { useEffect, useState, useCallback } from "react";

type FetchState<T> =
  | { status: "loading"; data: undefined; error: undefined }
  | { status: "success"; data: T; error: undefined }
  | { status: "error"; data: undefined; error: Error };

export function useFetch<T>(
  fetcher: (() => Promise<T>) | null, // null = skip (e.g. waiting on a dependency)
  deps: React.DependencyList = []
) {
  const [state, setState] = useState<FetchState<T>>({
    status: "loading",
    data: undefined,
    error: undefined,
  });
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = useCallback(() => setRefetchIndex((i) => i + 1), []);

  useEffect(() => {
    if (fetcher === null) return;

    let cancelled = false;
    setState({ status: "loading", data: undefined, error: undefined });

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ status: "success", data, error: undefined });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            status: "error",
            data: undefined,
            error: err instanceof Error ? err : new Error(String(err)),
          });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, refetchIndex, ...deps]);

  return { ...state, refetch };
}