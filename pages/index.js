import Head from 'next/head';
import { Container, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faLaptop } from '@fortawesome/free-solid-svg-icons';
import ScrollAnimation from 'react-animate-on-scroll';

import WorkTimeline from '@components/WorkTimeline';
import ProjectsDisplay from '@components/ProjectsDisplay';
import DrawerContainer from '@components/DrawerContainer';
import config from '@lib/config';
import { linkItems, workItems, projectItems } from '@lib/content';
import style from '@styles/Home.module.css';
import LinksDisplay from '@components/LinksDisplay';


/**
 * Home page
 * 
 * @param {*} param0 
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>Home - {config.siteName}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={config.siteDescription} />
      </Head>

      <DrawerContainer>
        <Container className="py-5">
          <Row>
            <Col md={{ size: 8, offset: 2 }}>
              <div className="mb-5">
                <div className="d-flex flex-column align-items-center my-3">
                  <div className="animate__animated animate__flipInY" >
                    <img className={style['profile-img']} src="/images/me.jpg" />
                  </div>
                  <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
                    <h1 className={style['headline']}>Jason Maa</h1>
                    <h4 style={{ textAlign: 'center' }}>Student at the University of Maryland</h4>
                  </ScrollAnimation>
                </div>
                <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
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
            </Col>
          </Row>
        </Container>
      </DrawerContainer>
    </>
  )
}