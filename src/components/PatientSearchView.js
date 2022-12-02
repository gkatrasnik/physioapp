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
   const navigate = useNavigate();

   const handleSearch = (e) => {
    if(e) {
        e.preventDefault();
    }

    if (searchQuery === "") {
        getPatients(searchQuery, false);
    } else {
        getPatients(searchQuery, true);
    }
    
   }

   const toggleModal = () => {
    showNewPatientModal ? setShowNewPatientModal(false) : setShowNewPatientModal(true);
   }

   const getPatients = async (searchString, getAll) => {    
        let queryData;   

        if (getAll){
            queryData = await supabase
            .from('patients')
            .select("id, name, birthdate")
            .textSearch('name', searchString, {type:'websearch'})
            .eq("org_id", auth.user.user_metadata.org_id)
        } else {
            queryData = await supabase
            .from('patients')
            .select("id, name, birthdate")
            .eq("org_id", auth.user.user_metadata.org_id)
        }        

        if (queryData.error) {
            console.log(queryData.error.message);
        }
        
        setPatientsData(queryData.data);               
    }


    const toPatientProfile=(patient)=>{
     navigate('/patient',{state:{patientData:patient}});
    }

    
    //on component mount search all patients
    useEffect(() => {
      handleSearch();     
    }, []) 
   


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
                                <Button variant="primary" type="submit" >
                                    Search
                                </Button>
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
                        <tbody>
                            
                        {patientsData && patientsData.length ? patientsData.map((patient, index) => {
                            return (
                                <tr key={index} onClick={()=>{toPatientProfile(patient)}}>
                                <td>{patient.id}</td>
                                <td>{patient.name}</td>
                                <td>{patient.birthdate}</td>
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
