import Head from 'next/head';
import { Container } from 'reactstrap';

import config from '@lib/config';
import { getAllPostIDs, getPostData } from '@lib/posts';

export default function Post({ postData }) {
  return (
    <>
      <Head>
        <title>{postData.title} - {config.siteName}</title>
      </Head>

      <Container>
        <pre>
          {JSON.stringify(postData, null, 2)}
        </pre>
        <h1>{postData.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
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

export async function getStaticProps({params}) {
  const postData = await getPostData(params.id);
  return {
          props: {
          postData
        }
  }
}