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
        <div key={`${item.company}-${item.dates}`} className={style['timeline-element']}>
          <span className={style['dot']}></span>
          <p>{item.dates}</p>
          <h2>{item.company}</h2>
          <h4><em>{item.position}</em></h4>
          <div className="mt-3">
            <ul>
              {item.descriptionItems.map((descriptionItem, i) => (
                <li key={`${item.company}-${item.dates}${i}`}>
                  {descriptionItem}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}