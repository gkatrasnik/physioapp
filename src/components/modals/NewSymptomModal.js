//SYMPTOM MODAL

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../auth';
import LoadingModal from "./LoadingModal"
import Select from 'react-select';


const NewSymptomModal = (props) => {
    const [name, setName] = useState("");
    const [intensity, setIntensity] = useState(0);
    const [duration, setDuration] = useState("");
    const [bodypartId, setBodypartId] = useState(1);    
    const [bodypartsList, setBodypartsList] = useState([]);
    const [loading, setLoading] = useState(false);
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
        setLoading(true);       
        const queryData = await supabase
            .from('symptoms')
            .insert({
                name: name,
                intensity: intensity,
                duration: duration,
                bodypart_id: bodypartId,
                issue_id: props.issueData.id,
                user_id: auth.user.id,
                org_id: auth.user.user_metadata.org_id,
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

    const getBodypartsData = async() => {
        setLoading(true); 
        const queryData = await supabase
            .from('bodyparts')
            .select()    
            .eq('rec_deleted', false)      

        if (queryData.error) {
            setLoading(false); 
            alert(queryData.error.message);
        } else {
            setLoading(false); 
            const arr = queryData.data.map((bodypart) => {
                bodypart.label = bodypart.body_side ? bodypart.body_side + " " + bodypart.name : bodypart.name
                return bodypart
            })
            setBodypartsList(arr);
        }     
    }
   
    useEffect(() => {
        setName("");
        setIntensity(0);
        setDuration("");
        setBodypartId(1);
        getBodypartsData();
    }, []);


    return (        
        <>
        {loading && <LoadingModal />}
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
                        ...baseStyles,
                        borderRadius: 0,
                        }),
                    }}
                    options={bodypartsList}          
                    defaultValue={bodypartsList.find((bodypart) => bodypart.id === bodypartId)}
                    getOptionLabel={(option)=>option.label}
                    getOptionValue={(option)=>option.id}                    
                    onChange={(option) => {
                        setBodypartId(option.id);
                    }}
                >
                </Select>                          
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
        </>
    );
};


export default NewSymptomModal;
