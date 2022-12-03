// textbox + search button
// list of search results

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Layout from "./Layout";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Form, Button,Col, Row, ButtonGroup, Container, Table} from "react-bootstrap";
import NewPatientModal from './modals/NewPatientModal';


const PatientSearchView = () => {
   const auth = useAuth();
   const [searchQuery, setSearchQuery] = useState("");
   const [showNewPatientModal, setShowNewPatientModal] = useState(false);
   const [patientsData, setPatientsData] = useState([]);  
   const [filteredPatients, setFilteredPatients] = useState([]);  
   const navigate = useNavigate();

    const handleSearch = (query) => {   
        if (patientsData.length) {
            console.log("patietns are there")
            if (query.length === 0) { //show all patients
                setFilteredPatients(patientsData);
            } else if (query.length > 2) {//auto filter patients when typing in search      
            const newArr = patientsData.filter(patient => patient.name.toLowerCase().includes(query.toLowerCase()));
            setFilteredPatients(newArr);
            }
        }
    }

    const toggleModal = () => {
        showNewPatientModal ? setShowNewPatientModal(false) : setShowNewPatientModal(true);
    }

    const getPatients = async () => {           
        const queryData = await supabase
            .from('patients')
            .select()            
            .eq("org_id", auth.user.user_metadata.org_id)
        
         if (queryData.error) {
            alert(queryData.error.message);
        }
        queryData.data.forEach(patient => patient.birthdate = new Date(patient.birthdate))
        setPatientsData(queryData.data);               
    }


    const toPatientProfile=(patient)=>{
     navigate('/patient',{state:{patientData:patient}});
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
        <Layout>
             
            <NewPatientModal 
                show={showNewPatientModal} 
                handleToggleModal={toggleModal}
                getPatients={getPatients}
            />
            <Container>
                <h1 className='text-center'>Patient Search View</h1>

                <Form className='my-3' onSubmit={handleSearch}>
                    <Row className="align-items-center">
                        <Col>
                            <Form.Group  controlId="patientSearch">
                                <Form.Control 
                                type="search" 
                                placeholder="Search by name" 
                                onChange={(e) => {
                                setSearchQuery(e.target.value);
                                }}/>                
                            </Form.Group>
                        </Col>
                        <Col>
                            <ButtonGroup aria-label="Basic example">                                
                                <Button variant="primary" onClick={toggleModal}>
                                    New Patient
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>            
                </Form>   

                <div className='table-container mb-5'>                
                    <Table striped hover>
                        <thead>
                            <tr>
                            <th>Patient Id</th>
                            <th>Name</th>
                            <th>Birth Date</th>
                            </tr>
                        </thead>
                        <tbody className='hand'>
                            
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
    );
};


export default PatientSearchView;
