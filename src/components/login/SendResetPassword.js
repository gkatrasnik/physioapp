import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../contexts/auth";
import { Form, Button, Card, Container} from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingModal from "../modals/LoadingModal";
import { BoxArrowInRight } from "react-bootstrap-icons";


const SendResetPassword = () => {
    const auth = useAuth();
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const response = await auth.resetPassword(email);

        if(response.error) {
            setLoading(false);
            alert(response.error.message);
        } else {
          setLoading(false);
          alert("Reset password link was set to your email");
          setEmail("");
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
          <h1 className="text-center custom-page-heading-1">Forgot Password</h1>
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

            <Button variant="secondary" type="submit" className="float-end">
              Reset Password
            </Button>
          </Form>
          <Link to="/login" className="float-start mx-4">
            <BoxArrowInRight/> Login
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SendResetPassword;