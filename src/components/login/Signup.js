import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../auth";
import { Form, Button, Card, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BoxArrowInUp } from "react-bootstrap-icons";

const Signup = () => {
    const auth = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const navigate = useNavigate();



    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== passwordConfirmation) {
            return alert("Password confirmation does not match")
        }

        const signIn = await auth.signup(email, password)

        if(signIn.error) {
            alert(signIn.error.message)
        } else {
            alert("Your account has been created,  please verify it by clicking the activation link that has been send to your email")
        }

        setEmail("")
        setPassword("")
        setPasswordConfirmation("")
        navigate("/");

    }

   
    return (
    <>
      <Card
        style={{ width: "90%", maxWidth: "32rem", margin: "auto", marginTop: "10em" }}
        className="box-shadow"
      >
        <Card.Body>
          <h1 className="text-center">Sign Up</h1>
          <Form
            onSubmit={handleSubmit}
            style={{ width: "90%", maxWidth: "32rem", margin: "auto" }}
          >
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
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
                type="password"
                placeholder="Enter password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="passwordConfirmation">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password confirmation"
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                }}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="float-end mx-3">
              Sign Up
            </Button>
          </Form>
          <Link to="/login" className="float-start mx-4">
            Login
          </Link>
        </Card.Body>
      </Card>
    </>
  );
};

export default Signup;