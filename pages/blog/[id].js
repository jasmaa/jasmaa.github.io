import Head from 'next/head';
import { Container } from 'reactstrap';

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
        <Container className="py-5">
          <div className="d-flex justify-content-center">
            <PostNavigation nextPost={nextPost} prevPost={prevPost} />
          </div>

          <div className="mt-3 mb-5">
            <h5><em>{new Date(postData.date).toDateString()}</em></h5>
            <div className="my-3">
              <h1>{postData.title}</h1>
              <h4><em>{postData.subtitle}</em></h4>
            </div>
            <Categories categories={postData.categories} />
            <hr className="my-3" />
            <div className="post-content" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
          </div>

          <div className="d-flex justify-content-center">
            <PostNavigation nextPost={nextPost} prevPost={prevPost} />
          </div>
        </Container>
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