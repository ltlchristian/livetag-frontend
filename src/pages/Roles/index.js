import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import services from "../../services";
import RolesList from "../../components/RolesList";
import CreateRole from "../RoleAdd";

import "./Roles.css";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [showAddRole, setShowAddRole] = useState(false);

  function handleAddButton() {
    setShowAddRole((currentState) => !currentState);
  }

  const search = () => {
    services
      .getRoles(localStorage.getItem("idEvent"))
      .then((result) => {
        setRoles(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <Container className="m-4" fluid="xl">
      <hr />
      <Container>
        <Row className="justify-content-center">
          <Col sm>
            <Row className="justify-content-center">
              <Col sm>
                <h3 className="text-center">ROLES</h3>
              </Col>
              <Col sm className="text-center">
                <Button
                  onClick={handleAddButton}
                  className="btn-success btn-xs"
                >
                  +
                </Button>
              </Col>
            </Row>
          </Col>{" "}
        </Row>
      </Container>
      {showAddRole && (
        <Container>
          <Row className="justify-content-center">
            <Col sm>
              <CreateRole fecthAndSetListRoles={search} />
            </Col>
          </Row>
        </Container>
      )}
      <hr />
      <RolesList roles={roles} fecthAndSetListRoles={search} />
    </Container>
  );
};

export default Roles;
