//issue details + (CRUD symptoms/interventions)
//issue photos
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Layout from "./Layout";
import { useAuth } from '../auth';

const IssueView = () => {
    const auth = useAuth();
   // const [userData, setUserData] = useState();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState();
    const [birthDate, setBirdhDate] = useState();
    const [occupation, setOccupation] = useState("");


    const handleNewPatient = (e) => {
        e.preventDefault();
        addIssue();
    }

    const addIssue = async () => {        

        const queryData = await supabase
            .from('patients')
            .insert({
                name: name,
                email: email,
                phone: phone,
                address: address,
                city: city,
                zip_code: zip,
                birthdate: birthDate,
                occupation: occupation,
                user_id: auth.user.id
            })

        if (queryData.error) {
            console.log(queryData.error.message);
        }else {
            console.log(queryData)
        }     
        
        
    }



    return (
        <Layout>
            <h1>Issue View</h1>
            
        </Layout>
    );
};


export default IssueView;

