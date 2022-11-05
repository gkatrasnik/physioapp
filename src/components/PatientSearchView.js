// textbox + search button
// list of search results

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Layout from "./Layout";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

const PatientSearchView = () => {
   const auth = useAuth();
   const [patientsData, setPatientsData] = useState([]);

   const navigate = useNavigate();

   const getPatients = async (user_id, searchString) => {
        const queryData = await supabase
            .from('patients')
            .select()
            .eq("user_id", user_id)

        if (queryData.error) {
            console.log(queryData.error.message);
        }
        setPatientsData(queryData.data);
    }

   const toPatientProfile=(patient)=>{
       navigate('/patient',{state:{patientData:patient}});
   }

   /*on search click {     
    getPatients(auth.user.id, patientSearch);     
   }, [])*/
   



    return (
        <Layout>
            <>
            <h1>Patient Search View</h1>

                {patientsData && patientsData.map((item, index) => {
                    return (
                        <h1>{item}</h1>
                    )
                })}
            
            </>
        </Layout>
    );
};


export default PatientSearchView;
