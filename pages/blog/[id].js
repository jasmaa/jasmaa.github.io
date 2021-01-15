import Head from 'next/head';
import { Container } from 'reactstrap';

import Layout from '@components/Layout';
import Categories from '@components/CategoriesList';
import PostNavigation from '@components/PostNavigation';
import config from '@lib/config';
import { getAllPostIDs, getPostData, getSortedPostsData } from '@lib/posts';
import DrawerContainer from '@components/DrawerContainer';

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

      <DrawerContainer>
        <Layout>
          <div className="flex justify-center">
            <PostNavigation nextPost={nextPost} prevPost={prevPost} />
          </div>

          <div className="mt-8 mb-5">
            <h3 className="text-xl"><em>{new Date(postData.date).toDateString()}</em></h3>
            <div className="mt-5 mb-8">
              <h1>{postData.title}</h1>
              <h3 className="text-3xl mt-3"><em>{postData.subtitle}</em></h3>
            </div>
            <Categories categories={postData.categories} />
            <div className="border-t-2 mt-5 mb-10" />
            <div className="prose-xl post-content" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
          </div>

          <div className="flex justify-center">
            <PostNavigation nextPost={nextPost} prevPost={prevPost} />
          </div>
        </Layout>
      </DrawerContainer>
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