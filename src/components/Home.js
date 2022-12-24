import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import {useAuth} from "../auth";
import Layout from "./Layout";
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoadingModal from "./modals/LoadingModal"


const Home = () => {
    const auth = useAuth();
    const [orgData, setOrgData] = useState(null);
        const [loading, setLoading] = useState(false);

    const getOrgData = async (org_id) => {
        setLoading(true); 
        const queryData = await supabase
            .from('organizations')
            .select()
            .eq("id", org_id)
            .eq("rec_deleted", false)
        if (queryData.error) {
            setLoading(false); 
            alert(queryData.error.message)
        } else {
            setLoading(false); 
            setOrgData(queryData.data[0]);
        }
        
    }
    

    useEffect(() => {  
        if (auth.userObj) {
            getOrgData(auth.userObj.org_id);  
        }                   
    }, [auth.userObj])

    // if organization is blocked, show alert and logout
    useEffect(() => {  
        if (orgData) {
            if (orgData.blocked) {
                alert("Your organization is blocked. You can not use your account.");
                auth.logout();
            }  
        }                   
    }, [orgData])

    return (
        <>
        {loading && <LoadingModal />}
        <Layout>
            <Container>
                <h1 className='text-center page-heading'>Home</h1>

                <Card className="px-5" style={{ width: "90%", maxWidth: "32rem", margin: "auto", marginTop: "2rem"}}>                
                <Card.Body className="d-flex flex-row justify-content-around">
                    <Link to={"/patients"}><Button size="lg">Patients</Button></Link>
                    <Link to={"/appointments"}><Button size="lg">Calendar</Button></Link>
                </Card.Body>
                </Card>

                {orgData &&                 
                <Card  className="px-5" style={{ width: "90%", maxWidth: "32rem", margin: "auto", marginTop: "2rem"}}>                
                <Card.Body>
                    <Card.Title className='text-center'>Organization</Card.Title>
                    <Card.Text>{orgData.name}</Card.Text> 
                    <Card.Text>{orgData.address}</Card.Text> 
                    <Card.Text>{orgData.zip_code}, {orgData.city}</Card.Text>                     
                </Card.Body>
                </Card>}

                {auth.userObj && 
                <Card className="px-5" style={{ width: "90%", maxWidth: "32rem", margin: "auto", marginTop: "2rem"}}>                
                <Card.Body>
                    <Card.Title className='text-center'>Therapist</Card.Title>
                    <Card.Text>{auth.userObj.name}</Card.Text> 
                    <Card.Text>{auth.userObj.email}</Card.Text> 
                    <Card.Text>{auth.userObj.phone}</Card.Text>                   
                </Card.Body>
                </Card>}                
            </Container>
        </Layout>
        </>
    );
};


export default Home;
