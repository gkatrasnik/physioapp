
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../auth';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'
import ConfirmDeleteModal from './ConfirmDeleteModal';
import LoadingModal from "./LoadingModal"


const AppointmentModal = (props) => {
    
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [patientId, setPatientId] = useState(null);
    const [title, setTitle] = useState("");
    const [eventPatient, setEventPatient] = useState(null);
    const [showToPatientBtn, setShowToPatientBtn] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(false);


    const auth = useAuth();
    const navigate = useNavigate();

    const toggleConfirmDelete = () => {
        setShowConfirmDelete(!showConfirmDelete);
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
        navigate('/patient',{state:{patientData:patient}});
        console.log("patient" , patient)
    }
   
    const findEventPatient = () => {
        const eventPatient = props.patientsData.find(patient => patient.id === props.currentEvent.patient_id);
        console.log("eventPatient", eventPatient)
        console.log("props.patientsData", props.patientsData)
        console.log("props.currentEvent", props.currentEvent)
        setEventPatient(eventPatient);
    }

   
    useEffect(() => {
        
        if (props.currentEvent) {
            findEventPatient(); //to fill up fields on modal

            setStart(props.currentEvent.start);
            setEnd(props.currentEvent.end);
            setPatientId(props.currentEvent.patient_id);
            setTitle(props.currentEvent.title);
        }  

        let url = window.location.href;
        setShowToPatientBtn(!url.includes("/patient"))
        
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

        <Modal centered backdrop="static" show={props.show} onHide={props.hideAppointmentModal}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Appointment</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form   >
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                <Form.Label>From</Form.Label>
                <Form.Control
                    disabled={true}
                    required
                    value={moment(start).toDate().toLocaleString("sl")}
                    type="text"                 
                    
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                <Form.Label>To</Form.Label>
                <Form.Control
                    disabled={true}
                    required
                    type="text"
                    value={moment(end).toDate().toLocaleString("sl")}                    
                    
                />                       
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput3">
                <Form.Label>Patient</Form.Label>
               <Form.Select 
                 disabled={true}
                 defaultValue={patientId}                
                 >
                {props.patientsData.map((patient) => {
                    return <option key={patient.id} value={patient.id}>{patient.name}</option>
                })}               
                </Form.Select>     
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    disabled={true}
                    type="text"
                    defaultValue={title}
                />                
                </Form.Group>
                
                <Button className="m-2 " variant="secondary" onClick={props.hideAppointmentModal}>
                    Close
                </Button>
                
                <Button className="m-2" variant="danger" onClick={toggleConfirmDelete}>
                   Delete
                </Button> 
                
                {showToPatientBtn &&
                <Button className="m-2" variant="primary" onClick={()=>{toPatientProfile(eventPatient)}}>
                    Patient Profile
                </Button>}     

                
               
            </Form>
            </Modal.Body>
        </Modal>
        </>
    );
};


export default AppointmentModal;
