import fs from 'fs';
import Head from 'next/head';

import Layout from '@components/Layout';
import ProjectsDisplay from '@components/ProjectsDisplay';
import Divider from '@components/Divider';
import Navbar from '@components/Navbar';
import PostCard from '@components/PostCard';
import config from '@lib/config';
import { projectItems } from '@lib/content';
import { getSortedPostsData } from '@lib/posts';
import { generateRSSFeed } from '@lib/rss';


/**
 * Home page
 * 
 * @param {*} param0 
 */
export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>Home - {config.siteName}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={config.siteDescription} />
      </Head>

      <Layout>
        <div className="mb-5 animate__animated animate__fadeIn">
          <div className="flex flex-col items-center my-3">
            <img className="w-72 rounded-full shadow-xl" src="/images/me.jpg" />
            <h1 className="text-6xl text-center my-10">Jason Maa</h1>
            <p className="text-xl py-5 md:w-2/3">
              I am an undergraduate student at the University of Maryland studying computer science.
              I primarily work on web and machine learning projects.
              In my free time, I enjoy reading, taking hikes,
              and doing language studies.
            </p>
          </div>
        </div>

        <Navbar />
        <Divider />

        <h2 className="text-4xl mt-20 mb-10">Latest Posts</h2>
        {posts.map(post => (
          <div key={post.id} className="mb-10">
            <PostCard post={post} />
          </div>
        ))}
        <Divider />

        <h2 className="text-4xl mt-20 mb-10">Projects</h2>
        <ProjectsDisplay items={projectItems} />
      </Layout>
    </>
  )
}

export async function getStaticProps({ params }) {
  const posts = getSortedPostsData().slice(0, 2);

  // Write rss feed
  const rss = generateRSSFeed();
  fs.writeFileSync('./public/rss.xml', rss);

  return {
    props: {
      posts,
    }
  }
}