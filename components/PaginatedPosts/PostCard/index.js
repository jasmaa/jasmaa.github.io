import Link from 'next/link';
import { Card, CardBody } from "reactstrap";

import CategoriesList from '@components/CategoriesList';

/**
 * Shorthand card for blog post entry
 */
export default function PostCard({ post }) {
  return (
    <div className="rounded shadow-xl bg-white p-4 animate__animated animate__fadeIn">
      <small><em>{new Date(post.date).toDateString()}</em></small>
      <h2><Link href={`/blog/${post.id}`}><a>{post.title}</a></Link></h2>
      <div className="text-2xl mt-2 mb-4">
        <h5><em>{post.subtitle}</em></h5>
      </div>
      <CategoriesList categories={post.categories} />
    </div>
  );
}