
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../contexts/auth';
import { useAppData } from '../../contexts/appDataContext';
import LoadingModal from "./LoadingModal";
import Select from 'react-select';


const NewInterventionModal = (props) => {
    const auth = useAuth();
    const appData = useAppData();
    
    const [treatment, setTreatment] = useState("");
    const [duration, setDuration] = useState("");
    const [notes, setNotes] = useState("");    
    const [loading, setLoading] = useState(false);
    const [therapistId, setTherapistId] = useState(null);
    

    const handleNewIntervention = (e) => {
        e.preventDefault();
        addIntervention();
        props.toggleModal();         
        
        setTreatment("");
        setDuration("");
        setNotes("");
    }

    const handleClose = () => {
        props.toggleModal();
        setTreatment("");
        setNotes("");
        setDuration(null);
        setTherapistId(auth.userObj.id);
    }


    const addIntervention = async () => { 
        setLoading(true);       
        const queryData = await supabase
            .from('interventions')
            .insert({
                treatment: treatment,
                duration: duration,
                notes: notes,
                user_id: therapistId,
                issue_id: props.issueData.id,
                org_id: auth.userObj.org_id,
                rec_deleted: false
            })

        if (queryData.error) {
            setLoading(false); 
            alert(queryData.error.message);
        } else {
            setLoading(false); 
            props.getInterventionsData();
        }
    }

   
    useEffect(() => {
        setTreatment("");
        setNotes("");
        setDuration(null);
        setTherapistId(auth.userObj.id);
    }, []);


    return (        
        <>
        {loading && <LoadingModal />}

        <Modal centered backdrop="static" show={props.show} onHide={handleClose}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Add New Intervention</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form disabled={true}>
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                <Form.Label>Treatment</Form.Label>
                <Form.Control
                    required
                    type="text"
                    defaultValue={treatment}
                    autoFocus
                    onChange={(e) => {
                    setTreatment(e.target.value);
                    }}
                />                
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


                <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                <Form.Label>Duration</Form.Label>
                <Form.Control
                    type="text"
                    defaultValue={duration}
                    onChange={(e) => {
                    setDuration(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                    type="text"
                    as="textarea" rows={5}
                    defaultValue={notes}
                    onChange={(e) => {
                    setNotes(e.target.value);
                    }}
                />                
                </Form.Group>
                <div className='buttons-container'>
                    <Button className="m-2" variant="secondary" onClick={handleNewIntervention}>
                        Add Intervention
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


export default NewInterventionModal;
