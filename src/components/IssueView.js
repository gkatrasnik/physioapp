//issue details + (CRUD symptoms/interventions)
//issue photos
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Layout from "./Layout";
import { useAuth } from '../contexts/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button, Form, Tab, Tabs } from 'react-bootstrap';
import SymptomsList from './SymptomsList';
import InterventionsList from './InterventionsList';
import moment from "moment";
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';
import LoadingModal from "./modals/LoadingModal";
import { Check2Square, Square } from 'react-bootstrap-icons';
import { useSwipeable } from 'react-swipeable';

//for swipable tabs
const config = {
  delta: 50,                            // min distance(px) before a swipe starts
  preventDefaultTouchmoveEvent: false,  // call e.preventDefault *See Details*
  trackTouch: true,                     // track touch input
  trackMouse: false,                    // track mouse input
  rotationAngle: 0,                     // set a rotation angle
}

const tabs = ["Info", "Symptoms", "Interventions"];

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
    const [activeTab, setActiveTab] = useState(tabs.currentTab()); 


 //swipable tabs
    const handlers = useSwipeable({
        onSwiped: (e) => {
            if(e.dir==="Right") {    
            setActiveTab(tabs.previousTab());  
            }
            else if(e.dir==="Left") {   
            setActiveTab(tabs.nextTab());      
            }          
    }, ...config, });
      
    const handlerSetTab = (i) => {
        setActiveTab(tabs.jumpTab(i));
    }      


    // on component mount set state from location.state data
    const setLocalStateIssue = () => {
        setTitle(location.state.issueData.name)
        setNotes(location.state.issueData.notes)
        setResolved(!!location.state.issueData.end)
        setDiagnosis(location.state.issueData.diagnosis)
        setStart(moment(location.state.issueData.start).toDate())
        setEnd(location.state.issueData.end ? moment(location.state.issueData.end).toDate() : null)
        setLastChanged(location.state.issueData.last_changed)
        setUserId(location.state.issueData.user_id)
        setPatientId(location.state.issueData.patient_id)
    }

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
                setResolved(!!queryData.data[0].end)
                setDiagnosis(queryData.data[0].diagnosis)
                setStart(moment(queryData.data[0].start).toDate())
                setEnd(queryData.data[0].end ? moment(queryData.data[0].end).toDate() : null)
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
                org_id: auth.userObj.org_id          
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
            return alert('Please adjust "From" and "To" dates');
        }
        
        updateIssue();
        setEditing(false);
    }

    const toggleEdit = () => {
        setEditing(!editing);
    }

    const setEndNull = async () => {
        const nullEnd = null;
        setEnd(nullEnd);

        setLoading(true);
        const queryData = await supabase
            .from('issues')
            .update({                
                end: nullEnd                       
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

    const setEndNow = async () => {
        const newEnd = moment().toDate();
        setEnd(newEnd);

        setLoading(true);
        const queryData = await supabase
            .from('issues')
            .update({                
                end: newEnd                       
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

    const toggleConfirmDelete = () => {
        setShowConfirmDelete(!showConfirmDelete);
    }

    const handleSelectTab = (key) => {
        setActiveTab(key);
    }

    // useEffects
    useEffect(() => {
        setLocalStateIssue();    
        window.scrollTo(0, 0);
    }, []);
  
    //update resolved local state 
    useEffect(() => {        
      if (end) {
        setResolved(true);
      } else {
        setResolved(false);
      }
    }, [end])    

    return (
        <>
        {loading && <LoadingModal />}

        <ConfirmDeleteModal
            show={showConfirmDelete}
            title={"Delete Issue"}
            message={"Do you really want to delete this issue with all of its symptoms and interventions?"}
            callback={deleteIssue}
            callbackArgs={location.state ? location.state.issueData.id : null}
            cancelCallback={toggleConfirmDelete}            
        />

        <Layout>
            <Container fluid={true} className={"min-h-100-without-navbar"} {...handlers}>
                <h1 className="text-center custom-page-heading-1 mt-5 mb-4">Issue {location.state ? ( " - " + location.state.issueData.name ) : null} {resolved ? <Check2Square className="custom-color-success"/> : <Square className="custom-color-warning"/>}</h1>
                 <Tabs  
                    activeKey={activeTab} 
                    onSelect={(tab) => handlerSetTab(tab)} 
                    fill            
                 >
                    <Tab title="Info" eventKey="Info">
                        <Form className="my-3 mx-auto component-big ">
                            <h2 className='text-center mt-4 mb-4'>Issue Info</h2>
                            <div className='buttons-container'>                                 

                                {editing && <Button className="m-2 mr-5" variant="danger" onClick={toggleConfirmDelete}>
                                    Delete
                                </Button>}                
                                {editing && <Button  className="m-2" variant="secondary"  onClick={handleUpdateIssue}>
                                    Save
                                </Button> }   

                                {!editing && 
                                <>
                                    {resolved ? <Button className="m-2 mr-5" variant="outline-secondary" onClick={() => {setEndNull()}}>
                                        Set Not Resolved
                                    </Button> :
                                    <Button className="m-2 mr-5" variant="secondary" onClick={() => {setEndNow()}}>
                                        Set Resolved
                                    </Button>
                                    }
                                </>
                                }
                                
                                <Button className="ms-2 my-2" variant="outline-secondary" onClick={toggleEdit}>
                                    {editing ? "Cancel" : "Edit Issue"}
                                </Button>   
                            </div>

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
                            <Form.Label>To (Setting "To" date will mark issue as resolved)</Form.Label>
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
                                defaultValue = {location.state && location.state.patientData.name}
                                disabled = {true}
                                type="text"
                            />                
                            </Form.Group>

                            <Form.Group className="m-2" controlId="exampleForm.ControlInput3">
                                <div className='text-center'>Resolved {resolved ? <Check2Square className="custom-color-success"/> : <Square className="custom-color-warning"/>} </div>
                                       
                            </Form.Group>

                                                                  
                        </Form>
                    </Tab>
                    <Tab title="Symptoms" eventKey="Symptoms">
                        <SymptomsList 
                            issueData={location.state ? location.state.issueData : null}
                            activeTab={activeTab}
                        />
                    </Tab> 
                    <Tab title="Interventions" eventKey="Interventions">
                        <InterventionsList issueData={location.state ? location.state.issueData : null}/>
                    </Tab>                    
                </Tabs>              
            </Container>            
        </Layout>
        </>
    );
};


export default IssueView;

