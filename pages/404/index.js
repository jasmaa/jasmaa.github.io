import Head from 'next/head';
import Link from 'next/link';
import { Container } from 'reactstrap';

import config from '@lib/config';
import style from './style.module.css';

/**
 * 404 page
 */
export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found - {config.siteName}</title>
      </Head>

      <Container className="py-5">
        <div className="d-flex flex-column align-items-center justify-content-center">
          <h1 className={style['headline']}>404</h1>
          <img className={style['not-found-img']} src="images/404.gif" />
          <p>{`Page could not be found :<`}</p>
          <Link href="/"><a>Go Back Home</a></Link>
        </div>
      </Container>
    </>
  );
}