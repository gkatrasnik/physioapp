
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../contexts/auth';
import {useAppData} from "../../contexts/appDataContext";
import moment from 'moment';
import LoadingModal from "./LoadingModal"
import Select from 'react-select';



const NewAppointmentModal = (props) => {
    const auth = useAuth();
    const appData = useAppData();
    
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [patientId, setPatientId] = useState(null);
    const [patientObj, setPatientObj] = useState(null);
    const [title, setTitle] = useState("");
    const [patientFieldDisabled, setPatientFieldDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [durationM, setDurationM] = useState("0");
    const [therapistId, setTherapistId] = useState(null);
    const [languageSetting, setLanguageSetting] = useState(null);


    const handleSetPatientObj = (patientId) => {
        let patientObj = appData.orgPatients.find((patient) => patient.id === patientId);
        setPatientObj(patientObj ? patientObj : null);
    }

    const handleSendEmail = () => {
        if (!start) {
            return alert("Please pick appointment start");
        } 

        if (!(end > start)) {
            return alert("Please set appointment duration");
        }
        if (!patientId) {
            return alert("Please choose a patient");
        }

        let emailSubject;
        let emailBody;

        if (languageSetting === "eng") {
            emailSubject = `${appData.orgData.name} - New appointment`;        
            emailBody = "Hello!%0D%0A%0D%0AWe would like to inform you, that your new appointment is scheduled for " +start.toLocaleString("sl-SI") + ".%0D%0AYour therapist will be " + auth.userObj.name +".%0D%0AWe look forward to seeing you. %0D%0A%0D%0A"+ appData.orgData.name;
        } else {
            emailSubject = `${appData.orgData.name} - Nov termin`;        
            emailBody = "Pozdravljeni!%0D%0A%0D%0AObveščamo vas, da ste na termin naročeni " +start.toLocaleString("sl-SI") + ".%0D%0AVaš terapevt bo " + auth.userObj.name +".%0D%0AVeselimo se vašega obiska. %0D%0A%0D%0A"+ appData.orgData.name;
        }
       
        window.location.href ="mailto:" + patientObj.email + "?subject=" + emailSubject + "&body=" + emailBody;
    }

    const handleEmailLang = () => {
        let setting = localStorage.getItem("emailLang");

        if (!setting) {
            setting = "slo";                

            localStorage.setItem("emailLang", setting);
            console.log("no emailLang setting found, setting now to: ", setting);
        } 
                
        setLanguageSetting(setting);
    }

    const handleNewAppointment = (e) => {
        e.preventDefault();
        if (!start) {
            return alert("Please pick appointment start");
        } 
        
        if (!(end > start)) {
            return alert("Please set appointment duration");
        }
        if (!patientId) {
            return alert("Please choose a patient");
        }
       
        addAppointment();
        handleClose();
    }

    const handleClose = () => {
        props.toggleModal(); 
        setDurationM("0");
        setStart(null);
        setEnd(null);
        setPatientId(props.currentPatientData ? props.currentPatientData.id : null);  
        handleSetPatientObj(props.currentPatientData ? props.currentPatientData.id : null)
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
        //if durationM is not "0"
        if (parseInt(durationM)) {
            // if start is not null, end can be set by adding duration to start
            if (start) {
            setEnd(moment(start).add((parseInt(durationM)), 'm').toDate()); 
            } else {
                alert('Please set appointment "Start" first')
            }
        }
             
    },[durationM, start])

    //if NewAppointmentModalis opened from patientProfile, set patientId,
    useEffect(() => {
      if (props.currentPatientData) {
        setPatientId(props.currentPatientData.id);
        handleSetPatientObj(props.currentPatientData.id)
      }

      setTherapistId(auth.userObj.id);
      handleEmailLang(); //email template language setting handeling
    }, [])
    
    

    return (     
        <>   
        {loading && <LoadingModal />}

        <Modal centered backdrop="static" show={props.show} onHide={handleClose}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Add New Appointment</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form>
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                <Form.Label>Start</Form.Label>
                <Form.Control                    
                    defaultValue={moment(start).format("YYYY-MM-DDTHH:mm")}
                    type="datetime-local"                    
                    onChange={(e) => {
                    setStart(moment(e.target.value).toDate());
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                <Form.Label>Duration (min)</Form.Label>
                <div className="d-flex duration-picker">
                
                <Form.Control                    
                    type="number"
                    min="0"                    
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
                        ...baseStyles                        
                        }),
                    }}
                    options={appData.orgPatients}                    
                    defaultValue={appData.orgPatients.find((patient) => patient.id === patientId)}
                    isDisabled={patientFieldDisabled}
                    getOptionLabel={(option)=>option.name}
                    getOptionValue={(option)=>option.id}
                    onChange={(option) => {
                        setPatientId(option.id);
                        handleSetPatientObj(option.id);
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
                    {patientObj?.email && 
                    <Button className="m-2" variant="secondary" onClick={handleSendEmail}>
                        Send Email
                    </Button>}
                    
                    <Button className="m-2" variant="secondary" onClick={handleNewAppointment}>
                        Add Appointment
                    </Button>     
                    <Button className="ms-2 my-2" variant="outline-secondary" onClick={handleClose}>
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
