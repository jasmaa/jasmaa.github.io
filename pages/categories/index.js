import Head from 'next/head';
import Link from 'next/link';
import { Container } from 'reactstrap';

import config from '@lib/config';
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

      <Container className="py-5">
        <div id="top"></div>
        <Link href="/"><a>← Back to Home</a></Link>

        <div className="my-5">
          <div className="mb-5">
            <h1 className="mb-3">Categories</h1>
            <p>Assorted blog post categories</p>
          </div>
          <div className="d-flex flex-column">
            {Object.keys(categorizedPosts).map(category => (
              <div key={category} id={category}>
                <h2>{category}</h2>
                <a href="#top">Back to Top</a>
                <ul>
                  {categorizedPosts[category].map(post => (
                    <li><Link href={`blog/${post.id}`}><a>{post.title}</a></Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>
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