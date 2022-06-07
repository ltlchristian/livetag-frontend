import { useEffect, useState } from "react";
import services from "../../services";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function Profil() {
  const [currentUser, setCurrentUser] = useState({});

  const [body, setBody] = useState({
    organisation: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({});

  function fetchAndSetCurrentUser() {
    services
      .getCurrentUser()
      .then((user) => {
        setCurrentUser(user);
        setBody({
          ...user,
          password: "",
          confirmPassword: "",
        });
      })
      .catch(() => alert("erreur"));
  }

  function updateBody(key, value) {
    // Il faut toujours faire une copie du state qu'on veut modifier si c'est un objet
    // objet = {  } ou [ ]
    setBody({ ...body, [key]: value });
  }

  function handleFormChange(event) {
    const name = event.target.name; // email
    const value = event.target.value; // toto@toto.com
    updateBody(name, value);
  }

  function handleSubmitUpdateProfil(event) {
    event.preventDefault();
    services
      .putUserData(body)
      .then((result) => {
        setMessage({
          severity: "success",
          content: "Profil mis à jour"
        });
        setOpen(true);
      })
      .catch(() =>
        alert("Une erreur a eu lieu pendant la modification de vos données")
      );
  }
  function handleSubmitUpdatePassword(event) {
    event.preventDefault();
    services
      .putUserPassword(body)
      .then(() => {
        setMessage({
          severity: "success",
          content: "Mot de passe mis à jour"
        });
        setOpen(true);        
        fetchAndSetCurrentUser("")
      })
      .catch(() =>
        alert(
          "Une erreur a eu lieu pendant la modification de votre mot de passe"
        )
      );
  }

  useEffect(() => {
    fetchAndSetCurrentUser();
  }, []);

  return (
    <Container className="m-4" fluid="xl">
      <hr />
      <Container>
        <Row className="justify-content-center">
          <Col sm>
            <h3 className="text-center">MON PROFIL</h3>
          </Col>
        </Row>
      </Container>
      <hr />
      <Container>
        <Container>
          <Form onSubmit={handleSubmitUpdateProfil}>
            <Row className="justify-content-center">
              <Col md="auto">
                <Form.Group controlId="organisation">
                  <Form.Label>Organisation</Form.Label>
                  <Form.Control
                    type="text"
                    name="organisation"
                    value={body.organisation}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md="auto">
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={body.email}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center m-3">
              <Col className="text-center" md="auto">
                <Button variant="warning" type="submit">
                  Modifier
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>

        <Container className="mt-5">
          <Form onSubmit={handleSubmitUpdatePassword}>
            <Row className="justify-content-center">
              <Col md="auto">
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={body.password}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md="auto">
                <Form.Group controlId="confirmPassword">
                  <Form.Label>ConfirmPassword</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={body.confirmPassword}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="justify-content-center m-3">
              <Col className="text-center" md="auto">
                <Button variant="warning" type="submit">
                  Modifier
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </Container>
      <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => setOpen(false)}
    >
      <Alert variant="filled" severity={message.severity}>
        {message.content}
      </Alert>
    </Snackbar>      
    </Container>
  );
}
