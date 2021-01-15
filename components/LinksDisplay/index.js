import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Links display
 * 
 * @param {*} param0 
 */
export default function LinksDisplay({ items }) {
  return (
    <div className="flex md:justify-center flex-col md:flex-row">
      {items.map(item => (
        <a
          key={item.name}
          className="flex justify-center items-center text-xl m-4 px-3 bg-yellow-400 hover:bg-yellow-500 rounded text-black hover:no-underline hover:text-black"
          href={item.url}
        >
          <FontAwesomeIcon className="mr-1" icon={item.icon} /> {item.name}
        </a>
      ))}
    </div>
  );
}