import Head from 'next/head';

import Layout from '@components/Layout';
import Categories from '@components/CategoriesList';
import Divider from '@components/Divider';
import PostNavigation from '@components/PostNavigation';
import config from '@lib/config';
import { getAllPostIDs, getPostData, getSortedPostsData } from '@lib/posts';

/**
 * Blog post
 * 
 * @param {*} param0 
 */
export default function Post({ postData, prevPost, nextPost }) {
  return (
    <>
      <Head>
        <title>{postData.title} - {config.siteName}</title>
      </Head>

      <Layout>
        <div className="flex justify-center my-14">
          <PostNavigation nextPost={nextPost} prevPost={prevPost} />
        </div>

        <div className="mb-5">
          <div className="mb-8">
            <h3 className="text-xl mt-3"><em>{new Date(postData.date).toDateString()}</em></h3>
            <h1 className="text-5xl mt-3">{postData.title}</h1>
            <h3 className="text-2xl mt-3"><em>{postData.subtitle}</em></h3>
          </div>
          <Categories categories={postData.categories} />
          <Divider />

          <div
            className="post-content prose prose-xl max-w-none w-full"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
          />
        </div>

        <div className="flex justify-center my-14">
          <PostNavigation nextPost={nextPost} prevPost={prevPost} />
        </div>
      </Layout>
    </>
  );
}


export async function getStaticPaths() {
  const paths = getAllPostIDs();
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);

  const sortedPosts = getSortedPostsData();
  const postIdx = sortedPosts.findIndex(post => post.id === params.id, params.id);

  return {
    props: {
      postData,
      nextPost: postIdx > 0 ? sortedPosts[postIdx - 1] : null,
      prevPost: postIdx < sortedPosts.length - 1 ? sortedPosts[postIdx + 1] : null,
    }
  }
}