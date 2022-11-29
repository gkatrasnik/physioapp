//SYMPTOM MODAL

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../auth';

const NewSymptomModal = (props) => {
    const [name, setName] = useState("");
    const [intensity, setIntensity] = useState(0);
    const [duration, setDuration] = useState("");
    const [bodypartId, setBodypartId] = useState(null);    
    const [bodypartsList, setBodypartsList] = useState([]);

    const auth = useAuth();

    const handleNewSymptom = (e) => {
        e.preventDefault();
        addSymptom();
        props.toggleModal();              

        setName("");
        setIntensity(null);
        setDuration("");
        setBodypartId(null);
    }


    const addSymptom = async () => {        
        const queryData = await supabase
            .from('symptoms')
            .insert({
                name: name,
                intensity: intensity,
                duration: duration,
                bodypart_id: bodypartId,
                issue_id: props.issueData.id,
                user_id: auth.user.id,
                org_id: auth.user.user_metadata.org_id
            })

        if (queryData.error) {
            alert(queryData.error.message);
        } else {
            props.getSymptomsData();  
        }
    }

    const getBodypartsData = async() => {
        const queryData = await supabase
            .from('bodyparts')
            .select()          

        if (queryData.error) {
            alert(queryData.error.message);
        } else {
           setBodypartsList(queryData.data);   
        }     
    }

   
    useEffect(() => {
        setName("");
        setIntensity(0);
        setDuration("");
        setBodypartId(null);
        getBodypartsData();
    }, []);


    return (        
        <Modal centered backdrop="static" show={props.show} onHide={props.toggleModal}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Add New Symptom</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form disabled={true} onSubmit={handleNewSymptom} >
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                <Form.Label>Symptom</Form.Label>
                <Form.Control
                    required
                    type="text"
                    defaultValue={name}
                    autoFocus
                    onChange={(e) => {
                    setName(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput2">
                <Form.Label>Intensity</Form.Label>
                <Form.Control
                    type="number"
                    defaultValue={intensity}
                    onChange={(e) => {
                    setIntensity(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput3">
                <Form.Label>Duration</Form.Label>
                <Form.Control
                    type="text"
                    defaultValue={duration}
                    onChange={(e) => {
                    setDuration(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput4">
                <Form.Label>Body Part</Form.Label>                
                <Form.Select                  
                defaultValue={bodypartId}
                onChange={(e) => {
                setBodypartId(e.target.value);
                }}
                >
                {bodypartsList.map((part) => {
                    return <option value={part.id}>{part.body_side} {part.name}</option>
                })}
               
                </Form.Select>                                
                </Form.Group>
                
                <Button className="m-2 " variant="secondary" onClick={props.toggleModal}>
                    Close
                </Button>
                
                <Button className="m-2" variant="primary" type="submit">
                    Add Symptom
                </Button>     
               
            </Form>
            </Modal.Body>
        </Modal>
    );
};


export default NewSymptomModal;
