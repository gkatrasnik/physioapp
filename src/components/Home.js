import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import {useAuth} from "../auth";
import Layout from "./Layout";
import { Container, Card } from 'react-bootstrap';
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
            //imediately log out user if active===false
            if (!auth.userObj.active) {
                alert("Your account is not active.");
                auth.logout();
            } else {
                getOrgData(auth.userObj.org_id);  
            }            
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

                {orgData &&                 
                <Card  className="px-5" style={{ width: "90%", maxWidth: "32rem", margin: "auto", marginTop: "5rem"}}>                               
                <Card.Body>
                    <Card.Title className='text-center'><h2>Organization</h2></Card.Title>                    
                    <Card.Text>{orgData.name}</Card.Text> 
                    <Card.Text>{orgData.address}</Card.Text> 
                    <Card.Text>{orgData.zip_code}, {orgData.city}</Card.Text>                     
                </Card.Body>
                </Card>}

                {auth.userObj && 
                <Card className="px-5" style={{ width: "90%", maxWidth: "32rem", margin: "auto", marginTop: "2rem"}}>                
                <Card.Body>
                    <Card.Title className='text-center'><h2>Therapist</h2></Card.Title>
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
