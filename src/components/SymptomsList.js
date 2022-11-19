
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Layout from "./Layout";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Form, Button,Col, Row, ButtonGroup, Container, Table} from "react-bootstrap";
import SymptomModal from './modals/SymptomModal';


const SymptomsList = (props) => {
   const auth = useAuth();
   const [showSymptomModal, setShowSymptomModal] = useState(false);
   const [symptomsData, setSymptomsData] = useState([]);  
   const navigate = useNavigate();

   

   const toggleModal = () => {
    setShowSymptomModal(!showSymptomModal);
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

    

    //on component mount find all symptoms for this issue
    useEffect(() => {
      getSymptomsData();
    }, [])
    
   
    return (
        
        <>
            <SymptomModal 
                show={showSymptomModal} 
                handleToggleModal={toggleModal}                
            />            
            <h1 className='text-center'>Symptom View</h1>


            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Id</th>
                    <th>Symptom</th>
                    <th>Date</th>
                    <th>Bla</th>
                    <th>Bla</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {symptomsData.length ? symptomsData.map((issue, index) => {
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
                                    No Symptoms
                            </td>                               
                        </tr>
                }   
                </tbody>
            </Table> 

            <Button  className="m-2" variant="primary" type="submit" onClick={toggleModal}>
                    Add Symptom
            </Button>
        </>
 
    );
};


export default SymptomsList;
