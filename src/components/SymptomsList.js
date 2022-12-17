
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Button, Table} from "react-bootstrap";
import SymptomModal from './modals/SymptomModal';
import NewSymptomModal from './modals/NewSymptomModal';
import moment from 'moment'
import LoadingModal from "./modals/LoadingModal"
import BodyPicture from './BodyPicture';



const SymptomsList = (props) => {
    const [showSymptomModal, setShowSymptomModal] = useState(false);
    const [showNewSymptomModal, setShowNewSymptomModal] = useState(false);
    const [symptomsData, setSymptomsData] = useState([]);  
    const [bodypartsData, setBodypartsData] = useState([]);  
    const [currentSymptomData, setCurrentSymptomData] = useState(null);
    const [loading, setLoading] = useState(false);

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
        setLoading(true); 
        const queryData = await supabase
            .from('symptoms')
            .select()
            .eq('issue_id',props.issueData.id)
            .eq("rec_deleted", false)
            .order('created_at', { ascending: false })
        if (queryData.error) {
            setLoading(false); 
            alert(queryData.error.message);
        }else {
            setLoading(false); 
            setSymptomsData(queryData.data)
        }     
    }

    const getBodypartsData = async () => {
        setLoading(true); 
         const queryData = await supabase
            .from('bodyparts')
            .select()
            .eq("rec_deleted", false)
        if (queryData.error) {
            setLoading(false); 
            alert(queryData.error.message);
        }else {
            setLoading(false); 
            setBodypartsData(queryData.data)
        }     
    }

    const getBodypartName = (bodypartId) => {
        if (!bodypartsData.length) {
            return "No data"; 
        }
        const bodypartObj = bodypartsData.find(bodypart => bodypart.id === bodypartId);
        return bodypartObj  ? (bodypartObj.body_side || "") + " "+ bodypartObj.name : "No data";
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
            {loading && <LoadingModal />}
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
                getSymptomsData = {getSymptomsData}
            />
            <div className="my-3 mx-auto component-big">
                <h2 className='text-center'>Symptoms</h2>
                <Button  className="m-2" variant="primary" type="submit" onClick={toggleNewSymptomModal}>
                        New Symptom
                </Button>
                <div className='table-container mb-5'>  
                    <Table striped hover>
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

                        <tbody className='cursor-pointer'>                        
                            {symptomsData.length ? symptomsData.map((symptom, index) => {
                                return (
                                    <tr key={index} onClick={()=>{showUpdateSymptomModal(symptom)}}>
                                    <td>{symptom.id}</td>
                                    <td>{symptom.name}</td>
                                    <td>{moment(symptom.created_at).toDate().toLocaleDateString("sl")}</td>
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
                </div>  
            </div>         
            <BodyPicture
                bodypartsData={bodypartsData}
                symptomsData={symptomsData}
                activeTab={props.activeTab}
            />
        </> 
    );
};


export default SymptomsList;
