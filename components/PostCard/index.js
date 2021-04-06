import Link from 'next/link';

import CategoriesList from '@components/CategoriesList';

/**
 * Shorthand card for blog post entry
 */
export default function PostCard({ post }) {
  return (
    <div className="shadow-xl bg-white p-10 rounded-lg">
      <small><em>{new Date(post.date).toDateString()}</em></small>
      <h2><Link href={`/blog/${post.id}`}><a className="hover:no-underline">{post.title}</a></Link></h2>
      <div className="text-xl my-2">
        {post.subtitle}
      </div>
      <div className="border-t-2 w-20 my-3" />
      <CategoriesList categories={post.categories} />
    </div>
  );
}