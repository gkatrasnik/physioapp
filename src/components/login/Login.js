import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../auth";
import { Form, Button, Card, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BoxArrowInUp } from "react-bootstrap-icons";

const Login = () => {
    const auth = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = () => {
        auth.resetPassword(auth.user.email);
        alert("Reset password link was set to your email");
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const signIn = await auth.login(email, password);

        if(signIn.error) {
            alert(signIn.error.message);
        } 

        setEmail("");
        setPassword("");
        navigate("/");
    }

    return (
    <>
      <Card
        style={{ width: "90%", maxWidth: "32rem", margin: "auto", marginTop: "10em" }}
        className="box-shadow"
      >
        <Card.Body>
          <h1 className="text-center">Login</h1>
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

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Enter password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="float-end mx-3">
              Login
            </Button>
          </Form>
          <Link to="/signup" className="float-start mx-4">
             <BoxArrowInUp/> Create User
          </Link>
          <Link to="/send-reset-password" className="float-start mx-4">
             Forgot Password?
          </Link>

        </Card.Body>
      </Card>
    </>
  );
};

export default Login;