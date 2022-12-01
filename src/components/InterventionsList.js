
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Form, Button,Col, Row, ButtonGroup, Container, Table} from "react-bootstrap";
import InterventionModal from './modals/InterventionModal';
import NewInterventionModal from './modals/NewInterventionModal';
import { useAuth } from '../auth';


const InterventionsList = (props) => {
    const auth = useAuth();

    const [showInterventionModal, setShowInterventionModal] = useState(false);
    const [showNewInterventionModal, setShowNewInterventionModal] = useState(false);
    const [interventionsData, setInterventionsData] = useState([]);  
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
            .order('created_at', { ascending: false })
        if (queryData.error) {
            alert(queryData.error.message);
        }else {
            setInterventionsData(queryData.data)
        }     
    }
   
    //on component mount find all interventions for this issue
    useEffect(() => {
      getInterventionsData();
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

            <Button  className="m-2" variant="primary" type="submit" onClick={toggleNewInterventionModal}>
                    Add Intervention
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Id</th>
                    <th>Intervention</th>
                    <th>Date</th>                    
                    <th>Duration</th>
                    <th>Notes</th>
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
            
        </>
 
    );
};


export default InterventionsList;