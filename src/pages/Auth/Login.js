import { useState } from "react";
import { useAuth } from "../../AuthProvider";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import services from "../../services";

function LoginPage() {
  const { setConnected } = useAuth();

  const [body, setBody] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  function updateBody(key, value) {
    setBody({ ...body, [key]: value });
  }

  function handleChangeInput(e) {
    const { name, value } = e.target;
    updateBody(name, value);
  }

  function handleSubmitLogin(e) {
    e.preventDefault();
    services
      .login(body)
      .then((result) => {
        const { jwt } = result;
        localStorage.setItem("jwt", jwt);
        setConnected(true);
        navigate("/events");
      })
      .catch((err) => {
        console.log(err);
        alert("Une erreur a eu lieu pendant le login");
      });
  }

  return (
    <Container>
      <Row className="justify-content-center mt-3">
        <Col className="text-center">
          <h3>Login</h3>
        </Col>
      </Row>
      <Form onSubmit={handleSubmitLogin} onChange={handleChangeInput}>
        <Row className="justify-content-center m-3">
          <Col className="text-center " md="auto">
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>email</Form.Label>
              <Form.Control
                type="email"
                placeholder="prenom.nom@email.com"
                name="email"
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center m-3">
          <Col className="text-center" md="auto">
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>password</Form.Label>
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
          <Col className="text-center">
            <Button variant="primary" type="submit">
              Se connecter
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default LoginPage;
