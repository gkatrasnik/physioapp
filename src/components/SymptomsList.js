
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Layout from "./Layout";
import { Form, Button,Col, Row, ButtonGroup, Container, Table} from "react-bootstrap";
import SymptomModal from './modals/SymptomModal';
import NewSymptomModal from './modals/NewSymptomModal';


const SymptomsList = (props) => {
    const [showSymptomModal, setShowSymptomModal] = useState(false);
    const [showNewSymptomModal, setShowNewSymptomModal] = useState(false);
    const [symptomsData, setSymptomsData] = useState([]);  
    const [bodypartsData, setBodypartsData] = useState([]);  
    const [currentSymptomData, setCurrentSymptomData] = useState(null);


    const showUpdateSymptomModal = (symptomObj) => { 
        setCurrentSymptomData(symptomObj);  
    }

    const hideUpdateSymptomModal = () => {
        setShowSymptomModal(false);
        setCurrentSymptomData(null);  
    }


    const toggleNewSymptomModal = () => {
        setShowNewSymptomModal(!showNewSymptomModal);
    }
    

   
    const getSymptomsData = async () => {
         const queryData = await supabase
            .from('symptoms')
            .select()
            .eq('issue_id',props.issueData.id)
        if (queryData.error) {
            alert(queryData.error.message);
        }else {
            setSymptomsData(queryData.data)
        }     
    }

    const getBodypartsData = async () => {
         const queryData = await supabase
            .from('bodyparts')
            .select()
        if (queryData.error) {
            alert(queryData.error.message);
        }else {
            setBodypartsData(queryData.data)
        }     
    }

    const getBodypartName = (bodypartId) => {
        if (!bodypartsData.length) {
            return "No data"; 
        }
        const bodypartObj = bodypartsData.find(bodypart => bodypart.id === bodypartId);
        return bodypartObj && bodypartObj.name ? bodypartObj.name : "No data";
    }


    //on component mount find all symptoms for this issue
    useEffect(() => {
      getSymptomsData();
      getBodypartsData();
    }, [])

    //show modal after current symptom data changes
    useEffect(() => {
        if (currentSymptomData) {
            setShowSymptomModal(true); 
        }
          
    }, [currentSymptomData])
    
    
   
    return (
        
        <>
            <SymptomModal 
                show={showSymptomModal} 
                hideModal={hideUpdateSymptomModal}   
                issueData = {props.issueData}    
                symptomData = {currentSymptomData}
                getSymptomsData = {getSymptomsData}
            />       

            <NewSymptomModal 
                show={showNewSymptomModal} 
                toggleModal={toggleNewSymptomModal}   
                issueData = {props.issueData}    
                symptomData = {currentSymptomData}
                getSymptomsData = {getSymptomsData}
            />

            <h1 className='text-center'>Symptoms</h1>

            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Id</th>
                    <th>Symptom</th>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>Intensity</th>
                    <th>Body Part</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {symptomsData.length ? symptomsData.map((symptom, index) => {
                    return (
                        <tr key={index} onClick={()=>{showUpdateSymptomModal(symptom)}}>
                        <td>{symptom.id}</td>
                        <td>{symptom.name}</td>
                        <td>{new Date(symptom.created_at).toLocaleDateString("sl")}</td>
                        <td>{symptom.duration}</td>
                        <td>{symptom.intensity}</td>
                        <td>{getBodypartName(symptom.bodypart_id)}</td>    
                        </tr>
                        )
                    }):                     
                        <tr>
                            <td colSpan={6}>
                                No Symptoms
                            </td>                               
                        </tr>
                }   
                </tbody>
            </Table> 

            <Button  className="m-2" variant="primary" type="submit" onClick={toggleNewSymptomModal}>
                    Add Symptom
            </Button>
        </>
 
    );
};


export default SymptomsList;
