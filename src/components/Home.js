import React, { useState, useEffect } from 'react';
import {useAuth} from "../contexts/auth";
import {useAppData} from "../contexts/appDataContext";
import Layout from "./Layout";
import { Container, Card } from 'react-bootstrap';
import LoadingModal from "./modals/LoadingModal"
import packageJson from '../../package.json';


const Home = () => {
    const auth = useAuth();
    const appData= useAppData();
    
    
    //run after login
    useEffect(() => {  
        if (auth.userObj) {
            //imediately log out user if active===false
            if (!auth.userObj.active) {
                alert("Your account is not active.");
                auth.logout();
            } else {
                
                //load app data
                if (!(appData.orgUsers.length && appData.bodyParts.length)) {
                    console.log("MOUNTED HOME COMPONENT, LOADING APP DATA");
                    appData.loadAppData(auth.userObj.org_id);    
                }
            }        
            
            
        }
    }, [auth.userObj])

    // if organization is blocked, show alert and logout
    useEffect(() => {  
        if (appData.orgData) {
            if (appData.orgData.blocked) {
                alert("Your organization is blocked. You can not use your account.");
                auth.logout();
            }  
        }                   
    }, [appData.orgData])
    

    return (
        <>
        {appData.loadingData && <LoadingModal />}
        <Layout>
            <Container>                
                {appData.orgData &&                 
                <Card  className="px-5" style={{ width: "90%", maxWidth: "32rem", margin: "auto", marginTop: "5rem"}}>                               
                <Card.Body>
                    <Card.Title className='text-center'><h2>Organization</h2></Card.Title>                    
                    <Card.Text>{appData.orgData.name}</Card.Text> 
                    <Card.Text>{appData.orgData.address}</Card.Text> 
                    <Card.Text>{appData.orgData.zip_code}, {appData.orgData.city}</Card.Text>                     
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
                <p className='text-center mt-2'>App version: {packageJson.version}</p>    
            </Container>
        </Layout>
        </>
    );
};


export default Home;
