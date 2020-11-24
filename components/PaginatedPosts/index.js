import { useState } from 'react';

import Controls from './Controls';
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
  const numPages = Math.ceil(posts.length / postsPerPage);

  return (
    <>
      <div className="d-flex justify-content-center">
        <Controls page={page} setPage={setPage} numPages={numPages} numDisplayPages={numDisplayPages} />
      </div>
      {posts.slice(postsPerPage * page, postsPerPage * (page + 1))
        .map(post => <PostCard key={post.id} post={post} />)
      }
    </>
  );
}