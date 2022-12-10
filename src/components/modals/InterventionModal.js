
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../auth';
import ConfirmDeleteModal from './ConfirmDeleteModal';


const InterventionModal = (props) => {
    const [editing, setEditing] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const [treatment, setTreatment] = useState("");
    const [duration, setDuration] = useState("");
    const [notes, setNotes] = useState("");    

    const auth = useAuth();

    const toggleConfirmDelete = () => {
        setShowConfirmDelete(!showConfirmDelete);
    }

    const toggleEditing = () => {
        setEditing(!editing)
    }

    const handleClose = () => {
        props.hideModal();
        setEditing(false);
    }

    const handleUpdateIntervention = (e) => {
        e.preventDefault();
        updateIntervention();
        props.hideModal();   
        setEditing(false);    
    }

    const handleDeleteIntervention = () => {
        deleteIntervention();
        props.hideModal();  
        setEditing(false);          
    }

    const updateIntervention = async () => {        
        const queryData = await supabase
            .from('interventions')
            .update({               
                treatment: treatment,
                duration: duration,
                notes: notes,
                user_id: auth.user.id,
                issue_id: props.issueData.id,
                org_id: auth.user.user_metadata.org_id
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
            .update({
                rec_deleted: true
            })
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
        } 
        
    }, [props.interventionData]);


    return (        
        <>
        <ConfirmDeleteModal
            show={showConfirmDelete}
            title={"Delete Intervention"}
            message={"Do you really want to delete this intervention?"}
            callback={handleDeleteIntervention}
            cancelCallback={toggleConfirmDelete}
        />

        <Modal centered backdrop="static" show={props.show} onHide={props.hideModal}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Intervention</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form onSubmit={handleUpdateIntervention}>
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                <Form.Label>Treatment</Form.Label>
                <Form.Control
                    type="text"
                    defaultValue={treatment}
                    disabled={!editing}
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
                    disabled={!editing}
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
                    disabled={!editing}
                    onChange={(e) => {
                    setNotes(e.target.value);
                    }}
                />                
                </Form.Group>

                 
                <Button className="m-2 " variant="secondary" onClick={handleClose}>
                    {!editing ? "Close" : "Cancel"}
                </Button>
               {editing ? 
                    <>     
                        <Button  className="m-2" variant="primary" type="submit">
                            Update
                        </Button> 
                        <Button className="m-2 mr-5" variant="danger" onClick={toggleConfirmDelete}>
                            Delete
                        </Button>
                    </> :                
                    <Button className="m-2 " variant="secondary" onClick={toggleEditing}>
                            Edit
                    </Button>
                }

            </Form>
            </Modal.Body>
        </Modal>
        </>
    );
};


export default InterventionModal;
