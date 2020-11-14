import { Row, Col, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Links display
 * 
 * @param {*} param0 
 */
export default function LinksDisplay({ items }) {
  return (
    <Row>
      {items.map(item => (
        <Col key={item.name} className="d-flex justify-content-center">
          <h4>
            <Badge color="warning" href={item.url}>
              <FontAwesomeIcon icon={item.icon} /> {item.name}
            </Badge>
          </h4>
        </Col>
      ))}
    </Row>
  );
}