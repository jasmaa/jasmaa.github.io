import { Badge } from "reactstrap";

export default function Categories({ categories }) {
  return (
    <div>
      {categories.map(category => (
        <Badge key={category} className="mr-1" href={`/category#${category}`} color="light">
          <span style={{ fontSize: '1rem' }}>{category}</span>
        </Badge>
      ))}
    </div>
  );
}