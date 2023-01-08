
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'
import ConfirmDeleteModal from './ConfirmDeleteModal';
import LoadingModal from "./LoadingModal"
import Select from "react-select"
import { useAuth } from '../../contexts/auth';
import {useAppData} from "../../contexts/appDataContext";



const AppointmentModal = (props) => {
    const auth = useAuth();
    const appData = useAppData();

    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [patientId, setPatientId] = useState(null);
    const [title, setTitle] = useState("");
    const [eventPatient, setEventPatient] = useState(null);
    const [showToPatientBtn, setShowToPatientBtn] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [therapistId, setTherapistId] = useState(null);


    const navigate = useNavigate();
    

    const toggleConfirmDelete = () => {
        setShowConfirmDelete(!showConfirmDelete);
        setEditingFalse();
    }

    const handleDeleteAppointment = () => {       
       deleteAppointment();      
       props.hideAppointmentModal();             
    }


    const deleteAppointment = async () => {    
        setLoading(true);    
        const queryData = await supabase
            .from('appointments')
            .update({
                rec_deleted: true
            })
            .eq('id', props.currentEvent.id)

        if (queryData.error) {
            setLoading(false);
            alert(queryData.error.message);
        } else {
            setLoading(false);
            props.getEvents();
        }
    }

    const toPatientProfile=(patient)=>{
        navigate('/profile',{state:{patientData:patient}});
        setEditingFalse();
    }
   
    const findEventPatient = (searchedPatientId) => {
        const eventPatient = appData.orgPatients.find(patient => patient.id === searchedPatientId);
        setEventPatient(eventPatient);
    }

    const updateAppointment = async () => {  
        setLoading(true);
        const queryData = await supabase
            .from('appointments')
            .update({
                start: start,
                end: end,
                patient_id: patientId,
                title: title,
                user_id: therapistId,
                org_id: auth.userObj.org_id,
                rec_deleted: false
            })
            .eq('id', props.currentEvent.id)

        if (queryData.error) {
            setLoading(false);
            alert(queryData.error.message);
        }else {
            setLoading(false);
            props.getEvents();
        }            
        
    }

    const setEditingTrue = () => {
        setEditing(true);
    }
    
    const setEditingFalse = () => {
        setEditing(false);
    }

    const handleCloseBtn = () => {
        props.hideAppointmentModal();
        setEditingFalse();
    }

    const onPatientProfile = () => {
        let url = window.location.href;
        return url.includes("/profile")
    }

    const handleUpdateAppointment = () => {
        if (!start || !end || start >= end) {
            return alert('Please adjust "From" and "To" dates');
        }

        if (!title) {
            return alert('Please add appointment title');
        }

        updateAppointment();        
        findEventPatient(patientId);
        props.hideAppointmentModal();
        setEditingFalse();
    }

    useEffect(() => {
        
        if (props.currentEvent) {
            findEventPatient(props.currentEvent.patient_id); //to fill up fields on modal

            setStart(props.currentEvent.start);
            setEnd(props.currentEvent.end);
            setPatientId(props.currentEvent.patient_id);
            setTitle(props.currentEvent.title);
            setTherapistId(props.currentEvent.user_id)
        }  
        
        setShowToPatientBtn(!onPatientProfile());
        
    }, [props.currentEvent]);

    return (        
        <>
        {loading && <LoadingModal />}

        <ConfirmDeleteModal
            show={showConfirmDelete}
            title={"Delete Appointment"}
            message={"Do you really want to delete this appointment?"}
            callback={handleDeleteAppointment}
            cancelCallback={toggleConfirmDelete}
        />

        <Modal centered backdrop="static" show={props.show} onHide={handleCloseBtn}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Appointment</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form>
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                <Form.Label>Start</Form.Label>
                <Form.Control
                    disabled={!editing}                    
                    defaultValue={moment(start).format("YYYY-MM-DDTHH:mm")}
                    type="datetime-local"                
                    onChange={(e) => {
                    setStart(moment(e.target.value).toDate());
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                <Form.Label>To</Form.Label>
                <Form.Control
                    disabled={!editing}                    
                    defaultValue={moment(end).format("YYYY-MM-DDTHH:mm")}
                    type="datetime-local"                   
                    onChange={(e) => {
                    setEnd(moment(e.target.value).toDate());
                    }}
                />                       
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput3">
                <Form.Label>Patient</Form.Label>                
                <Select
                    styles={{
                        control: (baseStyles, state) => ({
                        ...baseStyles
                        }),
                    }}
                    options={appData.orgPatients}                    
                    defaultValue={appData.orgPatients.find((patient) => patient.id === patientId)}
                    isDisabled={!editing}
                    getOptionLabel={(option)=>option.name}
                    getOptionValue={(option)=>option.id}
                    onChange={(option) => {
                        setPatientId(option.id);
                    }}
                >
                </Select>
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput4">
                <Form.Label>Therapist</Form.Label>                  
                <Select
                    styles={{
                        control: (baseStyles, state) => ({
                        ...baseStyles
                        }),
                    }}
                    options={appData.orgUsers}                    
                    defaultValue={appData.orgUsers.find((user) => user.id === therapistId)}
                    isDisabled={!editing}
                    getOptionLabel={(option)=>option.name}
                    getOptionValue={(option)=>option.id}
                    onChange={(option) => {
                        setTherapistId(option.id);
                    }}
                >
                </Select>
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                <Form.Label>Title</Form.Label>
                <Form.Control                    
                    disabled={!editing}
                    type="text"
                    defaultValue={title}
                    onChange={(e) => {
                    setTitle(e.target.value);
                    }}
                />                
                </Form.Group>
                <div className='buttons-container'>      
                {editing ?        
                    <>  
                    <Button className="m-2" variant="danger" onClick={toggleConfirmDelete}>
                        Delete
                    </Button> 

                    <Button className="m-2" variant="secondary" onClick={handleUpdateAppointment}>
                        Save
                    </Button> 
                    </> :
                    <Button className="m-2" variant="outline-secondary" onClick={setEditingTrue}>
                        Edit
                    </Button> 
                }     
                    {showToPatientBtn && !editing &&
                    <Button className="m-2" variant="secondary" onClick={()=>{toPatientProfile(eventPatient)}}>
                        Patient Profile
                    </Button>}    

                    <Button className="ms-2 my-2" variant="outline-secondary" onClick={handleCloseBtn}>
                        Close
                    </Button>
                </div>
               
            </Form>
            </Modal.Body>
        </Modal>
        </>
    );
};


export default AppointmentModal;
