import Head from 'next/head';

import Layout from '@components/Layout';
import Categories from '@components/CategoriesList';
import Divider from '@components/Divider';
import PostNavigation from '@components/PostNavigation';
import config from '@lib/config';
import { displayDate } from '@lib/utils';
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
            <h3 className="text-xl mt-3"><em>{displayDate(new Date(postData.date))}</em></h3>
            <h1 className="text-5xl mt-3">{postData.title}</h1>
            <h3 className="text-2xl mt-3">{postData.subtitle}</h3>
          </div>
          <Categories categories={postData.categories} />
          <Divider />

          <div className="flex justify-center">
            <div
              className="post-content prose prose-xl w-full"
              dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
            />
          </div>
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