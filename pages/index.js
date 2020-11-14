import Head from 'next/head';
import Link from 'next/link';
import { Container, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faEnvelope, faLaptop, faNetworkWired, faPencilAlt, faRss } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

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
          <Col md={{ size: 8, offset: 2 }}>
            <div className="mb-5">
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
            </div>

            <div className="mb-5">
              <h2 className="mb-3"><FontAwesomeIcon className="mr-2" icon={faNetworkWired} /> Links and Contact</h2>
              <ul>
                <li><a href="mailto:jasonmaa3955@gmail.com"><FontAwesomeIcon icon={faEnvelope} /> Email</a></li>
                <li><a href="https://linkedin.com/in/jasmaa"><FontAwesomeIcon icon={faLinkedin} /> LinkedIn</a></li>
                <li><a href="https://github.com/jasmaa"><FontAwesomeIcon icon={faGithub} /> GitHub</a></li>
                <li><a href="#"><FontAwesomeIcon icon={faRss} /> RSS</a></li>
              </ul>
            </div>

            <div className="mb-5">
              <h2 className="mb-3"><FontAwesomeIcon className="mr-2" icon={faBriefcase} />Work</h2>
            </div>

            <div className="mb-5">
              <h2 className="mb-3"><FontAwesomeIcon className="mr-2" icon={faLaptop} />Projects</h2>
            </div>

            <div className="mb-5">
              <h2 className="mb-3"><FontAwesomeIcon className="mr-2" icon={faPencilAlt} />Blog Posts</h2>
              <PostPagination posts={posts} />
            </div>
          </Col>
        </Row>
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