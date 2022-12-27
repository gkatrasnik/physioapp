import React, {useState} from 'react';
import {useAuth} from "../../auth";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container} from "react-bootstrap";
import LoadingModal from "../modals/LoadingModal";

const UpdatePassword = () => {
    const auth = useAuth();
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== passwordConfirmation) {
            return alert("Password confirmation does not match");
        }

        const passwordReset = await auth.updatePassword(password);       

        if(passwordReset.error) {
          setLoading(false);
          alert(passwordReset.error.message);
        } else {
          setLoading(false);
          alert("Your password was updated successfuly");

          setPassword("");
          setPasswordConfirmation("");
          navigate("/");
        }

    }

    return (
    <Container className="min-h-100">
      {loading && <LoadingModal />}
      <Card
        style={{ width: "90%", maxWidth: "32rem", margin: "auto", top: "10rem" }}
        className="box-shadow"
      >
        <Card.Body>
          <h1 className="text-center custom-page-heading-1">Update Password</h1>
          <Form
            onSubmit={handleSubmit}
            style={{ width: "90%", maxWidth: "32rem", margin: "auto" }}
          >

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                required
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
                required
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
    </Container>
  );
};

export default UpdatePassword;