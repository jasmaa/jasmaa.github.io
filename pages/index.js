import Head from 'next/head';
import Link from 'next/link';
import { Card, CardBody, Container } from 'reactstrap';

import config from '@lib/config';
import { getSortedPostsData } from '@lib/posts';
import style from '@styles/Home.module.css';

export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>Home - {config.siteName}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <div className="d-flex flex-column align-items-center my-5">
          <img className={style['profile-img']} src="/images/me.jpg" />
          <h1> Jason Maa</h1>
        </div>

        <div>
          {posts.map(post => (
            <Card className="m-3">
              <CardBody>
                <Link href={`/blog/${post.id}`}><a><h2>{post.title}</h2></a></Link>
                <h3>{post.date}</h3>
                <h3>{post.subtitle}</h3>
              </CardBody>
            </Card>
          ))}
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