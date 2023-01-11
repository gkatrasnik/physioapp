import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../contexts/auth";
import { Form, Button, Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BoxArrowInUp, Key } from "react-bootstrap-icons";
import LoadingModal from "../modals/LoadingModal";
import packageJson from '../../../package.json';

const Login = () => {
    const auth = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleResetPassword = () => {
        auth.resetPassword(auth.user.email);
        alert("Reset password link was set to your email");
    }


    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        const signIn = await auth.login(email, password);

        if(signIn.error) {
          setLoading(false);
          alert(signIn.error.message);  
        } else {
          setLoading(false);
          setEmail("");
          setPassword("");
          navigate("/");
        }        
    }

    return (
    <Container className="min-h-100">
      {loading && <LoadingModal />}
      <h1 className="login-logo lobster-font">PhysioApp</h1>
      <Card
        style={{ width: "90%", maxWidth: "32rem", margin: "auto", top:"6rem"}}
        className="box-shadow"
      >
        <Card.Body>
          <h1 className="text-center custom-page-heading-1">Login</h1>
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

            <Button variant="secondary" type="submit" className="float-end">
              Login
            </Button>
          </Form>
          <Link to="/signup" className="float-start mx-4">
             <BoxArrowInUp/> Create User
          </Link>
          <Link to="/send-reset-password" className="float-start mx-4">
             <Key/> Change Password
          </Link>

        </Card.Body>
      </Card>
      <p className='text-center'>{packageJson.version}</p>
    </Container>
  );
};

export default Login;