import Link from "next/link";

/**
 * Controls navigation through blog posts
 */
export default function PostNavigation({ prevPost, nextPost }) {
  return (
    <div className="flex text-xl">
      {nextPost
        ? <Link href={`/blog/${nextPost.id}`}><a>←</a></Link>
        : <div className="text-gray-500 select-none">←</div>}
      <div className="mx-5">
        <Link href="/"><a>Back to Home</a></Link>
      </div>
      {prevPost
        ? <Link href={`/blog/${prevPost.id}`}><a>→</a></Link>
        : <div className="text-gray-500 select-none">→</div>}
    </div >
  );
}