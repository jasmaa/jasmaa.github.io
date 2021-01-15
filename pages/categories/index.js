import Head from 'next/head';
import Link from 'next/link';

import config from '@lib/config';
import Layout from '@components/Layout';
import { getAllPostCategories, getSortedPostsData } from '@lib/posts';

/**
 * Blog post categories listing
 * 
 * @param {*} param0 
 */
export default function Categories({ categorizedPosts }) {
  return (
    <>
      <Head>
        <title>Categories - {config.siteName}</title>
      </Head>

      <Layout>
        <div id="top"></div>
        <Link href="/"><a>← Back to Home</a></Link>

        <div className="my-5">
          <div className="mb-5">
            <h1 className="text-6xl font-semibold mb-3">Categories</h1>
            <p className="text-3xl text-gray-500">Assorted blog post categories</p>
          </div>
          <div className="flex flex-col">
            {Object.keys(categorizedPosts).map(category => (
              <div key={category} id={category}>
                <h2 className="text-4xl">{category}</h2>
                <a href="#top">Back to Top</a>
                <ul className="list-disc list-inside">
                  {categorizedPosts[category].map(post => (
                    <li key={post.id}><Link href={`blog/${post.id}`}><a>{post.title}</a></Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}

export function getStaticProps() {
  const posts = getSortedPostsData();
  const allCategories = getAllPostCategories();
  const categorizedPosts = {};

  // Put each post into category bucket
  posts.forEach(post => {
    allCategories.forEach(category => {
      if (post.categories.includes(category)) {
        if (category in categorizedPosts) {
          categorizedPosts[category].push(post);
        } else {
          categorizedPosts[category] = [post];
        }
      }
    });
  });

  return {
    props: {
      categorizedPosts,
    }
  }
}