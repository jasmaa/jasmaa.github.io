import Head from 'next/head';
import Link from 'next/link';

import config from '@lib/config';

/**
 * 404 page
 */
export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found - {config.siteName}</title>
      </Head>

      <div className="md:container md:mx-auto py-5">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-9xl font-bold">404</h1>
          <img className="w-96" src="/images/404.gif" />
          <p>{`Page could not be found :<`}</p>
          <Link href="/"><a>Go Back Home</a></Link>
        </div>
      </div>
    </>
  );
}