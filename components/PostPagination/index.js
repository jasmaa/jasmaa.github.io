import { useState } from 'react';

import Controller from './Controller';
import PostCard from './PostCard';

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
        .map(post => <PostCard key={post.id} post={post} />)
      }
      <div className="d-flex justify-content-center">
        <Controller page={page} setPage={setPage} numPages={numPages} numDisplayPages={numDisplayPages} />
      </div>
    </>
  );
}