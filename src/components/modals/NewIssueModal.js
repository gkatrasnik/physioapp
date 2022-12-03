// basic patient info
// isues list (aslo show qucick symptom/intervention info)
// bodyPicture with issues/symptoms
// issue photos
// search issues?
// current (open) issues (maybe show only those on bodyPicture?)

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../auth';
import moment from 'moment';

const NewIssueModal = (props) => {
   // const auth = useAuth();
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [resolved, setResolved] = useState(false);
    const [diagnosis, setDiagnosis] = useState("");

    
    const auth = useAuth();

    const handleNewIssue = (e) => {
        e.preventDefault();
        addIssue();
        props.toggleShowNewIssue();
    }

    const addIssue = async () => {        
        console.log(props)
        const queryData = await supabase
            .from('issues')
            .insert({
                name: title,
                notes: notes,                
                diagnosis: diagnosis,
                patient_id: props.patientData.id,
                user_id: auth.user.id,
                start: start,
                end: resolved ? moment().toDate() : null,
                org_id: auth.user.user_metadata.org_id

                //last_changed - add this
            })

        if (queryData.error) {
            alert(queryData.error.message);
        }else {
            props.getIssuesData();
        }     
        
    }


    return (        
        <Modal centered backdrop="static" show={props.showNewIssue} onHide={props.toggleShowNewIssue}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Add New Issue</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form onSubmit={handleNewIssue}>
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    required
                    type="text"
                    autoFocus
                    onChange={(e) => {
                    setTitle(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    type="text"
                    onChange={(e) => {
                    setNotes(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                <Form.Label>From</Form.Label>
                <Form.Control
                    required
                    defaultValue={start}
                    type="datetime-local"                    
                    onChange={(e) => {
                    setStart(moment(e.target.value).toDate());
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput3">
                <Form.Label>Diagnosis</Form.Label>
                <Form.Control
                    type="text"
                    onChange={(e) => {
                    setDiagnosis(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput4">
                    <Form.Label>Resolved</Form.Label>
                    <Form.Check
                        checked = {resolved && resolved}
                        type="checkbox"
                        onChange={(e) => {
                        setResolved(e.target.checked);
                        }}
                    />                
                    </Form.Group>

                <Button className="m-2 " variant="secondary" onClick={props.toggleShowNewIssue}>
                    Close
                </Button>
                <Button className="m-2" variant="primary" type="submit">
                    Add Issue
                </Button>                

            </Form>
            </Modal.Body>
        </Modal>
    );
};


export default NewIssueModal;
