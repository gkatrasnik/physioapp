
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../auth';
import moment from 'moment';

const NewAppointmentModal = (props) => {
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [patientId, setPatientId] = useState(1);
    const [title, setTitle] = useState("");
    const [patientFieldDisabled, setPatientFieldDisabled] = useState(false);


    const auth = useAuth();

    const handleNewAppointment = (e) => {
        e.preventDefault();
        if (!(end > start)) {
            return alert("Please set appointment duration")
        }
       
        addAppointment();
        props.toggleModal(); 
        setStart(null);
        setEnd(null);
        setPatientId(null);
        setTitle("");
    }


    const addAppointment = async () => {        
        const queryData = await supabase
            .from('appointments')
            .insert({
                start: start,
                end: end,
                patient_id: patientId,
                title: title,
                user_id: auth.user.id,
                org_id: auth.user.user_metadata.org_id,
                rec_deleted: false
            })

        if (queryData.error) {
            alert(queryData.error.message);
        } else {
            props.getEvents();
        }
    }

   
    useEffect(() => {
        if (props.selectedSlot) {
            setStart(props.selectedSlot.start);
        }
        let url = window.location.href;
        setPatientFieldDisabled(url.includes("/patient"))
    }, [props.selectedSlot]);
    

    return (        
        <Modal centered backdrop="static" show={props.show} onHide={props.toggleModal}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Add New Appointment</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form disabled={true} onSubmit={handleNewAppointment} >
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                <Form.Label>From</Form.Label>
                <Form.Control
                    required
                    defaultValue={moment(start).format("YYYY-MM-DDTHH:mm")}
                    type="datetime-local"                    
                    onChange={(e) => {
                    setStart(moment(e.target.value).toDate());
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                <Form.Label>Duration (h:m)</Form.Label>
                <Form.Control
                    required
                    type="time"
                    defaultValue={"00:00"}                    
                    onChange={(e) => {
                    setEnd(moment(start).add(e.target.valueAsNumber, 'ms').toDate());                    
                    }}
                />                       
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput3">
                <Form.Label>Patient</Form.Label>
               <Form.Select 
                 disabled={patientFieldDisabled}
                 defaultValue={patientId}
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
                    defaultValue={title}
                    onChange={(e) => {
                    setTitle(e.target.value);
                    }}
                />                
                </Form.Group>
                
                <Button className="m-2 " variant="secondary" onClick={props.toggleModal}>
                    Close
                </Button>
                
                <Button className="m-2" variant="primary" type="submit">
                    Add Appointment
                </Button>     
               
            </Form>
            </Modal.Body>
        </Modal>
    );
};


export default NewAppointmentModal;
