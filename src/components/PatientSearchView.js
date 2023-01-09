// textbox + search button
// list of search results

import React, { useState, useEffect } from 'react';
import Layout from "./Layout";
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Table} from "react-bootstrap";
import NewPatientModal from './modals/NewPatientModal';
import LoadingModal from "./modals/LoadingModal";
import { useAppData } from '../contexts/appDataContext';

const PatientSearchView = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showNewPatientModal, setShowNewPatientModal] = useState(false);
    const [filteredPatients, setFilteredPatients] = useState([]);  
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const appData = useAppData();

    const handleSearch = () => {   
        if (searchQuery.length === 0) { //show all patients - whole original data we get from db (patients of this org)
            setFilteredPatients(appData.orgPatients);
        } else if (searchQuery.length) {//auto filter patients when typing in search      
            const newArr = appData.orgPatients.filter(patient => patient.name.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredPatients(newArr);
        }
    }

    const toggleModal = () => {
        setShowNewPatientModal(!showNewPatientModal);
    }



    const toPatientProfile=(patient)=>{ 
     navigate('/profile',{state:{patientData:patient}});
    }

    
    //on component get all patients data
    useEffect(() => {
      appData.getOrgPatients();
      window.scrollTo(0, 0);
    }, [])
    

    useEffect(() => { //on patients data change, show all patients
      handleSearch("");  
    }, [appData.orgPatients]) 

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
                            <th>Name</th>
                            <th>Birth Date</th>
                            </tr>
                        </thead>
                        <tbody className='cursor-pointer'>
                            
                        {filteredPatients && filteredPatients.length ? filteredPatients.map((patient, index) => {
                            return (
                                <tr key={index} onClick={()=>{toPatientProfile(patient)}}>
                                    <td>{patient.name}</td>
                                    <td>{patient.birthdate ? patient.birthdate.toLocaleDateString("sl") : "No Data"}</td>
                                </tr>
                                )
                            }):                     
                                <tr>
                                    <td colSpan={2}>
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
