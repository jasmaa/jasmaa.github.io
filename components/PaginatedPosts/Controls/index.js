import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

/**
 * Pagination controls
 * 
 * @param {*} param0 
 */
export default function Controller({ page, setPage, numPages, numDisplayPages }) {

  const startPage = Math.max(0, Math.min(page - 1, numPages - numDisplayPages));

  return (
    <Pagination>
      <PaginationItem>
        <PaginationLink first onClick={() => setPage(0)} />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink previous onClick={() => setPage(Math.max(page - 1, 0))} />
      </PaginationItem>
      {new Array(numDisplayPages)
        .fill(undefined)
        .map((_, i) => (
          <PaginationItem key={`pagination-item-${startPage + i}`} active={startPage + i === page}>
            <PaginationLink onClick={() => setPage(startPage + i)}>{startPage + i + 1}</PaginationLink>
          </PaginationItem>
        ))}
      <PaginationItem>
        <PaginationLink next onClick={() => setPage(Math.min(page + 1, numPages - 1))} />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink last onClick={() => setPage(numPages - 1)} />
      </PaginationItem>
    </Pagination>
  );
}