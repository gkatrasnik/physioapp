import React, {useState, useEffect} from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../auth";
import { Form, Button, Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BoxArrowInRight } from "react-bootstrap-icons";
import LoadingModal from "../modals/LoadingModal";


const Signup = () => {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [name, setName ]= useState("");
    const [phone, setPhone ]= useState("");
    const [address, setAddress ]= useState("");
    const [city, setCity ]= useState("");
    const [zipCode, setZipCode ]= useState("");


    const [orgPass, setOrgPass] = useState("");
    const [orgCode, setOrgCode] = useState(null);
    const navigate = useNavigate();

    const submitOrgPass = async (e) => {   
      e.preventDefault();   
      setLoading(true);
      let { data, error } = await supabase
        .rpc('find_org', {
          passwordparam:orgPass
        })

      if (error) {
        setLoading(false);
        alert(error.message);
      } else {
        setLoading(false);
        if (data) {
          setOrgCode(data);
          setOrgPass("");
        } else {
          alert("No organization matches this password")
          e.target.reset();
        }
        
      }
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {           
          name: name,
          address: address,
          phone: phone,
          city:city,
          zip_code:zipCode,
          org_id:orgCode
        }

        if (password !== passwordConfirmation) {
            setLoading(false);
            return alert("Password confirmation does not match")
        }

        const signIn = await auth.signup(email, password, data)

        if(signIn.error) {
          setLoading(false);
          alert(signIn.error.message)
        } else {
          setLoading(false);
          alert("Your account has been created,  please verify it by clicking the activation link that has been send to your email")
          
          setEmail("")
          setPassword("")
          setPasswordConfirmation("")
          navigate("/");
        }        

    }

     
  

   
    return (
    <Container className="min-h-100">
      {loading && <LoadingModal />}

      {!orgCode && <Card
        style={{ width: "90%", maxWidth: "32rem", margin: "auto", top: "10rem" }}
        className="box-shadow"
      >
        <Card.Body>
          <h1 className="text-center page-heading">Create User</h1>
          <Form
            onSubmit={submitOrgPass}
            style={{ width: "90%", maxWidth: "32rem", margin: "auto" }}
          >
            

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Organization Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Enter organization password"
                onChange={(e) => {
                  setOrgPass(e.target.value);
                }}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="float-end mx-3">
              Confirm
            </Button>
          </Form>
          <Link to="/login" className="float-start mx-4">
            <BoxArrowInRight/> Login
          </Link>
        </Card.Body>
      </Card>}


      {orgCode && <Card
        style={{ width: "90%", maxWidth: "32rem", margin: "auto", marginTop: "10em" }}
        className="box-shadow"
      >
        <Card.Body>
          <h1 className="text-center page-heading">Create User</h1>
          <Form
            onSubmit={handleSubmit}
            style={{ width: "90%", maxWidth: "32rem", margin: "auto" }}
          >
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="text"
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
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="passwordConfirmation">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                required
                type="password"
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                required
                type="tel"
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                required
                type="text"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                required
                type="text"
                onChange={(e) => {
                  setCity(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="zip">
              <Form.Label>ZIP Code</Form.Label>
              <Form.Control
                required
                type="number"
                onChange={(e) => {
                  setZipCode(e.target.value);
                }}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="float-end mx-3">
              Create User
            </Button>
          </Form>
          <Link to="/login" className="float-start mx-4">
            <BoxArrowInRight/>  Login
          </Link>
        </Card.Body>
      </Card>}
    </Container>
  );
};

export default Signup;