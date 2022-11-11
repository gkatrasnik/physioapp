// basic patient info
// isues list (aslo show qucick symptom/intervention info)
// bodyPicture with issues/symptoms
// issue photos
// search issues?
// current (open) issues (maybe show only those on bodyPicture?)

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import Layout from "./Layout";
import { Container, Button, Form } from 'react-bootstrap';
import { useAuth } from '../auth';

const PatientProfileView = () => {
    const auth = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);

    //patient profile editing state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState();
    const [birthDate, setBirdhDate] = useState();
    const [occupation, setOccupation] = useState("");


    const getPatientData = async () => {
         const queryData = await supabase
            .from('patients')
            .select()
            .eq('id',location.state.patientData.id)
        if (queryData.error) {
            alert(queryData.error.message);
        }else {
            setName(queryData.data[0].name)
            setEmail(queryData.data[0].email)
            setPhone(queryData.data[0].phone)
            setAddress(queryData.data[0].address)
            setCity(queryData.data[0].city)
            setZip(queryData.data[0].zip_code)
            setBirdhDate(queryData.data[0].birthdate)
            setOccupation((queryData.data[0].occupation))

            console.log(queryData)
        }     
    }
    
    const deletePatient = async () => {     
        const queryData = await supabase
            .from('patients')
            .delete()
            .eq('id',location.state.patientData.id)

        if (queryData.error) {
            console.log(queryData.error.message);
        }      
        
        navigate("/patients");
    }
    
    const updatePatient = async () => {  

        const queryData = await supabase
            .from('patients')
            .update({
                name: name,
                email: email,
                phone: phone,
                address: address,
                city: city,
                zip_code: zip,
                birthdate: birthDate,
                occupation: occupation,
                user_id: auth.user.id
            })
            .eq('id', location.state.patientData.id)

        if (queryData.error) {
            console.log(queryData.error.message);
        }else {
            console.log(queryData)
        }            
        
    }

    const handleUpdatePatient = () => {
        updatePatient();
        setEditing(false);
    }

    const toggleEdit = () => {
        setEditing(!editing);
    }

    
    useEffect(() => {
    console.log("patient location state", location.state)
    getPatientData();    
    }, [])


    return (
        <Layout>
            <Container>
                <h1 className="text-center">Patient Profile View</h1>
                <div>{location.state.patientData.name}</div>
                 <Form >
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    defaultValue = {name}
                    disabled = {!editing}
                    type="text"
                    placeholder="John Doe"
                    autoFocus
                    onChange={(e) => {
                    setName(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    defaultValue = {email}
                    disabled = {!editing}
                    type="email"
                    placeholder="name@example.com"
                    onChange={(e) => {
                    setEmail(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                    defaultValue = {phone}
                    disabled = {!editing}
                    type="tel"
                    placeholder="00386 40 000 000"
                    onChange={(e) => {
                    setPhone(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput4">
                <Form.Label>Address</Form.Label>
                <Form.Control
                    defaultValue = {address}
                    disabled = {!editing}
                    type="text"
                    placeholder="Main Street 42"
                    onChange={(e) => {
                    setAddress(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput5">
                <Form.Label>City</Form.Label>
                <Form.Control
                    defaultValue = {city}
                    disabled = {!editing}
                    type="text"
                    placeholder="Big City"
                    onChange={(e) => {
                    setCity(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput6">
                <Form.Label>ZIP Code</Form.Label>
                <Form.Control
                    defaultValue = {zip}
                    disabled = {!editing}
                    type="number"
                    placeholder="1000"
                    onChange={(e) => {
                    setZip(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput7">
                <Form.Label>Birth Date</Form.Label>
                <Form.Control
                    defaultValue = {birthDate}
                    disabled = {!editing}
                    type="date"
                    placeholder="1.1.2000"
                    onChange={(e) => {
                    setBirdhDate(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput8">
                <Form.Label>Occupation</Form.Label>
                <Form.Control
                    defaultValue = {occupation}
                    disabled = {!editing}
                    type="text"
                    placeholder="Plumber"
                    onChange={(e) => {
                    setOccupation(e.target.value);
                    }}
                />                
                </Form.Group>
                <Button disabled={!editing} className="m-2 mx-5"variant="danger" onClick={deletePatient}>
                    Delete Patient
                </Button>
                <Button className="m-2 " variant="secondary" onClick={toggleEdit}>
                    {editing ? "Cancel" : "Edit Patient"}
                </Button>
                <Button disabled={!editing} className="m-2" variant="primary" type="submit" onClick={handleUpdatePatient}>
                    Update Patient
                </Button>                
            </Form>
            </Container>
        </Layout>
    );
};


export default PatientProfileView;
