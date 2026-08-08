import { useEffect, useState } from "react";

function useFetch(fetchFn) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let ignore = false;

    setIsLoading(true);
    setError(null);

    fetchFn()
      .then((result) => {
        if (!ignore) setData(result);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Gagal memuat data.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [fetchFn, reloadToken]);

  const refetch = () => setReloadToken((token) => token + 1);

  return { data, isLoading, error, refetch };
}

export default useFetch;