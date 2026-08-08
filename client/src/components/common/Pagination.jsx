import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function Pagination({ currentPage = 1, pageSize = 10, totalItems = 0, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const goPrev = () => {
    if (currentPage > 1) onPageChange?.(currentPage - 1);
  };

  const goNext = () => {
    if (currentPage < totalPages) onPageChange?.(currentPage + 1);
  };

  return (
    <div className="pagination">
      <span className="pagination__summary">
        Showing {startItem}-{endItem} of {totalItems} results
      </span>

      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__button"
          onClick={goPrev}
          disabled={currentPage <= 1}
          aria-label="Halaman sebelumnya"
        >
          <FiChevronLeft />
        </button>
        <button
          type="button"
          className="pagination__button"
          onClick={goNext}
          disabled={currentPage >= totalPages}
          aria-label="Halaman berikutnya"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
