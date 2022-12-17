
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Form, Button,Col, Row, ButtonGroup, Container, Table} from "react-bootstrap";
import InterventionModal from './modals/InterventionModal';
import NewInterventionModal from './modals/NewInterventionModal';
import { useAuth } from '../auth';
import moment from 'moment';
import LoadingModal from "./modals/LoadingModal"



const InterventionsList = (props) => {
    const auth = useAuth();

    const [showInterventionModal, setShowInterventionModal] = useState(false);
    const [showNewInterventionModal, setShowNewInterventionModal] = useState(false);
    const [interventionsData, setInterventionsData] = useState([]);  
    const [currentInterventionData, setCurrentInterventionData] = useState(null)
        const [loading, setLoading] = useState(false);

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
            setLoading(true); 
            const queryData = await supabase
            .from('interventions')
            .select()
            .eq('issue_id',props.issueData.id)
            .eq("rec_deleted", false)
            .order('created_at', { ascending: false })
        if (queryData.error) {
            setLoading(false); 
            alert(queryData.error.message);
        }else {
            setLoading(false); 
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
            {loading && <LoadingModal />}
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

            <div className="my-3 mx-auto component-big">
                <h2 className='text-center'>Interventions</h2>
                <Button  className="m-2" variant="primary" type="submit" onClick={toggleNewInterventionModal}>
                        New Intervention
                </Button>
                <div className='table-container mb-5'>  
                    <Table striped hover>
                        <thead>
                            <tr>
                            <th>Id</th>
                            <th>Intervention</th>
                            <th>Date</th>                    
                            <th>Duration</th>
                            <th>Notes</th>
                            </tr>
                        </thead>

                        <tbody className='cursor-pointer'>                    
                            {interventionsData.length ? interventionsData.map((intervention, index) => {
                                return (
                                    <tr key={index} onClick={()=>{showUpdateInterventionModal(intervention)}}>
                                    <td>{intervention.id}</td>
                                    <td>{intervention.treatment}</td>
                                    <td>{moment(intervention.created_at).toDate().toLocaleDateString("sl")}</td>
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
                </div>
            </div>
        </>
 
    );
};


export default InterventionsList;
