import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

import dayjs from "dayjs";
import ReactToPrint from 'react-to-print';
import QRCode from "qrcode";

import services from "../../services";
import "./Inscription.css";

function Inscription() {
  const [body, setBody] = useState({
    firstname: "",
    lastname: "",
    email: "",
    telephone: "",
    event: null,
    role: null,
    optional_activities: [{}],
  });
  const [role, setRole] = useState({
    event: {},
    role: {},
  });
  const [confirm, setConfirm] = useState(false);
  const [participant, setParticipant] = useState({
    event: {},
    role: {},
  });
  const [url, setUrl] = useState("");

  const navigate = useNavigate();
  const componentRef = useRef(null);
  let { idLink } = useParams();

  /* Effet de bord au premier rendu du composant */
  useEffect(() => {
    services
      .searchRoleByLink(idLink)
      .then((response) => {
        console.log(response);
        setRole(response);

        services.getOptionalActivities(response._id)
        .then((activities) => {
          console.log(activities);

          const newActivities = activities.map((activity) => {
            activity.checked = false;
            return activity;
          });
  
          setBody({
            ...body,
            optional_activities: newActivities,
          });
        })
        .catch(console.log);
        
      })
      .catch(console.log);
  }, []);

  function updateBody(key, value) {
    setBody({ ...body, [key]: value });
  }

  function handleFormChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    if (!name.startsWith("activity")) {
      updateBody(name, value);
    } else {
      const newOptionalActivities = body.optional_activities.map((activity) => {
        if (activity._id === value) {
          activity.checked = !activity.checked;
        }
        return activity;
      });
      setBody({ ...body, optional_activities: newOptionalActivities });
    }
  }

  function generateQRCode(id) {
    QRCode.toDataURL(JSON.stringify(id), {width: 300, errorCorrectionLevel: "H"})
    .then((url) => {
      setUrl(url);
    })
    .catch((err) => {
      console.error(err);
    });
}

  function handleCreate(event) {
    event.preventDefault();
    console.log("handleCreate");

    const { optional_activities } = body;

    const updatedOptionalActivities = optional_activities
      .filter((activity) => activity.checked)
      .map((activity) => activity._id);

    const inscriptionBody = { ...body, optional_activities: updatedOptionalActivities }
    console.log(inscriptionBody);
    services
      .createInscriptionFromLink(idLink, inscriptionBody)
      .then((response) => {
        console.log(response);
        generateQRCode(response._id);
        setParticipant(response);
        setConfirm(true);
      })
      .catch(() => alert("Une erreur pendant l'inscription d'un participant"));
  }

  // #endregion
  return !confirm ? (
    <Card className="m-1 mb-2">
      <Card.Header as="h5" className="card-bg-color text-center">
        INSCRIPTION: {role.role_name}, {role.event.event_name} à {role.event.place} du {dayjs(role.event.start_date).format('DD/MM/YYYY')} au {dayjs(role.event.end_date).format('DD/MM/YYYY')}
      </Card.Header>
      <Card.Body>
      <Form onSubmit={handleCreate} onChange={handleFormChange}>
          <Container>
            <Row>
              <Col sm>
                <Form.Group className="mb-2" controlId="formFirstname">
                  <Form.Label>Prénom</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Prénom"
                    name="firstname"
                    required
                  />
                </Form.Group>
              </Col>
              <Col sm>
                <Form.Group className="mb-2" controlId="formLastname">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nom"
                    name="lastname"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                    required
                  />
                </Form.Group>
              </Col>
              <Col sm>
                <Form.Group className="mb-3" controlId="formTelephone">
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Téléphone"
                    name="telephone"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            { (body.optional_activities.length > 0) && <Row>
              <Col sm>
                <Form.Group className="mb-3" controlId="activities">
                  <Form.Label>Activités accessibles hors-rôle</Form.Label>
                  {body.optional_activities.map((activity, index) => (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      id={activity._id}
                      value={activity._id}
                      checked={activity.checked}
                      name={`activity${activity._id}`}
                      label={`${activity.activity_name} à ${activity.price} €`}
                    />
                  ))}
                </Form.Group>
              </Col>
            </Row>}

            <Row>
              <Col sm className="text-center">
                <Button
                  variant="success"
                  type="submit"
                  className="mt-3"
                >
                  Enregistrer
                </Button>
              </Col>
            </Row>

          </Container>
        </Form>
      </Card.Body>
    </Card>
  ) : (
    <Card className="m-1 mb-2">
      <Card.Header as="h5" className="card-bg-color text-center">
        CONFIRMATION: {role.role_name}, {role.event.event_name} à {role.event.place} du {dayjs(role.event.start_date).format('DD/MM/YYYY')} au {dayjs(role.event.end_date).format('DD/MM/YYYY')}
      </Card.Header>
      <Card.Body ref={componentRef}>
        <Container>
          <Row>
          <Card.Text>
            {participant.lastname} {participant.firstname}, email: {participant.email}, tel: {participant.telephone}
            </Card.Text>
            <Card.Text>
            <img src={url} alt="" />
            </Card.Text>
          </Row>
          <Row>
            <ReactToPrint
            trigger={() => <Button variant="outline-info">Imprimer</Button>}
            content={() => componentRef.current}
            />
            <Button onClick={() => navigate(`/`)} variant="outline-dark">Accueil du site</Button>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  )
}

export default Inscription;
