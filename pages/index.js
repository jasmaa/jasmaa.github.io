import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faLaptop } from '@fortawesome/free-solid-svg-icons';
import ScrollAnimation from 'react-animate-on-scroll';

import Layout from '@components/Layout';
import WorkTimeline from '@components/WorkTimeline';
import ProjectsDisplay from '@components/ProjectsDisplay';
import DrawerContainer from '@components/DrawerContainer';
import config from '@lib/config';
import { linkItems, workItems, projectItems } from '@lib/content';
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
        <Layout>
          <div className="mb-5">
            <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
              <div className="flex flex-col items-center my-3">
                <img className="w-96 rounded-full shadow-xl" src="/images/me.jpg" />
                <h1 className="text-7xl font-semibold mt-5">Jason Maa</h1>
                <h4 className="text-3xl text-center mt-5">Student at the University of Maryland</h4>
                <p className="text-xl text-center py-5 md:w-2/3">
                  I am an undergraduate student at the University of Maryland studying computer science.
                  I primarily work on web and machine learning projects.
                  In my free time, I enjoy reading, taking hikes,
                  and doing language studies.
                </p>
              </div>
              <LinksDisplay items={linkItems} />
            </ScrollAnimation>
          </div>

          <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
            <div className="border-t-2 mt-8 pt-5">
              <h2 className="my-5"><FontAwesomeIcon className="mr-3" icon={faBriefcase} />Work Experience</h2>
              <WorkTimeline items={workItems} />
            </div>
          </ScrollAnimation>

          <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
            <div className="border-t-2 mt-8 pt-5">
              <h2 className="my-5"><FontAwesomeIcon className="mr-2" icon={faLaptop} />Projects</h2>
              <ProjectsDisplay items={projectItems} />
            </div>
          </ScrollAnimation>
        </Layout>
      </DrawerContainer>
    </>
  )
}