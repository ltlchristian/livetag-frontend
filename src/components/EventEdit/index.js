import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import services from "../../services";
import dayjs from "dayjs";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import "./EventEdit.css";

function EventEdit({
  idEvent,
  currentUser,
  title,
  fecthAndSetListEvent,
  isCreate = false,
}) {
  const [body, setBody] = useState({
    event_name: "",
    start_date: "",
    end_date: "",
    place: "",
    description: "",
    code: "",
  });
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCreate) {
      services
        .getEventById(idEvent)
        .then((response) => {
          setBody(response);
        })
        .catch((error) => console.log(error));
    }
  }, [idEvent, isCreate]);

  function updateBody(key, value) {
    // Il faut toujours faire une copie du state qu'on veut modifier si c'est un objet
    // objet = {  } ou [ ]
    setBody({ ...body, [key]: value });
  }

  function handleFormChange(event) {
    const name = event.target.name; // event_name
    const value = event.target.value; // Course a pied

    if(name === "end_date") {
      if (body.start_date) {
        const date_deb = new Date(body.start_date);
        const date_fin = new Date(value);
        if (dayjs(date_fin).isBefore(date_deb)) {
          setMessage({
            severity: "warning",
            content: "La date de fin ne peut pas être inférieure à la date de debut"
          });
          setOpen(true);
        } else {
          updateBody(name, value);
        }
      } else {
        updateBody(name, value);
      }
    } else if(name === "start_date") {
      if (body.end_date) {
        const date_deb = new Date(value);
        const date_fin = new Date(body.end_date);
        if (dayjs(date_deb).isAfter(date_fin)) {
          setMessage({
            severity: "warning",
            content: "La date de début ne peut pas être supérieure à la date de fin"
          });
          setOpen(true);
        } else {
          updateBody(name, value);
        }
      } else {
        updateBody(name, value);
      }
    } else {
      updateBody(name, value);
    }
  }

  function handleSubmitAddEvent(event) {
    event.preventDefault();
    services
      .addEvents(body)
      .then((result) => {
        setBody({
          event_name: "",
          start_date: "",
          end_date: "",
          place: "",
          description: "",
          code: "",
        });

        fecthAndSetListEvent(currentUser._id);
      })
      .catch(() => alert("Une erreur a eu lieu pendant l'ajout"));
  }

  function handleSubmitUpdateEvent(event) {
    event.preventDefault();
    services
      .updateEvent(idEvent, body)
      .then(() => {
        setMessage({
          severity: "success",
          content: "Evennement mis à jour"
        });
        setOpen(true);
      })
      .catch(() => alert("Une erreur a eu lieu pendant la modification"));
  }

  return (
    <Card className="m-1 mb-2">
      <Card.Header as="h5" className="card-bg-color text-center">
        {title}
      </Card.Header>
      <Card.Body>
        <Form
          onSubmit={isCreate ? handleSubmitAddEvent : handleSubmitUpdateEvent}
        >
          <Container>
            <Row>
              <Col sm>
                <Form.Group className="mb-3" controlId="event_name">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nom de l'évènnement"
                    name="event_name"
                    value={body.event_name}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="place">
                  <Form.Label>Lieu</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Lieu de l'évènnement"
                    name="place"
                    value={body.place}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm>
                <Form.Group className="mb-3" controlId="start_date">
                  <Form.Label>Date de début</Form.Label>
                  <Form.Control
                    type="date"
                    name="start_date"
                    value={dayjs(body.start_date).format("YYYY-MM-DD")}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="end_date">
                  <Form.Label>Date de fin</Form.Label>
                  <Form.Control
                    type="date"
                    name="end_date"
                    value={dayjs(body.end_date).format("YYYY-MM-DD")}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm>
                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Description"
                    name="description"
                    value={body.description}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {isCreate && (
              <Row>
                <Col sm className="text-center">
                  <Button variant="success" type="submit" className="mt-3">
                    Enregistrer
                  </Button>
                </Col>
              </Row>
            )}
            {!isCreate && (
              <Container>
                <Row>
                  <Col className="text-center">
                    <Button variant="warning" type="submit" className="mt-3">
                      MODIFIER
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col className="text-center">
                    <Button
                      variant="dark"
                      className="mt-3"
                      onClick={() => navigate(`/events`)}
                    >
                      retour
                    </Button>
                  </Col>
                </Row>
              </Container>
            )}
          </Container>
        </Form>
      </Card.Body>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert variant="filled" severity={message.severity}>
          {message.content}
        </Alert>
      </Snackbar>      
    </Card>
  );
}

export default EventEdit;
