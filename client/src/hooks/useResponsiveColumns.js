import { useEffect, useState } from "react";

function getColumns() {
  if (typeof window === "undefined") return 5;
  const width = window.innerWidth;
  if (width <= 767) return 2;
  if (width <= 1023) return 4;
  return 5;
}

function useResponsiveColumns() {
  const [columns, setColumns] = useState(getColumns);

  useEffect(() => {
    function handleResize() {
      setColumns(getColumns());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return columns;
}

export default useResponsiveColumns;