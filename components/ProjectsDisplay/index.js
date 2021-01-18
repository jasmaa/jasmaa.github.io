import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faLink } from '@fortawesome/free-solid-svg-icons';

/**
 * Display project items
 * 
 * @param {*} param0 
 */
export default function ProjectsDisplay({ items }) {
  return (
    <div className="grid lg:grid-cols-2 gap-10 grid-cols-flow my-5">
      {items.map(item => (
        <div key={item.name} className="flex flex-col rounded shadow-xl bg-gray-200 my-5">
          <img className="w-full" src={item.imageURL} />
          <div className="h-full flex flex-col justify-between p-5">
            <div>
              <h3 className="text-3xl">{item.name}</h3>
              <p className="py-4">{item.description}</p>
            </div>
            <div className="flex justify-end mt-5">
              {item.sourceURL
                ? <a className="ml-3" href={item.sourceURL}><FontAwesomeIcon icon={faCode} size="lg" /></a>
                : null}
              {item.siteURL
                ? <a className="ml-3" href={item.siteURL}><FontAwesomeIcon icon={faLink} size="lg" /></a>
                : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}