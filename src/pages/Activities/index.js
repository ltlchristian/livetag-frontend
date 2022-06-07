import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import services from "../../services";

import ActivityAdd from "../../components/ActivityAdd";
import ActivitiesList from "../../components/ActivitiesList";

import "./Activities.css";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [showAddActivite, setShowAddActivite] = useState(false);

  function handleAddButton() {
    setShowAddActivite((currentState) => !currentState);
  }

  const search = () => {
    services
      .getActivities(localStorage.getItem("idEvent"))
      .then((result) => {
        setActivities(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container className="m-4" fluid="xl">
      <hr />
      <Container>
        <Row className="justify-content-center">
          <Col sm>
            <Row className="justify-content-center">
              <Col sm>
                <h3 className="text-center">ACTIVITES</h3>
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
      {showAddActivite && (
        <Container>
          <Row className="justify-content-center">
            <Col sm>
              <ActivityAdd fecthAndSetListActivities={search} />
            </Col>
          </Row>
        </Container>
      )}
      <hr />
      <Row className="justify-content-center mt-3">
        <Col>
          <ActivitiesList
            activities={activities}
            fecthAndSetListActivities={search}
          />
        </Col>
      </Row>
    </Container>
  );
}
