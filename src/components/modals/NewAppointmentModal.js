
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../auth';
import moment from 'moment';
import LoadingModal from "./LoadingModal"
import Select from 'react-select';



const NewAppointmentModal = (props) => {
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [patientId, setPatientId] = useState(1);
    const [title, setTitle] = useState("");
    const [patientFieldDisabled, setPatientFieldDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [durationH, setDurationH] = useState("0");
    const [durationM, setDurationM] = useState("0");
    const [therapistId, setTherapistId] = useState(null);



    const auth = useAuth();

    const handleNewAppointment = (e) => {
        e.preventDefault();
        if (!(end > start)) {
            return alert("Please set appointment duration");
        }
        if (!patientId) {
            return alert("Please choose a patient");
        }
       
        addAppointment();
        props.toggleModal(); 
        setDurationH("0");
        setDurationM("0");
        setStart(null);
        setEnd(null);
        setPatientId(props.currentPatientData ? props.currentPatientData.id : 1);  
        setTitle("");        
    }


    const addAppointment = async () => {  
        setLoading(true);      
        const queryData = await supabase
            .from('appointments')
            .insert({
                start: start,
                end: end,
                patient_id: patientId,
                title: title,
                user_id: therapistId,
                org_id: auth.userObj.org_id,
                rec_deleted: false
            })

        if (queryData.error) {
            setLoading(false);     
            alert(queryData.error.message);
        } else {
            setLoading(false);     
            props.getEvents();
        }
    }

   
    useEffect(() => {
        if (props.selectedSlot) {
            setStart(props.selectedSlot.start);
        }
        let url = window.location.href;
        setPatientFieldDisabled(url.includes("/profile"))
    }, [props.selectedSlot]);

    useEffect(()=>{
        //if durationM and durationH are not "0"
        if (parseInt(durationH) || parseInt(durationM)) {

            // if start is not null, end can be set by adding duration to start
            if (start) {
            setEnd(moment(start).add((parseInt(durationH)*60 + parseInt(durationM)), 'm').toDate()); 
            } else {
                alert('Please set appointment "Start" first')
            }
        }
             
    },[durationH, durationM, start])

    //if NewAppointmentModalis opened from patientProfile, set patientId,
    useEffect(() => {
      if (props.currentPatientData) {
        setPatientId(props.currentPatientData.id);
      }
      setTherapistId(auth.userObj.id);
    }, [])
    
    

    return (     
        <>   
        {loading && <LoadingModal />}

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
                <div className="d-flex duration-picker">
                <Form.Control
                    required
                    type="number"
                    min="0"                    
                    defaultValue={durationH}                    
                    onChange={(e) => {
                    setDurationH(e.target.value)                  
                    }}
                />
                <Form.Control
                    required
                    type="number"
                    min="0"
                    max="59"
                    defaultValue={durationM}                    
                    onChange={(e) => setDurationM(e.target.value)}
                />   
                </div>                       
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput3">
                <Form.Label>Patient</Form.Label>                  
                <Select
                    styles={{
                        control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderRadius: 0,
                        }),
                    }}
                    options={props.patientsData}                    
                    defaultValue={props.patientsData.find((patient) => patient.id === patientId)}
                    isDisabled={patientFieldDisabled}
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
                        ...baseStyles,
                        borderRadius: 0,
                        }),
                    }}
                    options={props.usersData}                    
                    defaultValue={props.usersData.find((user) => user.id === therapistId)}
                    isDisabled={false}
                    getOptionLabel={(option)=>option.name}
                    getOptionValue={(option)=>option.id}
                    onChange={(option) => {
                        setTherapistId(option.id);                        
                    }}
                >
                </Select>
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput5">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    defaultValue={title}
                    onChange={(e) => {
                    setTitle(e.target.value);
                    }}
                />                
                </Form.Group>
                <div className='buttons-container'>
                    <Button className="m-2" variant="secondary" type="submit">
                        Add Appointment
                    </Button>     
                    <Button className="ms-2 my-2" variant="outline-secondary" onClick={props.toggleModal}>
                        Close
                    </Button>
                </div>
            </Form>
            </Modal.Body>
        </Modal>
        </>
    );
};


export default NewAppointmentModal;
