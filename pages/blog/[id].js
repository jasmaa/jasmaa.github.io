import Head from 'next/head';
import Link from 'next/link';
import { Card, CardBody, Container } from 'reactstrap';

import Categories from '@components/CategoriesList';
import config from '@lib/config';
import { getAllPostIDs, getPostData } from '@lib/posts';

/**
 * Blog post
 * 
 * @param {*} param0 
 */
export default function Post({ postData }) {
  return (
    <>
      <Head>
        <title>{postData.title} - {config.siteName}</title>
      </Head>

      <Container className="py-5">
        <Link href="/"><a>← Back to Home</a></Link>

        <div className="my-5">
          <h1>{postData.title}</h1>
          <h4>
            <em>{postData.subtitle}</em>
          </h4>
          <h4>
            <em>{new Date(postData.date).toDateString()}</em>
          </h4>
          <Categories categories={postData.categories} />
          <hr className="my-3" />
          <div className="post-content" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </div>

        <Link href="/"><a>← Back to Home</a></Link>

      </Container>
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
  return {
    props: {
      postData
    }
  }
}