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
    e.preventDefault();
    getPatients(auth.user.id, searchQuery);
   }

   const toggleModal = () => {
    showNewPatientModal ? setShowNewPatientModal(false) : setShowNewPatientModal(true);
   }

   const handleAddPatient = (e) => {
        e.preventDefault();

   }

   const getPatients = async (user_id, searchString) => {
        const queryData = await supabase
            .from('patients')
            .select("id, name, birthdate")
            .textSearch('name', searchString)

        if (queryData.error) {
            console.log(queryData.error.message);
        }
        
        setPatientsData(queryData.data);
        
        
    }

   const toPatientProfile=(patient)=>{
    navigate('/patient',{state:{patientData:patient}});
   }
   



    return (
        <Layout>
             
            <NewPatientModal 
                show={showNewPatientModal} 
                handleToggleModal={toggleModal}/>
            <Container>
                <h1 className='text-center'>Patient Search View</h1>

                <Form className='my-3' onSubmit={handleSearch}>
                    <Row className="align-items-center">
                        <Col>
                            <Form.Group  controlId="patientSearch">
                                <Form.Control type="text" placeholder="Search by name" 
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

                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Id</th>
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
            
            </Container>
        </Layout>
    );
};


export default PatientSearchView;
