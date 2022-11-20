
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../auth';

const InterventionModal = (props) => {
    const [treatment, setTreatment] = useState("");
    const [duration, setDuration] = useState(null);
    const [notes, setNotes] = useState("");    
    const [therapistId, setTherapistId] = useState(1);      

    const auth = useAuth();

    const handleUpdateIntervention = (e) => {
        e.preventDefault();
        updateIntervention();
        props.hideModal();   
           
    }

    const handleDeleteIntervention = (e) => {
         e.preventDefault();
        deleteIntervention();
        props.hideModal();            
    }

    const updateIntervention = async () => {        
        const queryData = await supabase
            .from('interventions')
            .update({               
                treatment: treatment,
                duration: duration,
                notes: notes,
                therapist_id: therapistId,
                user_id: auth.user.id,
                issue_id: props.issueData.id
            })
            .eq('id', props.interventionData.id)

        if (queryData.error) {
            alert(queryData.error.message);
        } else {
            props.getInterventionsData(); 
        }
    }

     const deleteIntervention = async () => {
        const queryData = await supabase
            .from('interventions')
            .delete()
            .eq('id', props.interventionData.id)

        if (queryData.error) {
            alert(queryData.error.message);
        } else {
            props.getInterventionsData();    
        }     
                
    }

    useEffect(() => {       
        if (props.interventionData) {         

            setTreatment(props.interventionData.treatment);
            setNotes(props.interventionData.notes);
            setDuration(props.interventionData.duration);
            setTherapistId(props.interventionData.therapistId);
        } 
        
    }, [props.interventionData]);


    return (        
        <Modal centered backdrop="static" show={props.show} onHide={props.hideModal}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Edit Intervention</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form disabled={true} onSubmit={handleUpdateIntervention}>
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
                
                <Button className="m-2 " variant="secondary" onClick={props.hideModal}>
                    Close
                </Button>
               
                <Button className="m-2 mr-5" variant="danger" onClick={handleDeleteIntervention}>
                    Delete Symptom
                </Button>     

                <Button  className="m-2" variant="primary" type="submit">
                    Update Symptom
                </Button> 

            </Form>
            </Modal.Body>
        </Modal>
    );
};


export default InterventionModal;
