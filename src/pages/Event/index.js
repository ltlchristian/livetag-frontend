import React from "react";
import { useParams } from "react-router-dom";
import EventEdit from "../../components/EventEdit";

import { Container, Row, Col } from "react-bootstrap";

function Event() {
  const { idEvent } = useParams();

  return (
    <Container>
      <Row className="justify-content-center mt-3">
        <Col sm>
          <EventEdit idEvent={idEvent} title="Modifier l'événement" />
        </Col>
      </Row>
    </Container>
  );
}

export default Event;
