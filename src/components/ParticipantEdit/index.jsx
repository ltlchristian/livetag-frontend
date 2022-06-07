import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEvent } from "../../EventInUse";
import services from "../../services";
import Role from "../Role";
import "./ParticipantEdit.css";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function ParticipantEdit({
  idParticipant,
  fecthAndSetListParticipant,
  title,
  isCreate = false,
}) {
  // #region
  const { eventSelect } = useEvent();
  const [oneParticipant, setOneParticipant] = useState({
    event: { _id: eventSelect._id, event_name: "" },
    role: { _id: 0, role_name: "", activities: [], event: "" },
  });
  const [body, setBody] = useState({
    firstname: "",
    lastname: "",
    email: "",
    telephone: "",
    event: eventSelect._id,
    role: null,
    optional_activities: [],
  });
  const [roleList, setRoleList] = useState([]);
  const [role, setRole] = useState({ activities: [] });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function fecthAndSetListRoles(eventId) {
    services.getRoles(eventId).then((reponse) => {
      setRoleList(reponse);
    });
  }

  useEffect(() => {
    if (!isCreate) {
      services
        .getParticipantById(idParticipant)
        .then((reponse) => {
          setOneParticipant(reponse);

          // On recupère les id des activités en option du participant pour faire le check
          const tabActivitiesForCheck = reponse.optional_activities.map(
            (activity) => activity._id
          );

          //On recherche les activités en option pour le role du participant et on check avec ceux du participant
          services
            .getOptionalActivities(reponse.role._id)
            .then((activities) => {
              const newActivities = activities.map((activity) => {
                const foundIndex = tabActivitiesForCheck.indexOf(activity._id);
                if (foundIndex !== -1) {
                  activity.checked = true;
                } else {
                  activity.checked = false;
                }
                return activity;
              });

              //On met à jour le body avec tous les éléments concernés
              setBody({
                ...reponse,
                event: reponse.event._id,
                role: reponse.role._id,
                optional_activities: newActivities,
              });
            })
            .catch(console.log);

          //On positionne le role du participant
          services
            .getRole(reponse.role._id)
            .then((result) => {
              setRole(result);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(console.log);
    }
  }, []);

  useEffect(() => {
    fecthAndSetListRoles(localStorage.getItem("idEvent"));
  }, []);

  function updateBody(key, value) {
    setBody({ ...body, [key]: value });
  }
  function handleFormChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    // MET A JOUR LA LE COMPOSANT ROLE
    if (name === "role") {
      if (value !== "") {
        // VERIFIE SUR AUCUN ROLE N'EST SELECTIONNE
        services
          .getRole(value)
          .then((result) => {
            setRole(result);

            //On recherche les activités en options pour le role sélectionné
            services
              .getOptionalActivities(result._id)
              .then((activities) => {
                const newActivities = activities.map((activity) => {
                  activity.checked = false;
                  return activity;
                });

                //On positionne le role et les activités en option
                setBody({
                  ...body,
                  role: value,
                  optional_activities: newActivities,
                });
              })
              .catch(console.log);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setBody({
          ...body,
          role: value,
          optional_activities: [],
        });
        setRole({ activities: [] });
      }
    } else if (!name.startsWith("activity")) {
      // Cas autre que role et case à cocher pour les activités en option
      updateBody(name, value);
    } else {
      // Cas des cases à cocher
      const newActivities = body.optional_activities.map((activity) => {
        if (activity._id === value) {
          activity.checked = !activity.checked;
        }
        return activity;
      });
      setBody({ ...body, optional_activities: newActivities });
    }
  }

  function genereBodyToPost(curentBody) {
    const {
      firstname,
      lastname,
      email,
      telephone,
      event,
      role,
      optional_activities,
    } = curentBody;

    const updatedOptionalActivities = optional_activities
      .filter((activity) => activity.checked)
      .map((activity) => activity._id);

    const bodyToPost = {
      firstname,
      lastname,
      email,
      telephone,
      optional_activities: updatedOptionalActivities,
      event,
      role,
    };

    return bodyToPost;
  }

  function handleCreate(evt) {
    evt.preventDefault();
    const bodyTocreate = genereBodyToPost(body);

    services.createParticipant(bodyTocreate).then(() => {
      setBody({
        firstname: "",
        lastname: "",
        email: "",
        telephone: "",
        event: eventSelect._id,
        role: null,
        optional_activities: [],
      });
      setRole({ activities: [] });

      fecthAndSetListParticipant();
      evt.target.reset();
    });
  }

  function handleUpdate(evt) {
    evt.preventDefault();
    const bodyToUpdate = genereBodyToPost(body);

    services.updateParticipant(idParticipant, bodyToUpdate).then(() => {
      setOpen(true);
    });
  }
  // #endregion
  return (
    <Card className="m-1 mb-2">
      <Card.Header as="h5" className="card-bg-color text-center">
        {title}
      </Card.Header>
      <Card.Body>
        <Form onSubmit={isCreate ? handleCreate : handleUpdate}>
          <Container>
            <Row>
              <Col sm>
                <Form.Group className="mb-2" controlId="formFirstname">
                  <Form.Label>Prénom</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Prénom"
                    name="firstname"
                    value={body.firstname}
                    onChange={handleFormChange}
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
                    value={body.lastname}
                    onChange={handleFormChange}
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
                    value={body.email}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col sm>
                <Form.Group className="mb-3" controlId="formTelephone">
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Téléphone"
                    name="telephone"
                    value={body.telephone}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={7}>
                <Form.Group className="mb-3" controlId="formEvenemt">
                  <Form.Label>Rôle</Form.Label>
                  <Form.Control
                    as="select"
                    name="role"
                    required
                    onChange={handleFormChange}
                  >
                    {isCreate && <option value="">Rôle</option>}
                    {roleList.map((role) => (
                      <option
                        key={role._id}
                        selected={role._id === oneParticipant.role._id}
                        value={role._id}
                      >
                        {role.role_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                {body.optional_activities.length > 0 && (
                  <Row>
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
                            label={`${activity.activity_name}`}
                            onChange={handleFormChange}
                          />
                        ))}
                      </Form.Group>
                    </Col>
                  </Row>
                )}
              </Col>

              <Col>
                <Role key={role._id} role={role} isFromParticipant={true} />
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
                      onClick={() => navigate(`/participants`)}
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
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
      >
        <Alert variant="filled" severity="success">
          Modification prise en compte
        </Alert>
      </Snackbar>
    </Card>
  );
}

export default ParticipantEdit;
