import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody } from "reactstrap";

import Controller from './Controller';
import CategoriesList from '@components/CategoriesList';

const postsPerPage = 2;
const numDisplayPages = 4;

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
          <Card key={post.id} className="m-3">
            <CardBody>
              <small><em>{new Date(post.date).toDateString()}</em></small>
              <h2><Link href={`/blog/${post.id}`}><a>{post.title}</a></Link></h2>
              <div className="mt-2 mb-4">
                <h5><em>{post.subtitle}</em></h5>
              </div>
              <CategoriesList categories={post.categories} />
            </CardBody>
          </Card>
        ))
      }
      <div className="d-flex justify-content-center">
        <Controller page={page} setPage={setPage} numPages={numPages} numDisplayPages={numDisplayPages} />
      </div>
    </>
  );
}