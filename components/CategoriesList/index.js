/**
 * Category link listing
 * 
 * @param {*} param0 
 */
export default function Categories({ categories }) {
  return (
    <div className="flex flex-wrap">
      {categories.map(category => (
        <a key={category} className="mr-4 mt-2 bg-gray-200 rounded p-1 hover:bg-gray-300 hover:no-underline transition-colors" href={`/categories#${category}`}>
          <span className="text-black font-semibold">{category}</span>
        </a>
      ))}
    </div>
  );
}