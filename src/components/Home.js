import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import {useAuth} from "../auth";
import Layout from "./Layout";
import { Container, Card } from 'react-bootstrap';

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
      getOrgData(auth.user.user_metadata.org_id);
    }, [])

    return (
        <Layout>
            <Container>
                <h1 className='text-center'>Home</h1>

                {orgData &&                 
                <Card  className="px-5" style={{ width: "90%", maxWidth: "32rem", margin: "auto", marginTop: "2rem"}}>                
                <Card.Body>
                    <Card.Title className='text-center'>Organization</Card.Title>
                    <Card.Text>{orgData.name}</Card.Text> 
                    <Card.Text>{orgData.address}</Card.Text> 
                    <Card.Text>{orgData.zip_code}, {orgData.city}</Card.Text>                     
                </Card.Body>
                </Card>}

                {auth.user.user_metadata && 
                <Card className="px-5" style={{ width: "90%", maxWidth: "32rem", margin: "auto", marginTop: "2rem"}}>                
                <Card.Body>
                    <Card.Title className='text-center'>Therapist</Card.Title>
                    <Card.Text>{auth.user.user_metadata.name}</Card.Text> 
                    <Card.Text>{auth.user.email}</Card.Text> 
                    <Card.Text>{auth.user.user_metadata.phone}</Card.Text>                   
                </Card.Body>
                </Card>}
            </Container>
        </Layout>
    );
};


export default Home;
