//SYMPTOM MODAL

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../auth';

const SymptomModal = (props) => {
    const [editing, setEditing] = useState(false);

    const [name, setName] = useState("");
    const [intensity, setIntensity] = useState(0);
    const [duration, setDuration] = useState("");
    const [bodypartId, setBodypartId] = useState(0);    
    const [bodypartsList, setBodypartsList] = useState([]);

    const auth = useAuth();

    const toggleEditing = () => {
        setEditing(!editing)
    }

    const handleClose = () => {
        props.hideModal();
        setEditing(false);
    }

    const handleUpdateSymptom = (e) => {
        e.preventDefault();
        updateSymptom();
        props.hideModal();   
        setEditing(false);   
    }

    const handleDeleteSymptom = (e) => {
         e.preventDefault();
        deleteSymptom();
        props.hideModal();
        setEditing(false);            
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
                org_id: auth.user.user_metadata.org_id
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

    const getBodypartsData = async() => {
        const queryData = await supabase
            .from('bodyparts')
            .select()          

        if (queryData.error) {
            alert(queryData.error.message);
        } else {
           setBodypartsList(queryData.data) ;   
        }     
    }

    useEffect(() => {       
        if (props.symptomData) {
            setName(props.symptomData.name);
            setIntensity(props.symptomData.intensity);
            setDuration(props.symptomData.duration);
            setBodypartId(props.symptomData.bodypart_id);
        } 
        
    }, [props.symptomData]);

    useEffect(() => {
      getBodypartsData();
    }, [])
    


    return (        
        <Modal centered backdrop="static" show={props.show} onHide={props.hideModal}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Symptom</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form onSubmit={handleUpdateSymptom}>
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                <Form.Label>Symptom</Form.Label>
                <Form.Control
                    type="text"
                    defaultValue={name}
                    disabled={!editing}
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
                    disabled={!editing}
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
                    disabled={!editing}
                    onChange={(e) => {
                    setDuration(e.target.value);
                    }}
                />                
                </Form.Group>

                <Form.Group className="mb-1" controlId="exampleForm.ControlInput4">
                <Form.Label>Body Part</Form.Label>                
                 <Form.Select 
                 disabled={!editing}
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

                <Button className="m-2 " variant="secondary" onClick={handleClose}>
                    {!editing ? "Close" : "Cancel"}
                </Button>
                {editing ? <> 

                        <Button  className="m-2" variant="primary" type="submit">
                            Update
                        </Button> 

                        <Button className="m-2 mr-5" variant="danger" onClick={handleDeleteSymptom}>
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
    );
};


export default SymptomModal;
