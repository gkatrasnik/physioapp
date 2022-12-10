//issue details + (CRUD symptoms/interventions)
//issue photos
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Layout from "./Layout";
import { useAuth } from '../auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import SymptomsList from './SymptomsList';
import InterventionsList from './InterventionsList';
import moment from "moment";
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';
import LoadingModal from "./modals/LoadingModal";

const IssueView = () => {
    const auth = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(false);


   // const [userData, setUserData] = useState();

    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [resolved, setResolved] = useState(false);
    const [diagnosis, setDiagnosis] = useState("");
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [lastChanged, setLastChanged] = useState("");
    const [userId, setUserId] = useState("");
    const [patientId, setPatientId] = useState("");

    const [patientData, setPatientData] =useState();   

    const [InterventionsData, setInterventionsData] =useState([]);   
    const [symptomsData, setSymptomsData] =useState([]);   


    const getIssueData = async () => {
        setLoading(true);
        const queryData = await supabase
            .from('issues')
            .select()
            .eq('id',location.state.issueData.id)
            .eq("rec_deleted", false)
        if (queryData.error) {
            setLoading(false);
            alert(queryData.error.message);
        }else {
            setLoading(false);
            if(queryData.data) {
                setTitle(queryData.data[0].name)
                setNotes(queryData.data[0].notes)
                setResolved(queryData.data[0].resolved)
                setDiagnosis(queryData.data[0].diagnosis)
                setStart(moment(queryData.data[0].start).toDate())
                setEnd(moment(queryData.data[0].end).toDate())
                setLastChanged(queryData.data[0].last_changed)
                setUserId(queryData.data[0].user_id)
                setPatientId(queryData.data[0].patient_id)
            }
           
        }     
    }

    const deleteIssue = async (issueId) => {       
        setLoading(true);
        //delete isuuses symptoms
        const deletedSymptom = await supabase
            .from('symptoms')
            .update({
                rec_deleted: true
            })
            .eq('issue_id', issueId)

        if (deletedSymptom.error) {            
            console.warn("There were no symptoms to delete for issue id ", issueId);
        }    

        //delete isuuses interventions
        const deletedIntervention = await supabase
            .from('interventions')
            .update({
                rec_deleted: true
            })
            .eq('issue_id', issueId)

        if (deletedIntervention.error) {
            console.warn("There were no interventions to delete for issue id ", issueId);
        }    

        const queryData = await supabase
            .from('issues')
            .update({
                rec_deleted: true
            })
            .eq('id', issueId)

        if (queryData.error) {
            setLoading(false);
            alert(queryData.error.message);
        } else {
            setLoading(false);
            navigate(-1);
        }
        
    }

    const updateIssue = async () => {
        setLoading(true);
        const queryData = await supabase
            .from('issues')
            .update({
                name: title,
                notes: notes,                
                diagnosis: diagnosis,
                last_changed: lastChanged,
                start: start,
                end: end,
                org_id: auth.user.user_metadata.org_id          
            })
            .eq('id', location.state.issueData.id)

        if (queryData.error) {
            setLoading(false);
            alert(queryData.error.message);
        }else {
            setLoading(false);
            getIssueData();
        }        
    }


     const handleUpdateIssue = () => {
        if (start && end && start >= end) {
            return alert('Please adjust "From" and "To" dates')
        }
        updateIssue();
        setEditing(false);
    }

    const toggleEdit = () => {
        setEditing(!editing);
    }

    //patients data
    const getPatientData = async () => {
        setLoading(true);
        const queryData = await supabase
            .from('patients')
            .select() 
            .eq('id', location.state.issueData.patient_id)           
            .eq("rec_deleted", false)
        if (queryData.error) {
            setLoading(false);
            alert(queryData.error.message);
        }else {
            setLoading(false);
            setPatientData(queryData.data[0])
        }     
    }

    const setEndNull = () => {
        setEnd(null);
    }    

    const toggleConfirmDelete = () => {
        setShowConfirmDelete(!showConfirmDelete);
    }


    // useEffects
    useEffect(() => {
        getIssueData();    
        getPatientData();
        window.scrollTo(0, 0);
    }, []);
  
    

    return (
        <>
        {loading && <LoadingModal />}

        <ConfirmDeleteModal
            show={showConfirmDelete}
            title={"Delete Issue"}
            message={"Do you really want to delete this issue with all of its symptoms and interventions?"}
            callback={deleteIssue}
            callbackArgs={location.state.issueData.id}
            cancelCallback={toggleConfirmDelete}            
        />

        <Layout>
            <Container fluid={true}>
                <h1 className="text-center">Issue View</h1>
                 <Row>
                    <Col lg={6}>
                        <Form className="my-5 mx-auto component-big">
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
                            <Form.Label>From</Form.Label>
                            <Form.Control
                                value = {moment(start).format("YYYY-MM-DDTHH:mm")}
                                disabled = {!editing}
                                type="datetime-local"
                                onChange={(e) => {
                                setStart(moment(e.target.value).toDate());
                                }}
                            />               
                            </Form.Group>  

                            <Form.Group className="mb-1" controlId="exampleForm.ControlInput5">
                            <Form.Label>To</Form.Label>
                            <Form.Control
                                value = {moment(end).format("YYYY-MM-DDTHH:mm")}
                                disabled = {!editing}
                                type="datetime-local"
                                onChange={(e) => {
                                setEnd(moment(e.target.value).toDate());
                                }}
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

                            <Form.Group className="m-2" controlId="exampleForm.ControlInput3">
                            <Form.Check
                                label="Resolved"                     
                                checked = {end && end}
                                disabled = {true}
                                type="checkbox"                       
                            />                
                            </Form.Group>

                            <Button className="m-2 " variant="secondary" onClick={toggleEdit}>
                                {editing ? "Cancel" : "Edit Issue"}
                            </Button>    

                            {editing && <Button className="m-2 mr-5" variant="danger" onClick={toggleConfirmDelete}>
                                Delete Issue
                            </Button>}                
                            {editing && <Button  className="m-2" variant="primary"  onClick={handleUpdateIssue}>
                                Update Issue
                            </Button> }   

                            {editing && <Button className="m-2 mr-5" variant="secondary" onClick={() => {setEndNull()}}>
                                Set Not resolved
                            </Button>}  
                                    
                        </Form>
                    </Col>
                     <Col lg={6}>
                        <SymptomsList issueData={location.state.issueData}/>
                        <InterventionsList issueData={location.state.issueData}/>
                     </Col>
                </Row>              
            </Container>
            
        </Layout>
        </>
    );
};


export default IssueView;

