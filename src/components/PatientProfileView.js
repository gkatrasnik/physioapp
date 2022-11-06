// basic patient info
// isues list (aslo show qucick symptom/intervention info)
// bodyPicture with issues/symptoms
// issue photos
// search issues?
// current (open) issues (maybe show only those on bodyPicture?)

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import Layout from "./Layout";
import { Container, Button } from 'react-bootstrap';

const PatientProfileView = () => {
   // const auth = useAuth();
   // const [userData, setUserData] = useState();
    const location = useLocation();
    const navigate = useNavigate();


    useEffect(() => {
    console.log("patient location state", location.state)
    
    }, [])

    const deletePatient = async () => {      

        const queryData = await supabase
            .from('patients')
            .delete()
            .eq('id',location.state.patientData.id)

        if (queryData.error) {
            console.log(queryData.error.message);
        }      
        
        navigate("/patients");
    }
    


    return (
        <Layout>
            <Container>
                <h1 className="text-center">Patient Profile View</h1>
                <div>{location.state.patientData.name}</div>
                <Button variant="danger" onClick={deletePatient}>Delete Patient</Button>
            </Container>
        </Layout>
    );
};


export default PatientProfileView;
