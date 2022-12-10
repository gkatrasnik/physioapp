// basic patient info
// isues list (aslo show qucick symptom/intervention info)
// bodyPicture with issues/symptoms
// issue photos
// search issues?
// current (open) issues (maybe show only those on bodyPicture?)

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../auth';
import LoadingModal from "./LoadingModal"


const NewPatientModal = (props) => {
   // const auth = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState(null);
    const [birthDate, setBirthDate] = useState(null);
    const [occupation, setOccupation] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = useAuth();

    const handleNewPatient = (e) => {
        e.preventDefault();
        addPatient();
        props.handleToggleModal();       
    }

    const addPatient = async () => {     
        setLoading(true); 
        const queryData = await supabase
            .from('patients')
            .insert({
                name: name,
                email: email,
                phone: phone,
                address: address,
                city: city,
                zip_code: zip,
                birthdate: birthDate,
                occupation: occupation,
                user_id: auth.user.id,
                org_id: auth.user.user_metadata.org_id,
                rec_deleted: false
            })

        if (queryData.error) {
            setLoading(false); 
            alert(queryData.error.message);            
        }else {
            setLoading(false); 
            props.getPatients();
        }     
        
        
    }
   /* useEffect(() => {
    
    }, [])*/


    return (        
        <>
        {loading && <LoadingModal />}
        <Modal centered backdrop="static" show={props.show} onHide={props.handleToggleModal}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Add New Patient</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form onSubmit={handleNewPatient}>
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    required
                    type="text"
                    autoFocus
                    onChange={(e) => {
                    setName(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    type="email"
                    onChange={(e) => {
                    setEmail(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                    type="tel"
                    onChange={(e) => {
                    setPhone(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput4">
                <Form.Label>Address</Form.Label>
                <Form.Control
                    type="text"
                    onChange={(e) => {
                    setAddress(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput5">
                <Form.Label>City</Form.Label>
                <Form.Control
                    type="text"
                    onChange={(e) => {
                    setCity(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput6">
                <Form.Label>ZIP Code</Form.Label>
                <Form.Control
                    type="number"
                    onChange={(e) => {
                    setZip(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput7">
                <Form.Label>Birth Date</Form.Label>
                <Form.Control
                    type="date"
                    onChange={(e) => {
                    setBirthDate(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput8">
                <Form.Label>Occupation</Form.Label>
                <Form.Control
                    type="text"
                    onChange={(e) => {
                    setOccupation(e.target.value);
                    }}
                />                
                </Form.Group>
                <Button className="m-2 " variant="secondary" onClick={props.handleToggleModal}>
                    Close
                </Button>
                <Button className="m-2" variant="primary" type="submit">
                    Add Patient
                </Button>                

            </Form>
            </Modal.Body>
        </Modal>
        </>
    );
};


export default NewPatientModal;
