import { Card, CardBody } from 'reactstrap';
import style from './style.module.css';

/**
 * Work experience timeline
 * 
 * @param {*} param0 
 */
export default function WorkTimeline({ items }) {
  return (
    <div className="my-5">
      {items.map(item => (
        <div id={`${item.company}-${item.dates}`} class={style['timeline-element']}>
          <span class={style['dot']}></span>
          <Card>
            <CardBody>
              <p>{item.dates}</p>
              <h2>{item.company}</h2>
              <h4><em>{item.position}</em></h4>
              <p className="mt-3">
                <ul>
                  {item.descriptionItems.map(descriptionItem => <li>{descriptionItem}</li>)}
                </ul>
              </p>
            </CardBody>
          </Card>
        </div>
      ))}
    </div>
  );
}