
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Form, Button,Col, Row, ButtonGroup, Container, Table} from "react-bootstrap";
import InterventionModal from './modals/InterventionModal';
import NewInterventionModal from './modals/NewInterventionModal';


const InterventionsList = (props) => {
    const [showInterventionModal, setShowInterventionModal] = useState(false);
    const [showNewInterventionModal, setShowNewInterventionModal] = useState(false);
    const [interventionsData, setInterventionsData] = useState([]);  
    const [therapistsData, setTherapistsData] = useState([]);  
    const [currentInterventionData, setCurrentInterventionData] = useState(null)

    const showUpdateInterventionModal = (interventionObj) => { 
        setCurrentInterventionData(interventionObj);                      
    }

    const hideUpdateInterventionModal = () => {
        setShowInterventionModal(false);
        setCurrentInterventionData(null);    
    }


    const toggleNewInterventionModal = () => {
        setShowNewInterventionModal(!showNewInterventionModal);
    }
   
    const getInterventionsData = async () => {
            const queryData = await supabase
            .from('interventions')
            .select()
            .eq('issue_id',props.issueData.id)
        if (queryData.error) {
            alert(queryData.error.message);
        }else {
            setInterventionsData(queryData.data)
        }     
    }

    const getTherapistsData = async () => {
            const queryData = await supabase
            .from('users')
            .select()            
        if (queryData.error) {
            alert(queryData.error.message);
        }else {
            setTherapistsData(queryData.data)
        }     
    }

    const getTherapistName = (therapistId) => {
        if (!therapistsData.length) {
            return "No data";
        }
        const therapistObj = therapistsData.find(therapist => therapist.id === therapistId);
        return therapistObj.name ? therapistObj.name : "No data";
    }
   
    //on component mount find all interventions for this issue
    useEffect(() => {
      getInterventionsData();
      getTherapistsData();
    }, [])

    // only show intervention modal afer current intervention data is updated
    useEffect(() => {
        if (currentInterventionData) {
            setShowInterventionModal(true); 
        }      
    }, [currentInterventionData])
    
    
    return (
        
        <>
            <InterventionModal 
                show={showInterventionModal} 
                hideModal={hideUpdateInterventionModal}                  
                issueData = {props.issueData}    
                interventionData = {currentInterventionData}
                getInterventionsData = {getInterventionsData}
            />

            <NewInterventionModal 
                show={showNewInterventionModal} 
                toggleModal={toggleNewInterventionModal}  
                issueData = {props.issueData}    
                interventionData = {currentInterventionData}
                getInterventionsData = {getInterventionsData}
            />


            <h1 className='text-center'>Interventions</h1>


            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Id</th>
                    <th>Intervention</th>
                    <th>Date</th>                    
                    <th>Duration</th>
                    <th>Notes</th>
                    <th>Therapist</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {interventionsData.length ? interventionsData.map((intervention, index) => {
                        return (
                            <tr key={index} onClick={()=>{showUpdateInterventionModal(intervention)}}>
                            <td>{intervention.id}</td>
                            <td>{intervention.treatment}</td>
                            <td>{new Date(intervention.created_at).toLocaleDateString("sl")}</td>
                            <td>{intervention.duration}</td>
                            <td>{intervention.notes ? intervention.notes : "Empty"}</td>
                            <td>{getTherapistName(intervention.therapist_id)}</td>
                            </tr>
                        )
                    }):                     
                        <tr>
                            <td colSpan={6}>
                                No Interventions
                            </td>                               
                        </tr>
                    }   
                </tbody>
            </Table> 
            <Button  className="m-2" variant="primary" type="submit" onClick={toggleNewInterventionModal}>
                    Add Intervention
            </Button>
        </>
 
    );
};


export default InterventionsList;
