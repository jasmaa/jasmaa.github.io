import { Card, CardBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faLink } from '@fortawesome/free-solid-svg-icons';

import style from './style.module.css';

/**
 * Display project items
 * 
 * @param {*} param0 
 */
export default function ProjectsDisplay({ items }) {
  return (
    <div className="my-5">
      {items.map(item => (
        <Card className={style['project-item']}>
          <CardBody>
            <div className={style['project-content']}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
            <div className="d-flex justify-content-end">
              {item.sourceURL
                ? <a className="ml-3" href={item.sourceURL}><FontAwesomeIcon icon={faCode} size="lg" /></a>
                : null}
              {item.siteURL
                ? <a className="ml-3" href={item.siteURL}><FontAwesomeIcon icon={faLink} size="lg" /></a>
                : null}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}