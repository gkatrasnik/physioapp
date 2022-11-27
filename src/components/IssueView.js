//issue details + (CRUD symptoms/interventions)
//issue photos
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Layout from "./Layout";
import { useAuth } from '../auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button, Form, Table } from 'react-bootstrap';
import SymptomsList from './SymptomsList';
import InterventionsList from './InterventionsList';


const IssueView = () => {
    const auth = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);

   // const [userData, setUserData] = useState();

    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [resolved, setResolved] = useState(false);
    const [diagnosis, setDiagnosis] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [lastChanged, setLastChanged] = useState("");
    const [userId, setUserId] = useState("");
    const [patientId, setPatientId] = useState("");

    const [patientData, setPatientData] =useState();   

    const [InterventionsData, setInterventionsData] =useState([]);   
    const [symptomsData, setSymptomsData] =useState([]);   


    const getIssueData = async () => {
        const queryData = await supabase
            .from('issues')
            .select()
            .eq('id',location.state.issueData.id)
        if (queryData.error) {
            alert(queryData.error.message);
        }else {
            setTitle(queryData.data && queryData.data[0].name)
            setNotes(queryData.data && queryData.data[0].notes)
            setResolved(queryData.data && queryData.data[0].resolved)
            setDiagnosis(queryData.data && queryData.data[0].diagnosis)
            setCreatedAt(queryData.data && queryData.data[0].created_at)
            setLastChanged(queryData.data && queryData.data[0].last_changed)
            setUserId(queryData.data && queryData.data[0].user_id)
            setPatientId(queryData.data && queryData.data[0].patient_id)

            console.log("resolved", resolved)
        }     
    }

    const deleteIssue = async (issueId) => {       

        //delete isuuses symptoms
        const deletedSymptom = await supabase
            .from('symptoms')
            .delete()
            .eq('issue_id', issueId)

        if (deletedSymptom.error) {
            alert(deletedSymptom.error.message);
        }    

        //delete isuuses interventions
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
        }     
        
        navigate(-1);
    }

    const updateIssue = async () => {
        const queryData = await supabase
            .from('issues')
            .update({
                name: title,
                notes: notes,
                resolved: resolved,
                diagnosis: diagnosis,
                last_changed: lastChanged,
                org_id: auth.user.user_metadata.org_id          
            })
            .eq('id', location.state.issueData.id)

        if (queryData.error) {
            alert(queryData.error.message);
        }else {
        }        
    }


     const handleUpdateIssue = () => {
        updateIssue();
        setEditing(false);
    }

    const toggleEdit = () => {
        setEditing(!editing);
    }

    //patients data
    const getPatientData = async () => {
         const queryData = await supabase
            .from('patients')
            .select() 
            .eq('id', location.state.issueData.patient_id)           
        if (queryData.error) {
            alert(queryData.error.message);
        }else {
            setPatientData(queryData.data[0])
        }     
    }


    // useEffects
    useEffect(() => {
         getIssueData();    
        getPatientData();
    }, []);


    return (
        <Layout>
            <Container>
                <h1 className="text-center">Issue View</h1>
                
                <Form className="mt-4">
                    <h2 className='text-center'>{location.state.issueData.name}</h2>
                    <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        defaultValue = {title}
                        disabled = {!editing}
                        type="text"
                        autoFocus
                        onChange={(e) => {
                        setTitle(e.target.value);
                        }}
                    />                
                    </Form.Group>

                    <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                        defaultValue = {notes}
                        disabled = {!editing}
                        type="text"
                        as="textarea" rows={4}
                        onChange={(e) => {
                        setNotes(e.target.value);
                        }}
                    />                
                    </Form.Group>

                    <Form.Group className="mb-1" controlId="exampleForm.ControlInput3">
                    <Form.Label>Resolved</Form.Label>
                    <Form.Check
                        checked = {resolved && resolved}
                        disabled = {!editing}
                        type="checkbox"
                        onChange={(e) => {
                        setResolved(e.target.checked);
                        }}
                    />                
                    </Form.Group>

                    <Form.Group className="mb-1" controlId="exampleForm.ControlInput4">
                    <Form.Label>Diagnosis</Form.Label>
                    <Form.Control
                        defaultValue = {diagnosis}
                        disabled = {!editing}
                        type="text"
                        onChange={(e) => {
                        setDiagnosis(e.target.value);
                        }}
                    />                
                    </Form.Group>

                    <Form.Group className="mb-1" controlId="exampleForm.ControlInput5">
                    <Form.Label>Created At</Form.Label>
                    <Form.Control
                        defaultValue = {new Date(createdAt).toLocaleDateString("sl")}
                        disabled = {true}
                        type="text"
                    />                
                    </Form.Group>     

                    <Form.Group className="mb-1" controlId="exampleForm.ControlInput8">
                    <Form.Label>Patient</Form.Label>
                    <Form.Control
                        defaultValue = {patientData && patientData.name}
                        disabled = {true}
                        type="text"
                    />                
                    </Form.Group>
                    {editing && <Button className="m-2 mr-5" variant="danger" onClick={() => {deleteIssue(location.state.issueData.id)}}>
                        Delete Issue
                    </Button>}                
                    {editing && <Button  className="m-2" variant="primary" type="submit" onClick={handleUpdateIssue}>
                        Update Issue
                    </Button> }   
                    <Button className="m-2 " variant="secondary" onClick={toggleEdit}>
                        {editing ? "Cancel" : "Edit Issue"}
                    </Button>             
                </Form>

                <SymptomsList issueData={location.state.issueData}/>
                <InterventionsList issueData={location.state.issueData}/>

            </Container>
            
        </Layout>
    );
};


export default IssueView;

