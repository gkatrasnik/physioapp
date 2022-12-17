
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../auth';
import LoadingModal from "./LoadingModal"


const NewInterventionModal = (props) => {
    const [treatment, setTreatment] = useState("");
    const [duration, setDuration] = useState("");
    const [notes, setNotes] = useState("");    
    const [loading, setLoading] = useState(false);

    const auth = useAuth();

    const handleNewIntervention = (e) => {
        e.preventDefault();
        addIntervention();
        props.toggleModal();         
        
        setTreatment("");
        setDuration("");
        setNotes("");
    }


    const addIntervention = async () => { 
        setLoading(true);       
        const queryData = await supabase
            .from('interventions')
            .insert({
                treatment: treatment,
                duration: duration,
                notes: notes,
                user_id: auth.user.id,
                issue_id: props.issueData.id,
                org_id: auth.user.user_metadata.org_id,
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
    }, []);


    return (        
        <>
        {loading && <LoadingModal />}

        <Modal centered backdrop="static" show={props.show} onHide={props.toggleModal}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Add New Intervention</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form disabled={true} onSubmit={handleNewIntervention} >
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
                    <Button className="m-2" variant="primary" type="submit">
                        Add Intervention
                    </Button>
                    <Button className="m-2 " variant="secondary" onClick={props.toggleModal}>
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
