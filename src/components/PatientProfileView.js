// basic patient info
// isues list (aslo show qucick symptom/intervention info)
// bodyPicture with issues/symptoms
// issue photos
// search issues?
// current (open) issues (maybe show only those on bodyPicture?)

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import Layout from "./Layout";

const PatientProfileView = () => {
   // const auth = useAuth();
   // const [userData, setUserData] = useState();
    const location = useLocation();


    useEffect(() => {
    console.log("patient location state", location.state)
    
    }, [])


    return (
        <Layout>
            <h1>Patient Profile View</h1>
            <div>{location.state.patientData.name}</div>
        </Layout>
    );
};


export default PatientProfileView;
