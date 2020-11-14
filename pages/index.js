import fs from 'fs';
import Head from 'next/head';
import { Container, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faLaptop, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import ScrollAnimation from 'react-animate-on-scroll';

import PaginatedPosts from '@components/PaginatedPosts';
import WorkTimeline from '@components/WorkTimeline';
import ProjectsDisplay from '@components/ProjectsDisplay';
import config from '@lib/config';
import { getSortedPostsData } from '@lib/posts';
import { generateRSSFeed } from '@lib/rss';
import { linkItems, workItems, projectItems } from '@lib/content';
import style from '@styles/Home.module.css';
import LinksDisplay from '@components/LinksDisplay';


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

      <Container className="py-5">
        <Row>
          <Col md={{ size: 8, offset: 2 }}>
            <div className="mb-5">
              <div className="d-flex flex-column align-items-center my-3">
                <div className="animate__animated animate__flipInY" >
                  <img className={style['profile-img']} src="/images/me.jpg" />
                </div>
                <ScrollAnimation animateIn="animate__fadeIn" delay={500} animateOnce>
                  <h1 className={style['headline']}>Jason Maa</h1>
                  <h4 style={{ textAlign: 'center' }}>Student at the University of Maryland</h4>
                </ScrollAnimation>
              </div>
              <ScrollAnimation animateIn="animate__fadeIn" delay={600} animateOnce>
                <p style={{ textAlign: 'center' }}>
                  I am an undergraduate student at the University of Maryland studying computer science.
                  I primarily work on web and machine learning projects.
                  In my free time, I enjoy reading, taking hikes,
                  and doing language studies.
                 </p>
                <div className="my-3">
                  <LinksDisplay items={linkItems} />
                </div>
              </ScrollAnimation>
            </div>

            <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
              <div className="py-1">
                <h2 className="my-5"><FontAwesomeIcon className="mr-3" icon={faBriefcase} />Work Experience</h2>
                <WorkTimeline items={workItems} />
              </div>
            </ScrollAnimation>

            <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
              <div className="py-1">
                <h2 className="my-5"><FontAwesomeIcon className="mr-2" icon={faLaptop} />Projects</h2>
                <ProjectsDisplay items={projectItems} />
              </div>
            </ScrollAnimation>

            <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
              <div className="py-1">
                <h2 className="mt-5 mb-3"><FontAwesomeIcon className="mr-3" icon={faPencilAlt} />Blog Posts</h2>
                <PaginatedPosts posts={posts} />
              </div>
            </ScrollAnimation>
          </Col>
        </Row>
      </Container>
    </>
  )
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