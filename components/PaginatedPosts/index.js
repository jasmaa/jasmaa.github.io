import { useState } from 'react';

import Controls from './Controls';
import PostCard from '@components/PostCard';

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
    <div className="flex flex-col justify-between">
      <div className="flex justify-center pb-5">
        <Controls page={page} setPage={setPage} numPages={numPages} numDisplayPages={numDisplayPages} />
      </div>
      <div>
        {posts.slice(postsPerPage * page, postsPerPage * (page + 1))
          .map(post => (
            <div key={post.id} className="animate__animated animate__fadeIn mb-10">
              <PostCard post={post} />
            </div>
          ))
        }
      </div>
    </div>
  );
}