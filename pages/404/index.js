import Head from 'next/head';
import Link from 'next/link';

import Layout from '@components/Layout';
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

      <Layout>
        <div className="flex flex-col items-center justify-center text-xl">
          <h1 className="text-9xl font-bold">404</h1>
          <img className="w-96" src="/images/404.gif" />
          <p className="my-5">{`Page could not be found :<`}</p>
          <Link href="/"><a>Go Back Home</a></Link>
        </div>
      </Layout>
    </>
  );
}