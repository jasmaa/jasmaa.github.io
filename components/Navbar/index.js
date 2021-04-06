import Link from 'next/link';

import { linkItems } from '@lib/content';

/**
 * Main navbar
 * 
 * @param {*} param0 
 */
export default function Navbar() {
  return (
    <div className="flex md:justify-center flex-col md:flex-row">
      {linkItems.map(item => (
        <Link
          key={item.name}
          href={item.url}
        >
          <a
            className="flex justify-center items-center text-2xl m-4 px-3 text-yellow-500 hover:text-yellow-600 hover:no-underline"
          >{item.name}</a>
        </Link>
      ))}
    </div>
  );
}