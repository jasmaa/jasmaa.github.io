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
            <Link href={`/blog/${nextPost.id}`}><PaginationLink previous /></Link>
          </PaginationItem>
        )
        : <PaginationItem disabled><PaginationLink previous /></PaginationItem>}
      <PaginationItem>
        <Link href="/"><PaginationLink>Back to Home</PaginationLink></Link>
      </PaginationItem>
      {prevPost
        ? (
          <PaginationItem>
            <Link href={`/blog/${prevPost.id}`}><PaginationLink next /></Link>
          </PaginationItem>
        )
        : <PaginationItem disabled><PaginationLink next /></PaginationItem>}
    </Pagination >
  );
}