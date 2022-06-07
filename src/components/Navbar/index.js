import { Link } from "react-router-dom";
import { Alert, Container, Row, Col, Badge, NavLink } from "react-bootstrap";
import { useAuth } from "../../AuthProvider";
import { useEvent } from "../../EventInUse";
import NavBarLogMenu from "../NavBarLogMenu";
import "./Navbar.css";

export default function NavBar() {
  const { connected, disconnect } = useAuth();
  const { eventChoice, eventSelect } = useEvent();

  return (
    <Container fluid="xl" className="p-1 navbar-perso">
      <Row className="align-items-middle justify-content-center">
        <Col className="text-left">
          <div className="logo-navbar " />
        </Col>
        {connected && !eventChoice && (
          <Col className="nav-links text-center">
            <Link className="project-link" to="/events">
              Evénements
            </Link>
          </Col>
        )}
        {connected && eventChoice && (
          <Col className="text-center p-3">
            <div className="titre-evenement">
              <Link className="project-link-evenement-select" to="/events">
                <span className="text-secondary">Evénement sélectionné : </span>
                {eventSelect.event_name}
              </Link>
            </div>
          </Col>
        )}
        <Col className="nav-links text-right">
          <NavBarLogMenu />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={3}>
          {connected && eventChoice && (
            <div className="titre-sous-menu">
              <Container className="p-0">
                <Row className="align-items-middle justify-content-center">
                  <Col className="text-center " md="auto">
                    <Link
                      className="project-link-second text-center"
                      to="/activities"
                    >
                      Activités
                    </Link>
                  </Col>
                  <Col className="text-center " md="auto">
                    <Link
                      className="project-link-second text-center"
                      to="/roles"
                    >
                      Rôles
                    </Link>
                  </Col>
                  <Col className="text-center " md="auto">
                    <Link
                      className="project-link-second text-center"
                      to="/participants"
                    >
                      Participants
                    </Link>
                  </Col>
                </Row>
              </Container>{" "}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
