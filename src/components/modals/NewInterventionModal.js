
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../auth';

const NewInterventionModal = (props) => {
    const [treatment, setTreatment] = useState("");
    const [duration, setDuration] = useState(null);
    const [notes, setNotes] = useState("");    
    const [therapistId, setTherapistId] = useState(null);    

    const auth = useAuth();

    const handleNewIntervention = (e) => {
        e.preventDefault();
        addIntervention();
        props.toggleModal();                
    }


    const addIntervention = async () => {        
        const queryData = await supabase
            .from('interventions')
            .insert({
                treatment: treatment,
                duration: duration,
                notes: notes,
                therapist_id: therapistId,
                user_id: auth.user.id,
                issue_id: props.issueData.id,
                org_id: auth.userObj.org_id
            })

        if (queryData.error) {
            alert(queryData.error.message);
        } else {
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
        <Modal centered backdrop="static" show={props.show} onHide={props.toggleModal}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Add New Intervention</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form disabled={true} onSubmit={handleNewIntervention} >
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                <Form.Label>Treatment</Form.Label>
                <Form.Control
                    type="text"
                    defaultValue={treatment}
                    autoFocus
                    onChange={(e) => {
                    setTreatment(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                <Form.Label>Duration</Form.Label>
                <Form.Control
                    type="number"
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
                    as="textarea" rows={4}
                    defaultValue={notes}
                    onChange={(e) => {
                    setNotes(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput4">
                <Form.Label>Therapist</Form.Label>
                <Form.Control
                    type="number"
                    defaultValue={1}
                    onChange={(e) => {
                    setTherapistId(e.target.value);
                    }}
                />                
                </Form.Group>
                
                <Button className="m-2 " variant="secondary" onClick={props.toggleModal}>
                    Close
                </Button>
                
                <Button className="m-2" variant="primary" type="submit">
                    Add Intervention
                </Button>     
               
            </Form>
            </Modal.Body>
        </Modal>
    );
};


export default NewInterventionModal;
