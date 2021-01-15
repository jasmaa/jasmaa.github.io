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
          <div className="md:w-3/4 pb-10">
            <span className={style['dot']}></span>
            <p className="text-xl">{item.dates}</p>
            <h3 className="text-3xl">{item.position}</h3>
            <h3 className="text-2xl mt-1"><em>{item.company}</em></h3>
            <div className="mt-5 ml-5">
              <ul className="text-gray-500 text-xl list-inside list-disc">
                {item.descriptionItems.map((descriptionItem, i) => (
                  <li className="mb-3" key={`${item.company}-${item.dates}${i}`}>
                    {descriptionItem}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}