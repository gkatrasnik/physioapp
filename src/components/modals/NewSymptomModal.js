//SYMPTOM MODAL

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../contexts/auth';
import { useAppData } from '../../contexts/appDataContext';
import LoadingModal from "./LoadingModal"
import Select from 'react-select';


const NewSymptomModal = (props) => {
    const auth = useAuth();
    const appData = useAppData();

    const [name, setName] = useState("");
    const [intensity, setIntensity] = useState(0);
    const [duration, setDuration] = useState("");
    const [bodypartId, setBodypartId] = useState(1);    
    const [loading, setLoading] = useState(false);
    

    const handleNewSymptom = (e) => {
        e.preventDefault();
        addSymptom();
        props.toggleModal();              

        setName("");
        setIntensity(null);
        setDuration("");
        setBodypartId(null);
    }

    const handleClose = () => {
        props.toggleModal();
        setName("");
        setIntensity(0);
        setDuration("");
        setBodypartId(1); 
    }

    const addSymptom = async () => {  
        setLoading(true);       
        const queryData = await supabase
            .from('symptoms')
            .insert({
                name: name,
                intensity: intensity,
                duration: duration,
                bodypart_id: bodypartId,
                issue_id: props.issueData.id,
                user_id: auth.userObj.id,
                org_id: auth.userObj.org_id,
                rec_deleted: false
            })

        if (queryData.error) {
            setLoading(false); 
            alert(queryData.error.message);
        } else {
            setLoading(false); 
            props.getSymptomsData();  
        }
    }   
   
    useEffect(() => {
        setName("");
        setIntensity(0);
        setDuration("");
        setBodypartId(1);        
    }, []);


    return (        
        <>
        {loading && <LoadingModal />}
        <Modal centered backdrop="static" show={props.show} onHide={handleClose}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Add New Symptom</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form disabled={true}>
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
                <Form.Label>Intensity ({intensity})</Form.Label>
                <Form.Range
                    name="intensity"
                    label={intensity}                   
                    min={0}
                    max={10}
                    defaultValue={intensity}
                    onChange={(e) => {
                    setIntensity(e.target.valueAsNumber);
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
                <Select
                    styles={{
                        control: (baseStyles, state) => ({
                        ...baseStyles                        
                        }),
                    }}
                    options={appData.bodyParts}          
                    defaultValue={appData.bodyParts.find((bodypart) => bodypart.id === bodypartId)}
                    getOptionLabel={(option)=>option.label}
                    getOptionValue={(option)=>option.id}                    
                    onChange={(option) => {
                        setBodypartId(option.id);
                    }}
                >
                </Select>                          
                </Form.Group>
                <div className='buttons-container'>
                    <Button className="m-2" variant="secondary" onClick={handleNewSymptom}>
                        Add Symptom
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


export default NewSymptomModal;
