import { useState } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import services from "../../services";

function SignupPage() {
  const [body, setBody] = useState({
    organisation: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

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

  function handleSubmitSignup(event) {
    event.preventDefault();
    console.log(body);
    services
      .signup(body)
      .then(() => navigate("/"))
      .catch(() => alert("Une erreur a eu lieu pendant l'inscription"));
  }

  return (
    <Container>
      <Row className="justify-content-center mt-3">
        <Col className="text-center">
          <h1>Inscription</h1>
        </Col>
      </Row>

      <Form onSubmit={handleSubmitSignup} onChange={handleFormChange}>
        <Row className="justify-content-center m-3">
          <Col className="text-center " md="auto">
            <Form.Group className="mb-3" controlId="organisation">
              <Form.Label>Organisation</Form.Label>
              <Form.Control
                type="text"
                placeholder="nom organisation"
                name="organisation"
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center m-3">
          <Col className="text-center" md="auto">
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="test@test.com"
                name="email"
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center m-3">
          <Col className="text-center" md="auto">
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="password"
                name="password"
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center m-3">
          <Col className="text-center" md="auto">
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>ConfirmPassword</Form.Label>
              <Form.Control
                type="password"
                placeholder="confirmPassword"
                name="confirmPassword"
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center m-3">
          <Col className="text-center" md="auto">
            <Button variant="primary" type="submit">
              S'inscrire
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default SignupPage;
