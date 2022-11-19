
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Layout from "./Layout";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Form, Button,Col, Row, ButtonGroup, Container, Table} from "react-bootstrap";
import InterventionModal from './modals/InterventionModal';


const InterventionsList = (props) => {
   const auth = useAuth();
   const [showInterventionsModal, setShowInterventionsModal] = useState(false);
   const [interventionsData, setInterventionsData] = useState([]);  
   const navigate = useNavigate();

   

   const toggleModal = () => {
    setShowInterventionsModal(!showInterventionsModal);
   }

   
    const getInterventionsData = async () => {
         const queryData = await supabase
            .from('Interventions')
            .select()
            .eq('issue_id',props.issueData.id)
        if (queryData.error) {
            alert(queryData.error.message);
        }else {
            setInterventionsData(queryData.data)
        }     
    }

    

    //on component mount find all symptoms for this issue
    useEffect(() => {
      getInterventionsData();
    }, [])
    
   
    return (
        
        <>
            <InterventionModal 
                show={showInterventionsModal} 
                handleToggleModal={toggleModal}                
            />            
            <h1 className='text-center'>Interventions View</h1>


            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Id</th>
                    <th>Intervention</th>
                    <th>Date</th>
                    <th>Bla</th>
                    <th>Bla</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {interventionsData.length ? interventionsData.map((issue, index) => {
                    return (
                        <tr key={index} onClick={()=>{/*toIssueView(issue)*/}}>
                        <td>{issue.id}</td>
                        <td>{issue.name}</td>
                        <td>{new Date(issue.created_at).toLocaleDateString("sl")}</td>
                        <td>{issue.diagnosis}</td>
                        <td>{issue.resolved}</td>
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
            <Button  className="m-2" variant="primary" type="submit" onClick={toggleModal}>
                    Add Intervention
            </Button>
        </>
 
    );
};


export default InterventionsList;
