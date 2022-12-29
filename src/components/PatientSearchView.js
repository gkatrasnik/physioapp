// textbox + search button
// list of search results

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Layout from "./Layout";
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Table} from "react-bootstrap";
import NewPatientModal from './modals/NewPatientModal';
import moment from 'moment'
import LoadingModal from "./modals/LoadingModal";

const PatientSearchView = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showNewPatientModal, setShowNewPatientModal] = useState(false);
    const [patientsData, setPatientsData] = useState([]);  
    const [filteredPatients, setFilteredPatients] = useState([]);  
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSearch = () => {   
        if (searchQuery.length === 0) { //show all patients - whole original data we get from db (patients of this org)
            setFilteredPatients(patientsData);
        } else if (searchQuery.length) {//auto filter patients when typing in search      
            const newArr = patientsData.filter(patient => patient.name.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredPatients(newArr);
        }
    }

    const toggleModal = () => {
        setShowNewPatientModal(!showNewPatientModal);
    }

    const getPatients = async () => {     
        setLoading(true);      
        const queryData = await supabase
            .from('patients')
            .select()            
            .eq("rec_deleted", false)
        
        if (queryData.error) {
            setLoading(false);
            alert(queryData.error.message);
        } else {
            setLoading(false);
            queryData.data.forEach(patient => patient.birthdate = moment(patient.birthdate).toDate())
            setPatientsData(queryData.data); 
        }
                      
    }


    const toPatientProfile=(patient)=>{
     navigate('/profile',{state:{patientData:patient}});
    }

    
    //on component get all patients data
    useEffect(() => {
      getPatients();    
    }, []) 

    useEffect(() => { //on patients data change, show all patients
      handleSearch("");  
    }, [patientsData]) 

    useEffect(() => { //on search query change, handle search
        handleSearch(searchQuery);
    }, [searchQuery])
    
   


    return (
        <>
        {loading && <LoadingModal />}        
        <Layout>
             
            <NewPatientModal 
                show={showNewPatientModal} 
                handleToggleModal={toggleModal}
                getPatients={getPatients}
            />
            <Container className="min-h-100-without-navbar">
                <h1 className='text-center custom-page-heading-1 mt-5 mb-4'>Patients</h1>

                <Form className='my-4' onSubmit={e => { e.preventDefault()}}>
                    <div className="d-flex">                      
                            <Form.Control 
                            className="col"
                            type="search" 
                            placeholder="Type to search..." 
                            onChange={(e) => {
                            setSearchQuery(e.target.value);
                            }}/>              
                                             
                            <Button variant="secondary" onClick={toggleModal} className="custom-new-button">
                                New Patient
                            </Button>                        
                    </div>               
                </Form>   

                <div className='table-container mb-5'>                
                    <Table hover>
                        <thead>
                            <tr>
                            <th>Patient Id</th>
                            <th>Name</th>
                            <th>Birth Date</th>
                            </tr>
                        </thead>
                        <tbody className='cursor-pointer'>
                            
                        {filteredPatients && filteredPatients.length ? filteredPatients.map((patient, index) => {
                            return (
                                <tr key={index} onClick={()=>{toPatientProfile(patient)}}>
                                <td>{patient.id}</td>
                                <td>{patient.name}</td>
                                <td>{patient.birthdate.toLocaleDateString("sl")}</td>
                                </tr>
                                )
                            }):                     
                                <tr>
                                    <td colSpan={3}>
                                        No results
                                    </td>                               
                                </tr>
                        }   
                        </tbody>
                    </Table>         
                </div>
            </Container>
        </Layout>
        </>
    );
};


export default PatientSearchView;
