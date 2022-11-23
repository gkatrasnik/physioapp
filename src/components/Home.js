import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import {useAuth} from "../auth";
import Layout from "./Layout";
import { Container } from 'react-bootstrap';

const Home = () => {
    const auth = useAuth();
    const [orgData, setOrgData] = useState(null);

    const getOrgData = async (org_id) => {
        const queryData = await supabase
            .from('organizations')
            .select()
            .eq("id", org_id)

        if (queryData.error) {
            console.log(queryData.error.message)
        }
        setOrgData(queryData.data[0]);
    }

    useEffect(() => {        
       auth.userObj&& getOrgData(auth.userObj.org_id);
    }, [auth.userObj])

    return (
        <Layout>
            <Container>
                <h1 className='text-center'>Home</h1>
                <h2 className='text-center'>Organization Info</h2>
                {orgData && 
                <div className='m-5'>
                    <p>{orgData.name}</p>
                    <p>{orgData.address}</p>  
                    <p>{orgData.zip_code}, {orgData.city}</p>
                </div>}
            </Container>
        </Layout>
    );
};


export default Home;
