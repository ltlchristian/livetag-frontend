import { Container, Row, Col, Button, Accordion } from "react-bootstrap";
import Role from "../Role";

export default function RolesList({ roles, fecthAndSetListRoles }) {
  return (
    <Row className="justify-content-center">
      {roles.map((role) => (
        <Role
          key={role._id}
          role={role}
          fecthAndSetListRoles={fecthAndSetListRoles}
        />
      ))}
    </Row>
  );
}
