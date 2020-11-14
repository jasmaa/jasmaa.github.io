import Link from "next/link";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

/**
 * Controls navigation through blog posts
 */
export default function PostNavigation({ prevPost, nextPost }) {
  return (
    <Pagination>
      {nextPost
        ? (
          <PaginationItem>
            <Link href={`/blog/${nextPost.id}`}><a className="page-link">←</a></Link>
          </PaginationItem>
        )
        : <PaginationItem disabled><a className="page-link">←</a></PaginationItem>}
      <PaginationItem>
        <Link href="/"><a className="page-link">Back to Home</a></Link>
      </PaginationItem>
      {prevPost
        ? (
          <PaginationItem>
            <Link href={`/blog/${prevPost.id}`}><a className="page-link">→</a></Link>
          </PaginationItem>
        )
        : <PaginationItem disabled><a className="page-link">→</a></PaginationItem>}
    </Pagination >
  );
}