import { useParams } from "react-router-dom";

import ParticipantEdit from "../../components/ParticipantEdit";

import { Container, Row, Col } from "react-bootstrap";

const Participant = () => {
  const { idParticipant } = useParams();

  return (
    <Container>
      <Row className="justify-content-center mt-3">
        <Col sm>
          <ParticipantEdit
            idParticipant={idParticipant}
            title="Modifier le participant"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Participant;
