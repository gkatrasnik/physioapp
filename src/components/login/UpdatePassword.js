import React, {useState} from 'react';
import {useAuth} from "../../auth";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card} from "react-bootstrap";
import { Link } from "react-router-dom";

const UpdatePassword = () => {
    const auth = useAuth();
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            return alert("Password confirmation does not match");
        }

        const passwordReset = await auth.updatePassword(password);       

        if(passwordReset.error) {
            alert(passwordReset.error.message);
        } else {
            alert("Your password was updated successfuly");
        }

        setPassword("");
        setPasswordConfirmation("");
        navigate("/");
    }

    return (
    <>
      <Card
        style={{ width: "90%", maxWidth: "32rem", margin: "auto", marginTop: "10em" }}
        className="box-shadow"
      >
        <Card.Body>
          <h1 className="text-center">Update Password</h1>
          <Form
            onSubmit={handleSubmit}
            style={{ width: "90%", maxWidth: "32rem", margin: "auto" }}
          >

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="passwordConfirmation">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password confirmation"
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                }}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="float-end mx-3">
              Set New Password
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default UpdatePassword;