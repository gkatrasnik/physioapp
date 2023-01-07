
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Button, Table} from "react-bootstrap";
import InterventionModal from './modals/InterventionModal';
import NewInterventionModal from './modals/NewInterventionModal';
import moment from 'moment';
import LoadingModal from "./modals/LoadingModal"
import {useAppData} from "../contexts/appDataContext";


const InterventionsList = (props) => {
    const appData = useAppData();

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

    

    const getUserName = (userId) => {
        const userObj = appData.orgUsers.find(user => user.id === userId);
        return userObj ? userObj.name : "Unknown";
    }
   
    //on component mount find all interventions for this issue
    useEffect(() => {
        if (props.issueData) {
            getInterventionsData();
        }
      
    }, [props.issueData])

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
                <h2 className='text-center mt-4 mb-4'>Interventions</h2>
                <div className='buttons-container'>
                    <Button  className="ms-2 my-2" variant="secondary" onClick={toggleNewInterventionModal}>
                            New Intervention
                    </Button>
                </div>
                <div className='table-container mb-5'>  
                    <Table striped hover>
                        <thead>
                            <tr>                            
                            <th>Intervention</th>
                            <th>Date</th>                    
                            <th>Duration</th>
                            <th>Therapist</th>
                            <th>Notes</th>
                            </tr>
                        </thead>

                        <tbody className='cursor-pointer'>                    
                            {interventionsData.length ? interventionsData.map((intervention, index) => {
                                return (
                                    <tr key={index} onClick={()=>{showUpdateInterventionModal(intervention)}}>
                                    <td>{intervention.treatment}</td>
                                    <td>{moment(intervention.created_at).toDate().toLocaleDateString("sl")}</td>
                                    <td>{intervention.duration}</td>
                                    <td>{getUserName(intervention.user_id)}</td> 
                                    <td>{intervention.notes ? intervention.notes : "Empty"}</td>                                    
                                    </tr>
                                )
                            }):                     
                                <tr>
                                    <td colSpan={5}>
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
