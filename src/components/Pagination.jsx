/* eslint-disable jsx-a11y/anchor-is-valid */
export default function Pagination({ index, setCurrentPage, currentPage }) {
  if (index < 0 || isNaN(index)) index = 1;
  const pages = new Array(index).fill().map((_, i) => i + 1);

  function pageCountComponent(page, i) {
    return (
      <div key={i} className="pageCount">
        <a
          key={page}
          className={page === currentPage ? `page pageActive` : "page"}
          onClick={() => {
            setCurrentPage(page);
          }}
        >
          {page}
        </a>
      </div>
    );
  }

  return (
    <div className="paginationJs">
      <div className="paginationPages">
        <nav>
          {currentPage > 3 && (
            <div className="pageCount">
              <span onClick={() => setCurrentPage(1)} className="page">
                1
              </span>
            </div>
          )}
          {currentPage > 1 && (
            <div className="pageCount">
              <span
                className="page"
                onClick={
                  currentPage > 1 ? () => setCurrentPage(currentPage - 1) : null
                }
              >
                ‹‹
              </span>
            </div>
          )}
          {index < 5
            ? pages.map((page, i) => {
                return pageCountComponent(page, i);
              })
            : currentPage >= index - 2
            ? pages.slice(index - 5, index).map((page, i) => {
                return pageCountComponent(page, i);
              })
            : currentPage < 4
            ? pages.slice(0, 5).map((page, i) => {
                return pageCountComponent(page, i);
              })
            : pages.slice(currentPage - 3, currentPage + 2).map((page, i) => {
                return pageCountComponent(page, i);
              })}
          {index > 5 && currentPage < index - 2 ? (
            <div className="pageCount">
              <span className="page">...</span>
            </div>
          ) : null}
          {currentPage !== index && (
            <div className="pageCount">
              <span onClick={() => setCurrentPage(index)} className="page">
                {index}
              </span>
            </div>
          )}
          <div className="pageCount">
            <span
              className="page"
              onClick={
                currentPage < index
                  ? () => setCurrentPage(currentPage + 1)
                  : null
              }
            >
              ››
            </span>
          </div>
        </nav>
      </div>
    </div>
  );
}
