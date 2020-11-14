import { Badge } from "reactstrap";

/**
 * Category link listing
 * 
 * @param {*} param0 
 */
export default function Categories({ categories }) {
  return (
    <div>
      {categories.map(category => (
        <Badge key={category} className="mr-1" href={`/categories#${category}`} color="light">
          <span style={{ fontSize: '1rem' }}>{category}</span>
        </Badge>
      ))}
    </div>
  );
}