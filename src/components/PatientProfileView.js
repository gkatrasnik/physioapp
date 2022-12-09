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
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { useAuth } from '../auth';
import AppointmentsList from './AppointmentsList';
import IssueList from './IssueList';
import IssuesCalendar from './IssuesCalendar';

const PatientProfileView = () => {
    const auth = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    
    const [infoExpanded, setInfoExpanded] = useState(false);
    const [issuesData, setIssuesData] = useState([]);


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
            .eq("rec_deleted", false)
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

        }     
    }
    
    

    const handleDeletePatient = async (patientId) => {

        await handleDeleteData();

        const queryData = await supabase
            .from('patients')
            .update({
                rec_deleted: true
            })
            .eq('id',patientId)

        if (queryData.error) {
            alert(queryData.error.message);
        }    

        console.log("after deleting patient")
        
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
                user_id: auth.user.id,
                org_id: auth.user.user_metadata.org_id
            })
            .eq('id', location.state.patientData.id)

        if (queryData.error) {
            alert(queryData.error.message);
        }else {
        }            
        
    }

    const handleUpdatePatient = () => {
        updatePatient();
        setEditing(false);
    }

    const toggleEdit = () => {
        setEditing(!editing);
        setInfoExpanded(true); //always show info if editing
    }

    const toggleShowInfo = () => {
        setInfoExpanded(!infoExpanded);
    }



    // Issues logic 

    //delete all patients data. It is called on deletePatient
    const handleDeleteData = async () => {   
        //delete all issues of this patient        
        const issuesResult = await Promise.allSettled(issuesData.map(async (issue) => {
          await deleteIssue(issue.id);          
        }));

        //delete apopointments of this patient
        const queryData = await supabase
            .from('appointments')
            .update({
                rec_deleted: true
            })
            .eq('patient_id', location.state.patientData.id)

            if (queryData.error) {
                alert(queryData.error.message);
            } else {
                return queryData;
            } 
    }

    const deleteIssue = async (issueId) => {    
        //delete isuses symptoms
        const deletedSymptom = await supabase
            .from('symptoms')
            .update({
                rec_deleted:true
            })
            .eq('issue_id', issueId)

        if (deletedSymptom.error) {
            alert(deletedSymptom.error.message);
        }    

        //delete isuses interventions
        const deletedIntervention = await supabase
            .from('interventions')
            .update({
                rec_deleted: true
            })
            .eq('issue_id', issueId)

        if (deletedIntervention.error) {
            alert(deletedIntervention.error.message);
        }    

        const queryData = await supabase
            .from('issues')
            .update({
                rec_deleted: true
            })
            .eq('id', issueId)

        if (queryData.error) {
            alert(queryData.error.message);
        } else {
            return queryData;
        }           
    }

    const getIssuesData = async () => {
         const queryData = await supabase
            .from('issues')
            .select()
            .eq('patient_id',location.state.patientData.id)
            .eq("rec_deleted", false)
            .order('start', { ascending: false })
        if (queryData.error) {
            alert(queryData.error.message);
        }else {
            setIssuesData(queryData.data);          
        } 
    }

    // useEffects
    useEffect(() => {
        getPatientData();    
        getIssuesData();    
        window.scrollTo(0, 0);
        if (window.innerWidth >= 992) {
            setInfoExpanded(true);
        }
    }, []);


    return (
        <Layout>
            <Container>
                <h1 className="text-center">Patient Profile View</h1>
                 <Row>
                    <Col lg={6}>
                        <Form className="my-5">
                            <h2 className='text-center'>{location.state.patientData.name}</h2>
                            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                defaultValue = {name}
                                disabled = {!editing}
                                type="text"
                                autoFocus
                                onChange={(e) => {
                                setName(e.target.value);
                                }}
                            />                
                            </Form.Group>
                            {infoExpanded &&
                            <>
                            <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                defaultValue = {email}
                                disabled = {!editing}
                                type="email"
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
                                onChange={(e) => {
                                setOccupation(e.target.value);
                                }}
                            />                
                            </Form.Group>
                            
                            <Button className="m-2 " variant="secondary" onClick={toggleEdit}>
                                {editing ? "Cancel" : "Edit Patient"}
                            </Button> 

                            {editing && <Button  className="m-2" variant="primary" type="submit" onClick={handleUpdatePatient}>
                                Update Patient
                            </Button> }

                            {editing && <Button className="m-2 mr-5" variant="danger" onClick={() => {handleDeletePatient(location.state.patientData.id)}}>
                                Delete Patient
                            </Button>}  
                            
                            </>}   

                            {!editing &&
                            <Button className="m-2 " variant="secondary" onClick={toggleShowInfo}>
                                {infoExpanded ? "Hide Info" : "Show Info"}
                            </Button>}           
                        </Form>

                        <AppointmentsList
                            patientData={location.state.patientData}
                        />
                    </Col>
                    <Col lg={6}>
                        <IssueList 
                        issuesData={issuesData}
                        getIssuesData={getIssuesData}
                        patientData={location.state.patientData}
                        />

                        <IssuesCalendar
                            issuesData={issuesData}
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};


export default PatientProfileView;
