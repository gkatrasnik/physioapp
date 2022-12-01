
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../auth';
import { useNavigate } from 'react-router-dom';


const AppointmentModal = (props) => {
    
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [patientId, setPatientId] = useState(null);
    const [title, setTitle] = useState("");
    const [eventPatient, setEventPatient] = useState(null);

    const auth = useAuth();
    const navigate = useNavigate();

    const handleDeleteAppointment = (e) => {
        e.preventDefault();
        deleteAppointment();
        props.hideAppointmentModal();             
    }


    const deleteAppointment = async () => {        
        const queryData = await supabase
            .from('appointments')
            .delete()
            .eq('id', props.currentEvent.id)

        if (queryData.error) {
            alert(queryData.error.message);
        } else {
            props.getEvents();
        }
    }

    const toPatientProfile=(patient)=>{
        navigate('/patient',{state:{patientData:patient}});
    }
   
    const findEventPatient = () => {
        const eventPatient = props.patientsData.find(patient => patient.id === props.currentEvent.patient_id);
        setEventPatient(eventPatient);
    }

   
    useEffect(() => {
        findEventPatient(); 
        if (props.currentEvent) {
            setStart(props.currentEvent.start);
            setEnd(props.currentEvent.end);
            setPatientId(props.currentEvent.patient_id);
            setTitle(props.currentEvent.title);
        }  
        
    }, [props.currentEvent]);

    return (        
        <Modal centered backdrop="static" show={props.show} onHide={props.hideAppointmentModal}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Appointment</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form disabled={true}  >
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                <Form.Label>From</Form.Label>
                <Form.Control
                    required
                    defaultValue={props.currentEvent.start}
                    type="datetime-local"                    
                    onChange={(e) => {
                    setStart(new Date(e.target.value));
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                <Form.Label>To</Form.Label>
                <Form.Control
                    required
                    type="datetime-local"
                    defaultValue={props.currentEvent.end}                    
                    onChange={(e) => {
                    setEnd(new Date(e.target.value));
                    }}
                />                       
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput3">
                <Form.Label>Patient</Form.Label>
               <Form.Select 
                 defaultValue={props.currentEvent.patient_id}
                 onChange={(e) => {
                    setPatientId(e.target.value);
                 }}
                 >
                {props.patientsData.map((patient) => {
                    return <option key={patient.id} value={patient.id}>{patient.name}</option>
                })}               
                </Form.Select>     
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    defaultValue={props.currentEvent.title}
                    onChange={(e) => {
                    setTitle(e.target.value);
                    }}
                />                
                </Form.Group>
                
                <Button className="m-2 " variant="secondary" onClick={props.hideAppointmentModal}>
                    Close
                </Button>
                
                <Button className="m-2" variant="primary" onClick={()=>{toPatientProfile(eventPatient)}}>
                    Patient Profile
                </Button>     

                <Button className="m-2" variant="primary" onClick={handleDeleteAppointment}>
                   Delete
                </Button> 
               
            </Form>
            </Modal.Body>
        </Modal>
    );
};


export default AppointmentModal;
