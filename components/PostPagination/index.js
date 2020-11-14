import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, Pagination, PaginationItem, PaginationLink } from "reactstrap";

import CategoriesList from '@components/CategoriesList';

const postsPerPage = 2;

/**
 * Paginated container for blog posts
 * 
 * @param {*} param0 
 */
export default function PostPagination({ posts }) {

  const [page, setPage] = useState(0);
  const numPages = posts.length / postsPerPage;

  return (
    <>
      {posts.slice(postsPerPage * page, postsPerPage * (page + 1))
        .map(post => (
          <Card key={posts.id} className="m-3">
            <CardBody>
              <h2><Link href={`/blog/${post.id}`}><a>{post.title}</a></Link></h2>
              <div className="d-flex flex-column mt-2 mb-4">
                <em>{post.subtitle}</em>
                <em>{new Date(post.date).toDateString()}</em>
              </div>
              <CategoriesList categories={post.categories} />
            </CardBody>
          </Card>
        ))
      }
      <div className="d-flex justify-content-center">
        <Pagination>
          <PaginationItem>
            <PaginationLink first onClick={() => setPage(0)} />
          </PaginationItem>
          {new Array(numPages)
            .fill(undefined)
            .map((_, i) => (
              <PaginationItem key={`pagination-item-${i}`} active={i === page}>
                <PaginationLink onClick={() => setPage(i)}>{i + 1}</PaginationLink>
              </PaginationItem>
            ))}
          <PaginationItem>
            <PaginationLink last onClick={() => setPage(numPages - 1)} />
          </PaginationItem>
        </Pagination>
      </div>
    </>
  );
}