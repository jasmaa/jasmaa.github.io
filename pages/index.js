import Head from 'next/head';
import Link from 'next/link';
import { Container, Row, Col } from 'reactstrap';

import config from '@lib/config';
import { getSortedPostsData } from '@lib/posts';
import style from '@styles/Home.module.css';
import PostPagination from '@components/PostPagination';

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
      </Head>

      <Container className="py-5">

        <Row>
          <Col sm="12" md={{ size: 8, offset: 2 }}>
            <div className="d-flex flex-column align-items-center my-3">
              <img className={style['profile-img']} src="/images/me.jpg" />
              <h1 className={style['headline']}>Jason Maa</h1>
              <h4>Student at the University of Maryland</h4>
            </div>
            <p style={{ textAlign: 'center' }}>
              I am an undergraduate student at the University of Maryland studying computer science.
              I primarily work on web and machine learning projects.
              In my free time, I enjoy reading, taking hikes,
              and doing language studies.
            </p>
          </Col>
        </Row>

        <div>
          <h2>Blog Posts</h2>
          <PostPagination posts={posts} />
        </div>
      </Container>
    </>
  )
}

export async function getStaticProps({ params }) {
  const posts = getSortedPostsData();
  return {
    props: {
      posts
    }
  }
}