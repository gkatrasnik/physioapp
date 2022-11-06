// textbox + search button
// list of search results

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Layout from "./Layout";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Form, Button,Col, Row, ListGroup, Container} from "react-bootstrap";


const PatientSearchView = () => {
   const auth = useAuth();
   const [searchQuery, setSearchQuery] = useState("");
   const [patientsData, setPatientsData] = useState([]);   

   const navigate = useNavigate();

   const handleSubmit = (e) => {
    e.preventDefault();
    getPatients(auth.user.id, searchQuery);
   }

   const getPatients = async (user_id, searchString) => {
        const queryData = await supabase
            .from('patients')
            .select("id, name")
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
            <Container>
                <h1 className='text-center'>Patient Search View</h1>

                <Form className='my-3' onSubmit={handleSubmit}>
                    <Row>
                        <Col xs={8}>
                            <Form.Group  controlId="patientSearch">
                                <Form.Control type="text" placeholder="Search by name, phone, email..." 
                                onChange={(e) => {
                                setSearchQuery(e.target.value);
                                }}/>                
                            </Form.Group>
                        </Col>
                        <Col >
                            <Button variant="primary" type="submit" >
                                Submit
                            </Button>
                        </Col>
                    </Row>            
                </Form>
                <ListGroup>
                    {patientsData && patientsData.map((patient, index) => {
                        return (
                            <ListGroup.Item key={index} onClick={()=>{toPatientProfile(patient)}}> {patient.id}. {patient.name}</ListGroup.Item>
                        )
                    })}             
                
                </ListGroup>              
            
            </Container>
        </Layout>
    );
};


export default PatientSearchView;
