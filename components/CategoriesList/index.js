/**
 * Category link listing
 * 
 * @param {*} param0 
 */
export default function Categories({ categories }) {
  return (
    <div className="flex">
      {categories.map(category => (
        <a key={category} className="mr-1 bg-gray-200 rounded px-1 hover:bg-gray-300 hover:no-underline" href={`/categories#${category}`}>
          <span className="text-black font-semibold">{category}</span>
        </a>
      ))}
    </div>
  );
}