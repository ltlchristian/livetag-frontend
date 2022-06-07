import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Form, Card, Row, Col } from "react-bootstrap";
import services from "../../services";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./EditRole.css";
import { useEvent } from "../../EventInUse";
export default function EditRole() {
  const { eventSelect } = useEvent();
  const [body, setBody] = useState({
    role_name: "",
    activities: [],
    event: "",
  });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  let { idRole } = useParams();

  function updateBody(key, value) {
    setBody({ ...body, [key]: value });
  }

  function handleFormChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    if (!name.startsWith("activity")) {
      updateBody(name, value);
    } else {
      const newActivities = body.activities.map((activity) => {
        if (activity._id === value) {
          activity.checked = !activity.checked;
        }
        return activity;
      });

      setBody({ ...body, activities: newActivities });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const { activities } = body;

    const updatedActivities = activities
      .filter((activity) => activity.checked)
      .map((activity) => activity._id);

    const updatedRole = {
      role_name: body.role_name,
      activities: updatedActivities,
      event: body.event,
    };

    services
      .updateRole(idRole, updatedRole)
      .then(() => setOpen(true))
      .catch(() => alert("Une erreur pendant la mise à jour d'un role"));
  }

  /* Effet de bord au premier rendu du composant */
  useEffect(() => {
    Promise.all([
      services.getActivities(eventSelect._id),
      services.getRole(idRole),
    ])
      .then((values) => {
        const dbActivities = values[0];
        const dbRole = values[1];

        // Traitement pour initialiser le body avec le role récupéré en base
        const tabActivitiesForCheck = dbRole.activities.map(
          (activity) => activity._id
        );

        const newActivities = dbActivities.map((activity) => {
          const foundIndex = tabActivitiesForCheck.indexOf(activity._id);
          if (foundIndex !== -1) {
            activity.checked = true;
          } else {
            activity.checked = false;
          }
          return activity;
        });

        setBody({
          ...body,
          activities: newActivities,
          role_name: dbRole.role_name,
          event: dbRole.event,
        });
      })
      .catch((reason) => {
        console.log(reason);
      });
  }, []);

  return (
    <Container>
      <Row className="justify-content-center mt-3">
        <Col sm>
          <Card className="m-1 mb-2">
            <Card.Header as="h5" className="card-bg-color text-center">
              Modifier le rôle
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Container>
                  <Row>
                    <Col sm>
                      <Form.Group className="mb-3" controlId="role_name">
                        <Form.Label>Nom du role</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nom du role"
                          name="role_name"
                          value={body.role_name}
                          onChange={handleFormChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3" controlId="activities">
                        <Form.Label>Activités utilisées</Form.Label>
                        {body.activities.map((activity) => (
                          <Form.Check
                            key={activity._id}
                            type="checkbox"
                            id={activity._id}
                            value={activity._id}
                            checked={activity.checked}
                            name={`activity${activity._id}`}
                            label={activity.activity_name}
                            onChange={handleFormChange}
                          />
                        ))}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm className="text-center">
                      <Button variant="warning" type="submit" className="mt-3">
                        Modifier
                      </Button>
                    </Col>
                  </Row>

                  <Row>
                    <Col className="text-center">
                      <Button
                        variant="dark"
                        className="mt-3"
                        onClick={() => navigate("/roles")}
                      >
                        retour
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
      >
        <Alert variant="filled" severity="success">
          rôle modifié
        </Alert>
      </Snackbar>
    </Container>
  );
}
