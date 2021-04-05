import Link from 'next/link';

import { socialMediaItems } from '@lib/content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Footer
 * 
 * @param {*} param0 
 */
export default function Footer() {
  return (
    <div className="flex justify-center">
      {socialMediaItems.map(item => (
        <Link
          key={item.name}
          href={item.url}
        >
          <a
            className="text-2xl mx-3"
          ><FontAwesomeIcon icon={item.icon} /></a>
        </Link>
      ))}
    </div>
  );
}