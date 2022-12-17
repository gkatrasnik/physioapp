import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../auth";
import { Form, Button, Card, Container} from "react-bootstrap";
import { Link } from "react-router-dom";

const SendResetPassword = () => {
    const auth = useAuth();
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await auth.resetPassword(email);

        if(response.error) {
            alert(response.error.message);
        } else {
          alert("Reset password link was set to your email");
          setEmail("");
          navigate("/");
        }

        
    }

    return (
    <Container className="min-h-100">
      <Card
        style={{ width: "90%", maxWidth: "32rem", margin: "auto", top: "10rem" }}
        className="box-shadow"
      >
        <Card.Body>
          <h1 className="text-center page-heading">Forgot Password</h1>
          <Form
            onSubmit={handleSubmit}
            style={{ width: "90%", maxWidth: "32rem", margin: "auto" }}
          >
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="float-end mx-3">
              Reset Password
            </Button>
          </Form>
          <Link to="/login" className="float-start mx-4">
              Login
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SendResetPassword;