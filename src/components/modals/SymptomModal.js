//SYMPTOM MODAL

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../auth';

const SymptomModal = (props) => {
    const [name, setName] = useState("");
    const [intensity, setIntensity] = useState(0);
    const [duration, setDuration] = useState("");
    const [bodypartId, setBodypartId] = useState("");    

    const auth = useAuth();

    const handleUpdateSymptom = (e) => {
        e.preventDefault();
        updateSymptom();
        props.hideModal();   
           
    }

    const handleDeleteSymptom = (e) => {
         e.preventDefault();
        deleteSymptom();
        props.hideModal();            
    }

    const updateSymptom = async () => {        
        const queryData = await supabase
            .from('symptoms')
            .update({
                name: name,
                intensity: intensity,
                duration: duration,
                bodypart_id: bodypartId,
                issue_id: props.issueData.id,
                user_id: auth.user.id,
            })
            .eq('id', props.symptomData.id)

        if (queryData.error) {
            alert(queryData.error.message);
        } else {
            props.getSymptomsData(); 
        }
    }

     const deleteSymptom = async () => {
        const queryData = await supabase
            .from('symptoms')
            .delete()
            .eq('id', props.symptomData.id)

        if (queryData.error) {
            alert(queryData.error.message);
        } else {
            props.getSymptomsData();    
        }     
                
    }

    useEffect(() => {       
        if (props.symptomData) {
            setName(props.symptomData.name);
            setIntensity(props.symptomData.intensity)
            setDuration(props.symptomData.duration)
            setBodypartId(props.symptomData.bodypart_id)
        } 
        
    }, [props.symptomData]);


    return (        
        <Modal centered backdrop="static" show={props.show} onHide={props.hideModal}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Edit Symptom</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form disabled={true} onSubmit={handleUpdateSymptom}>
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                <Form.Label>Name</Form.Label>
                <Form.Control
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
                <Form.Control
                    type="number"
                    defaultValue={bodypartId}
                    onChange={(e) => {
                    setBodypartId(e.target.value);
                    }}
                />                
                </Form.Group>
                
                <Button className="m-2 " variant="secondary" onClick={props.hideModal}>
                    Close
                </Button>
               
                <Button className="m-2 mr-5" variant="danger" onClick={handleDeleteSymptom}>
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


export default SymptomModal;
