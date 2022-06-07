import { useState } from "react";
import { Button, Container, Form, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEvent } from "../../EventInUse";
import services from "../../services";

import "./ActivityAdd.css";

function ActivityAdd({ fecthAndSetListActivities }) {
  const { eventSelect } = useEvent();
  const [body, setBody] = useState({
    activity_name: "",
    activity_date: "",
    description: "",
    price: "",
    event: eventSelect._id,
  });
  function updateBody(key, value) {
    // Il faut toujours faire une copie du state qu'on veut modifier si c'est un objet
    // objet = {  } ou [ ]
    setBody({ ...body, [key]: value });
  }

  function handleFormChange(event) {
    const name = event.target.name; // activity_name
    const value = event.target.value;

    updateBody(name, value);
  }

  function handleSubmitAddActivity(event) {
    event.preventDefault();
    services
      .addActivity(body)
      .then(() => {
        fecthAndSetListActivities();
        setBody({
          activity_name: "",
          activity_date: "",
          description: "",
          price: "",
          event: eventSelect._id,
        });
      })
      .catch(() => alert("Une erreur a eu lieu pendant l'ajout"));
  }

  return (
    <Card className="m-1 mb-2">
      <Card.Header as="h5" className="card-bg-color text-center">
        Ajout d'une activité
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmitAddActivity}>
          <Container>
            <Row>
              <Col sm>
                <Form.Group className="mb-3" controlId="activity_name">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nom de l'activité"
                    name="activity_name"
                    value={body.activity_name}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3" controlId="activity_date">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="activity_date"
                    value={body.activity_date}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>Prix</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="prix"
                    name="price"
                    value={body.price}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="description de l'activité"
                    name="description"
                    value={body.description}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm className="text-center">
                <Button variant="success" type="submit" className="mt-3">
                  Enregistrer
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ActivityAdd;
