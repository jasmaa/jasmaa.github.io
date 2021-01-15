import fs from 'fs';
import Head from 'next/head';

import Layout from '@components/Layout';
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
        <Layout>
          <h1 className="text-5xl mb-5">Blog</h1>
          <h2 className="text-gray-500 text-3xl mb-10">Writing about projects among other things</h2>
          <PaginatedPosts posts={posts} />
        </Layout>
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