import "./Participants.css";
import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import services from "../../services";

import ParticipantEdit from "../../components/ParticipantEdit";
import ParticipantsList from "../../components/ParticipantsList";

const Participants = () => {
  const [listParticipants, setListParticipants] = useState([]);
  const [showAddParticipant, setShowAddParticipant] = useState(false);

  function handleAddButton() {
    setShowAddParticipant((currentState) => !currentState);
  }

  function fecthAndSetListParticipant() {
    services
      .getParticipantByEvent(localStorage.getItem("idEvent"))
      .then((list) => {
        setListParticipants(list);
      })
      .catch((error) => {
        console.log("Error list participants", error);
        alert("La liste des participants ne peut être affichée");
      });
  }

  return (
    <Container className="m-4" fluid="xl">
      <hr />
      <Container>
        <Row className="justify-content-center">
          <Col sm>
            <Row className="justify-content-center">
              <Col sm>
                <h3 className="text-center">PARTICIPANTS</h3>
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
      {showAddParticipant && (
        <Container>
          <Row className="justify-content-center">
            <Col sm>
              <ParticipantEdit
                fecthAndSetListParticipant={fecthAndSetListParticipant}
                isCreate={true}
                title="Ajout d'un participant"
              />
            </Col>
          </Row>
        </Container>
      )}
      <hr />
      <Row className="justify-content-center mt-3">
        <Col sm>
          <ParticipantsList
            listParticipants={listParticipants}
            fecthAndSetListParticipant={fecthAndSetListParticipant}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Participants;
