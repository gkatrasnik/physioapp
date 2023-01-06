//SYMPTOM MODAL

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../auth';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import LoadingModal from "./LoadingModal"
import Select from "react-select"


const SymptomModal = (props) => {
    const [editing, setEditing] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [intensity, setIntensity] = useState(0);
    const [duration, setDuration] = useState("");
    const [bodypartId, setBodypartId] = useState(0);    
    
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

    const handleUpdateSymptom = (e) => {
        e.preventDefault();
        updateSymptom();
        props.hideModal();   
        setEditing(false);   
    }

    const handleDeleteSymptom = () => {        
        deleteSymptom();
        props.hideModal();
        setEditing(false);            
    }

    const updateSymptom = async () => {      
        setLoading(true);   
        const queryData = await supabase
            .from('symptoms')
            .update({
                name: name,
                intensity: intensity,
                duration: duration,
                bodypart_id: bodypartId,
                issue_id: props.issueData.id,
                user_id: auth.userObj.id,
                org_id: auth.userObj.org_id
            })
            .eq('id', props.symptomData.id)

        if (queryData.error) {
            setLoading(false); 
            alert(queryData.error.message);
        } else {
            setLoading(false); 
            props.getSymptomsData(); 
        }
    }

    const deleteSymptom = async () => {
        setLoading(true); 
        const queryData = await supabase
            .from('symptoms')
            .update({
                rec_deleted:true
            })
            .eq('id', props.symptomData.id)

        if (queryData.error) {
            setLoading(false); 
            alert(queryData.error.message);
        } else {
            setLoading(false); 
            props.getSymptomsData();    
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

    return (        
        <>
        {loading && <LoadingModal />}
        <ConfirmDeleteModal
            show={showConfirmDelete}
            title={"Delete Symptom"}
            message={"Do you really want to delete this symptom?"}
            callback={handleDeleteSymptom}
            cancelCallback={toggleConfirmDelete}
        />

        <Modal centered backdrop="static" show={props.show} onHide={handleClose}>
            <Modal.Header className="py-2" closeButton>
            <Modal.Title className='text-center'>Symptom</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-2">
            <Form>
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
                    value={intensity}
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
                <Select
                    styles={{
                        control: (baseStyles, state) => ({
                        ...baseStyles
                        }),
                    }}
                    isDisabled={!editing}
                    options={props.bodypartsData}          
                    defaultValue={props.bodypartsData.find((bodypart) => bodypart.id === bodypartId)}
                    getOptionLabel={(option)=>option.label}
                    getOptionValue={(option)=>option.id}                    
                    onChange={(option) => {
                        setBodypartId(option.id);
                    }}
                >
                </Select>                                 
                </Form.Group>
                <div className='buttons-container'>                    
                    {editing ? 
                        <> 
                            <Button className="m-2 mr-5" variant="danger" onClick={toggleConfirmDelete}>
                                Delete
                            </Button> 
                            <Button  className="m-2" variant="secondary" onClick={handleUpdateSymptom}>
                                Save
                            </Button>                                
                        </> :
                        <Button className="m-2 " variant="outline-secondary" onClick={toggleEditing}>
                            Edit
                        </Button>
                    }
                    <Button className="ms-2 my-2" variant="outline-secondary" onClick={handleClose}>
                        {!editing ? "Close" : "Cancel"}
                    </Button>               
                </div>
            </Form>
            </Modal.Body>
        </Modal>
        </>
    );
};


export default SymptomModal;
