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
import { Container, Button, Form, Table } from 'react-bootstrap';
import { useAuth } from '../auth';
import NewIssueModal from './modals/NewIssueModal';
import { CheckSquare } from 'react-bootstrap-icons';

const PatientProfileView = () => {
    const auth = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [showNewIssue, setShowNewIssue] = useState(false);
    const [infoExpanded, setInfoExpanded] = useState(false);

    //patient profile editing state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState();
    const [birthDate, setBirdhDate] = useState();
    const [occupation, setOccupation] = useState("");

    // issue data state
    const [issuesData, setIssuesData] = useState([])

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
    
    

    const deletePatient = async (patientId) => {
        const queryData = await supabase
            .from('patients')
            .delete()
            .eq('id',patientId)

        if (queryData.error) {
            alert(queryData.error.message);
        }    

        console.log("after deleting patient")
        
        navigate("/patients");
    }

    const handleDeleteIssues = async () => {   
        //delete all issues of this patient        
        const resultArr = await Promise.allSettled(issuesData.map(async (issue) => {
           deleteIssue(issue.id);          
        }));

    }

     const deleteIssue = async (issueId) => {      

        //delete isuses symptoms
        const deletedSymptom = await supabase
            .from('symptoms')
            .delete()
            .eq('issue_id', issueId)

        if (deletedSymptom.error) {
            alert(deletedSymptom.error.message);
        }    

        //delete isuses interventions
        const deletedIntervention = await supabase
            .from('interventions')
            .delete()
            .eq('issue_id', issueId)

        if (deletedIntervention.error) {
            alert(deletedIntervention.error.message);
        }    

        const queryData = await supabase
            .from('issues')
            .delete()
            .eq('id', issueId)

        if (queryData.error) {
            alert(queryData.error.message);
        } else {
            return queryData;
        }           
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

    // issues logic 

    const toIssueView=(issue)=>{
     navigate('/issue',{state:{issueData:issue}});
    }

    const getIssuesData = async () => {
         const queryData = await supabase
            .from('issues')
            .select()
            .eq('patient_id',location.state.patientData.id)
            .order('created_at', { ascending: false })
        if (queryData.error) {
            alert(queryData.error.message);
        }else {
            setIssuesData(queryData.data);          
        } 
    }

    const toggleShowNewIssue = () => {
        setShowNewIssue(!showNewIssue);
    }


    // useEffects
    useEffect(() => {
    getPatientData();    
    getIssuesData();
    }, []);


    return (
        <Layout>
            <Container>
                <NewIssueModal patientData={location.state.patientData} showNewIssue={showNewIssue} getIssuesData={getIssuesData} toggleShowNewIssue={toggleShowNewIssue}/>
                <h1 className="text-center">Patient Profile View</h1>
                
                <Form className="mt-4">
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

                    {editing && <Button disabled={issuesData.length} className="m-2 mr-5" variant="danger" onClick={() => {deletePatient(location.state.patientData.id)}}>
                        Delete Patient
                    </Button>}  

                    {editing && issuesData.length > 0 && <Button className="m-2 mr-5" variant="danger" onClick={handleDeleteIssues}>
                        Delete Patient Data
                    </Button>}
                    
                    </>}   

                    {!editing &&
                    <Button className="m-2 " variant="secondary" onClick={toggleShowInfo}>
                        {infoExpanded ? "Hide Info" : "Show Info"}
                    </Button>}           
                </Form>

                <Button  className="m-2" variant="primary" type="submit" onClick={toggleShowNewIssue}>
                    New Issue
                </Button>

                <Table  bordered >
                    <thead>
                        <tr>
                        <th>Id</th>
                        <th>Issue</th>
                        <th>Date</th>
                        <th>Diagnosis</th>
                        <th>Resolved</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                       {issuesData && issuesData.length ? issuesData.map((issue, index) => {
                        return (
                            <tr key={index} onClick={()=>{toIssueView(issue)}} className={issue.resolved ?'text-white bg-success' : ''}>
                            <td>{issue.id}</td>
                            <td>{issue.name}</td>
                            <td>{new Date(issue.created_at).toLocaleDateString("sl")}</td>
                            <td>{issue.diagnosis}</td>
                            <td className='text-center'>{issue.resolved ? <CheckSquare/> : ""}</td>
                            </tr>
                            )
                        }):                     
                            <tr>
                                <td colSpan={5}>
                                     No results
                                </td>                               
                            </tr>
                    }   
                    </tbody>
                </Table>     
                
            </Container>
        </Layout>
    );
};


export default PatientProfileView;
