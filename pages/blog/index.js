import fs from 'fs';
import Head from 'next/head';
import { Container } from 'reactstrap';

import PaginatedPosts from '@components/PaginatedPosts';
import DrawerContainer from '@components/DrawerContainer';
import config from '@lib/config';
import { getSortedPostsData } from '@lib/posts';
import { generateRSSFeed } from '@lib/rss';

/**
 * Blog page
 * 
 * @param {*} param0 
 */
export default function Blog({ posts }) {
  return (
    <>
      <Head>
        <title>Blog - {config.siteName}</title>
      </Head>

      <DrawerContainer>
        <Container className="pb-5">
          <h1 className="mb-3">Blog</h1>
          <p>Writing about projects among other things</p>
          <div className="py-1">
            <PaginatedPosts posts={posts} />
          </div>
        </Container>
      </DrawerContainer>
    </>
  );
}

export async function getStaticProps({ params }) {
  const posts = getSortedPostsData();

  // Write rss feed
  const rss = generateRSSFeed();
  fs.writeFileSync('./public/rss.xml', rss);

  return {
    props: {
      posts,
    }
  }
}