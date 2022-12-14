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
import { Container, Button, Form, Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../contexts/auth';
import { useAppData } from '../contexts/appDataContext';
import AppointmentsList from './AppointmentsList';
import IssueList from './IssueList';
import IssuesCalendar from './IssuesCalendar';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';
import LoadingModal from "./modals/LoadingModal"; 
import { useSwipeable } from 'react-swipeable';
import moment from "moment";


//for swipable tabs
const config = {
  delta: 50,                            // min distance(px) before a swipe starts
  preventDefaultTouchmoveEvent: false,  // call e.preventDefault *See Details*
  trackTouch: true,                     // track touch input
  trackMouse: false,                    // track mouse input
  rotationAngle: 0,                     // set a rotation angle
}

const tabs = ["Info", "Appointments", "Issues", "Issues Calendar"];


const PatientProfileView = () => {
    const auth = useAuth();
    const appData = useAppData();

    const location = useLocation();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [issuesData, setIssuesData] = useState([]);
    const [filteredIssuesData, setFilteredIssuesData] = useState([]);
    const [filterIssues, setFilterIssues] = useState(false);
    const [activeTab, setActiveTab] = useState(tabs.currentTab());



    //patient profile editing state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState(null);
    const [birthDate, setBirthDate] = useState(null);
    const [occupation, setOccupation] = useState("");

    const [showIssuesFrom, setShowIssuesFrom] = useState(null);



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
    const setLocalStatePatient = () => {
        setName(location.state.patientData.name);
        setEmail(location.state.patientData.email);
        setPhone(location.state.patientData.phone);
        setAddress(location.state.patientData.address);
        setCity(location.state.patientData.city);
        setZip(location.state.patientData.zip_code);
        setBirthDate(location.state.patientData.birthdate);
        setOccupation(location.state.patientData.occupation);
    }
    
    

    const handleDeletePatient = async (patientId) => {
        setLoading(true);
        await handleDeleteData();

        const queryData = await supabase
            .from('patients')
            .update({
                rec_deleted: true
            })
            .eq('id',patientId)

        if (queryData.error) {
            setLoading(false);
            alert(queryData.error.message);
        } else {
            setLoading(false); 
            appData.getOrgPatients();
            navigate("/patients");
            
        }   
        
    }

    
    const updatePatient = async () => {  
        setLoading(true);
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
                user_id: auth.userObj.id,
                org_id: auth.userObj.org_id
            })
            .eq('id', location.state.patientData.id)

        if (queryData.error) {
            setLoading(false);
            alert(queryData.error.message);
        }else {
            setLoading(false);
            appData.getOrgPatients(); 
        }            
        
    }

    const handleUpdatePatient = () => {
        updatePatient();
        setEditing(false);
    }

    const toggleEdit = () => {
        setEditing(!editing);
    }


    const toggleConfirmDelete = () => {
        setShowConfirmDelete(!showConfirmDelete);
    }



    // Issues logic 

    //delete all patients data. It is called on deletePatient
    const handleDeleteData = async () => {   
        setLoading(true);
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
                setLoading(false);
                alert(queryData.error.message);
            } else {
                setLoading(false);
                return queryData;
            } 
    }

    const deleteIssue = async (issueId) => {   
        setLoading(true); 
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
            setLoading(false);
            alert(queryData.error.message);
        } else {
            setLoading(false);
            return queryData;
        }           
    }

    //handle how old data we want to get, probably not all history - setting in options view
    const handleGetIssuesFrom = () => {
        let setting = localStorage.getItem("showIssuesForXYears");

        if (!setting) {
            setting = 1;                

            localStorage.setItem("showIssuesForXYears", setting);
            console.log("no showIssuesForXYears setting found, setting now to: ", setting);
        } 


        let showFromDate = moment().subtract(setting,'years').toISOString();                
        setShowIssuesFrom(showFromDate);
    }

    const getIssuesData = async () => {
        setLoading(true);
        const queryData = await supabase
            .from('issues')
            .select()
            .eq('patient_id',location.state.patientData.id)
            .eq("rec_deleted", false)
            .gt('start', showIssuesFrom)
            .order('start', { ascending: false })
        if (queryData.error) {
            setLoading(false);
            alert(queryData.error.message);
        }else {
            setLoading(false);
            setIssuesData(queryData.data);  
        } 
    }

    //filter issues list to only contain NOT resolved
    const handleFilterIssuesData = async() => {
        if (filterIssues) { // if switch is turned ON
            const newArr =  issuesData.filter((issue) => {
                //if event user_id = me, push to cloned arr
                return issue.end === null;
            })
            setFilteredIssuesData(newArr);

        } else { //if switch turned OFF show all issues
            setFilteredIssuesData(issuesData)
        }
    }

    const toggleFilterIssues = (value) => {
        setFilterIssues(value);
    }

    //in event change or switch change filter events
    useEffect(() => {
        handleFilterIssuesData();
    }, [issuesData, filterIssues])


    // useEffects
    useEffect(() => {
        setLocalStatePatient();
        handleGetIssuesFrom();
          
        window.scrollTo(0, 0);    
    }, []);

    useEffect(() => {
        if (showIssuesFrom) {
            getIssuesData();
        }        
    }, [showIssuesFrom])
  

    return (
        <>
        {loading && <LoadingModal />}

        <ConfirmDeleteModal
            show={showConfirmDelete}
            title={"Delete Patient"}
            message={"Do you really want to delete this patient and all of its data?"}
            callback={handleDeletePatient}
            callbackArgs={location.state ? location.state.patientData.id : null}
            cancelCallback={toggleConfirmDelete}            
        />
        <Layout>
            <Container fluid={true} className="min-h-100-without-navbar" {...handlers}>
                <h1 className="text-center custom-page-heading-1 mt-5 mb-4">Patient Profile {location.state ? (" - " + location.state.patientData.name) : null}</h1>
                
                <Tabs                     
                activeKey={activeTab} 
                onSelect={(tab) => handlerSetTab(tab)}
                fill                   
                >
                <Tab title="Info" eventKey="Info">
                    <Form className="my-3 mx-auto component-big">
                        <h2 className='text-center mt-4 mb-4'>Patient Info</h2>                            
                        <div className='buttons-container'>                               
                            {editing && <Button className="m-2 mr-5" variant="danger" onClick={toggleConfirmDelete}>
                                Delete
                            </Button>}
                            {editing && <Button  className="m-2" variant="secondary" type="submit" onClick={handleUpdatePatient}>
                                Save
                            </Button> }                                
                            <Button className="ms-2 my-2" variant="outline-secondary" onClick={toggleEdit}>
                                {editing ? "Cancel" : "Edit Patient"}
                            </Button> 
                        </div>              
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
                            setBirthDate(e.target.value);
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
                                
                    </Form>
                </Tab>
                <Tab title="Appointments" eventKey="Appointments">
                    <AppointmentsList
                        currentPatientData={location.state ? location.state.patientData : null}
                    />
                </Tab>
                <Tab title="Issues" eventKey="Issues">
                    <IssueList                         
                    getIssuesData={getIssuesData}
                    patientData={location.state ? location.state.patientData : null}
                    issuesData={filteredIssuesData}
                    filterIssues={filterIssues}
                    toggleFilterIssues={toggleFilterIssues}
                    />                        
                </Tab>
                <Tab title="Issues Calendar" eventKey="Issues Calendar">
                        <IssuesCalendar
                        issuesData={filteredIssuesData}
                        filterIssues={filterIssues}
                        toggleFilterIssues={toggleFilterIssues}
                    />
                </Tab>
            </Tabs>
            </Container>
        </Layout>
        </>
    );
};


export default PatientProfileView;
